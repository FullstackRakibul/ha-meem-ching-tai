<!-- components/landing/ProductRail.vue -->
<script setup lang="ts">
/**
 * Scene 07 — Catalogue. A 3D perspective fan carousel on a dark ground.
 *
 * Visual model: cards arc in a concave fan using CSS perspective + rotateY +
 * translateZ. The centre card is upright, full-scale, and closest to the
 * viewer. Each card to the left/right tilts away and recedes on Z, producing
 * true depth — not a flat scale stack. Cards are landscape (16:9).
 *
 * Perf contract: per frame we write EXACTLY four composited properties
 * (scale, opacity, rotateY, translateZ) per card, only inside a 1.15 ×
 * half-width cull band. Everything else (glow, gold tint, caption) is a
 * single `is-active` class toggled when the centre index changes.
 * borderRadius is fixed in CSS and never animated.
 */
import type { SceneContext } from "~/composables/useScrollScene";
import { DUR, EASE } from "~/utils/motion";

const props = withDefaults(
  defineProps<{
    title: string;
    items: Array<[string, string, string]>;
    speed?: number;
  }>(),
  { speed: 55 }
);

const { t } = useLocale();
const { $lenis } = useNuxtApp();

// ── 3D fan curve constants ────────────────────────────────────────────────
/** Scale at the outermost visible card. */
const SCALE_EDGE = 0.5;
const SCALE_CENTRE = 1.0;
/** Opacity at the outermost visible card. */
const OPACITY_EDGE = 0.45;
/** Max Y-rotation (degrees) applied to the outermost card. Left cards rotate
 *  positively (right edge away), right cards rotate negatively. */
const MAX_ROTATE_Y = 38;
/** translateZ range in px: centre card = MAX (closest), edge card = 0. */
const TRANSLATE_Z_MAX = 110;

/** Smooth quadratic ease-out — 2 muls, no pow(). */
const easeOut = (v: number) => v * (2 - v);

const LERP = 0.18;
const NUDGE_GAIN = 0.35;
const MAX_FLING = 2400;
/** Write threshold — changes smaller than this are imperceptible. */
const WRITE_EPS = 0.008;
/** Cull band: cards beyond 1.15 × half-width are held at edge state. */
const CULL = 1.15;

type RailMode = "static" | "reduced" | "live";

const section = ref<HTMLElement | null>(null);
const rail = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);

const mode = ref<RailMode>("static");
const copies = ref(1);
const userPaused = ref(false);
const live = computed(() => mode.value === "live");
const realCopy = computed(() => (live.value ? 2 : 1));

const pad = (n: number) => String(n).padStart(2, "0");

useScrollScene(section, (ctx) =>
  ctx.mode === "reduced" ? nativeRail(ctx) : liveRail(ctx)
);

type Gsap = SceneContext["gsap"];

/** Four composited properties per card — all GPU-only, no layout/paint. */
type Setter = {
  el: HTMLElement;
  scale: (n: number) => void;
  opacity: (n: number) => void;
  /** rotateY in degrees. */
  rotateY: (n: number) => void;
  /** translateZ in px. */
  translateZ: (n: number) => void;
  lastV: number;
};

function buildSetters(gsap: Gsap, els: HTMLElement[]): Setter[] {
  return els.map((el) => ({
    el,
    scale: gsap.quickSetter(el, "scale") as (n: number) => void,
    opacity: gsap.quickSetter(el, "opacity") as (n: number) => void,
    rotateY: gsap.quickSetter(el, "rotateY", "deg") as (n: number) => void,
    translateZ: gsap.quickSetter(el, "translateZ", "px") as (n: number) => void,
    lastV: -1,
  }));
}

/**
 * Write all four properties for card at closeness `v` (1 = centre, 0 = edge).
 * `side`: +1 = card is left of centre (left edge tilts away from viewer),
 *         −1 = card is right of centre (right edge tilts away from viewer).
 * Skipped when the value has not moved by more than WRITE_EPS.
 */
function writeCard(sv: Setter, v: number, side: number) {
  if (Math.abs(v - sv.lastV) < WRITE_EPS) return;
  sv.lastV = v;
  const curved = easeOut(v);
  sv.scale(SCALE_EDGE + (SCALE_CENTRE - SCALE_EDGE) * curved);
  sv.opacity(OPACITY_EDGE + (1 - OPACITY_EDGE) * curved);
  sv.rotateY(side * MAX_ROTATE_Y * (1 - curved));
  sv.translateZ(TRANSLATE_Z_MAX * curved);
}

function clearSetters(gsap: Gsap, els: HTMLElement[]) {
  gsap.set(els, { clearProps: "transform,opacity" });
}

const cardsIn = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
const centreOf = (el: HTMLElement) => el.offsetLeft + el.offsetWidth / 2;

/* ── Reduced motion: native scroll-snap strip ───────────────────── */
function nativeRail({ gsap }: SceneContext) {
  mode.value = "reduced";
  copies.value = 1;
  let disposed = false;
  let stop: (() => void) | undefined;
  nextTick(() => {
    if (!disposed) stop = runNative(gsap);
  });
  return () => {
    disposed = true;
    stop?.();
    mode.value = "static";
  };
}

function runNative(gsap: Gsap) {
  const railEl = rail.value;
  const trackEl = track.value;
  if (!railEl || !trackEl) return;

  let setters: Setter[] = [];
  let centres: number[] = [];
  let railW = 0;
  let activeIdx = -1;

  const paint = () => {
    if (!setters.length) return;
    const half = railW / 2;
    const left = railEl.scrollLeft;
    let nearest = -1;
    let nearestD = Infinity;

    for (let i = 0; i < centres.length; i++) {
      const dx = centres[i]! - left - half;
      const absDx = Math.abs(dx);
      if (absDx < nearestD) {
        nearestD = absDx;
        nearest = i;
      }
      const v = Math.max(0, 1 - absDx / half);
      // side: +1 = card is left of centre, −1 = right of centre
      const side = dx <= 0 ? 1 : -1;
      writeCard(setters[i]!, v, side);
    }

    if (nearest !== activeIdx) {
      if (activeIdx >= 0) setters[activeIdx]!.el.classList.remove("is-active");
      if (nearest >= 0) setters[nearest]!.el.classList.add("is-active");
      activeIdx = nearest;
    }
  };

  const measure = () => {
    clearSetters(gsap, cardsIn(trackEl));
    const els = cardsIn(trackEl);
    setters = buildSetters(gsap, els);
    centres = els.map(centreOf);
    railW = railEl.clientWidth;
    activeIdx = -1;
    paint();
  };

  measure();
  railEl.addEventListener("scroll", paint, { passive: true });
  const ro = new ResizeObserver(measure);
  ro.observe(railEl);

  return () => {
    railEl.removeEventListener("scroll", paint);
    ro.disconnect();
    if (activeIdx >= 0) setters[activeIdx]?.el.classList.remove("is-active");
    clearSetters(gsap, cardsIn(trackEl));
  };
}

/* ── Live: auto-running infinite loop ───────────────────────────── */
function liveRail({ gsap }: SceneContext) {
  mode.value = "live";
  copies.value = Math.max(copies.value, 3);
  let disposed = false;
  let stop: (() => void) | undefined;
  nextTick(() => {
    if (!disposed) stop = runLive(gsap);
  });
  return () => {
    disposed = true;
    stop?.();
    mode.value = "static";
    copies.value = 1;
  };
}

function runLive(gsap: Gsap) {
  const railEl = rail.value;
  const trackEl = track.value;
  if (!railEl || !trackEl) return;

  let x = 0;
  const s = { factor: 1, vel: 0 };
  let nudge = 0;

  let n = 0;
  let setW = 0;
  let step = 0;
  let railW = 0;
  let centres: number[] = [];
  let els: HTMLElement[] = [];
  let setters: Setter[] = [];
  let vis = new Float32Array(0);
  let positioned = false;
  let inView = true;
  let activeIdx = -1;

  let hovered = false;
  let focused = false;
  let dragging = false;
  let coasting = false;

  const wrap = (v: number) => gsap.utils.wrap(-setW, 0, v);

  const measure = () => {
    els = cardsIn(trackEl);
    n = props.items.length;
    if (!n || els.length < n * 2) return;

    step = els[1]!.offsetLeft - els[0]!.offsetLeft;
    setW = els[n]!.offsetLeft - els[0]!.offsetLeft;
    railW = railEl.clientWidth;

    const needed = Math.max(3, 1 + Math.ceil(railW / setW));
    if (needed !== copies.value) {
      copies.value = needed;
      nextTick(measure);
      return;
    }

    setters = buildSetters(gsap, els);
    centres = els.map(centreOf);
    vis = new Float32Array(els.length).fill(-1);
    if (!positioned) {
      x = railW / 2 - centres[0]!;
      positioned = true;
    }
    x = wrap(x);
  };

  const render = (alpha: number) => {
    if (!setW || !setters.length) return;

    const wrapped = wrap(x);
    if (wrapped !== x) {
      const shift = Math.round((wrapped - x) / setW) * n;
      const prev = vis.slice();
      for (let i = 0; i < vis.length; i++) {
        const j = i + shift;
        vis[i] = j >= 0 && j < prev.length ? prev[j]! : -1;
      }
      x = wrapped;
    }

    const offset = x - setW;
    trackEl.style.transform = `translate3d(${offset}px,0,0)`;

    const half = Math.max(railW / 2, step * 3.5);
    const cullDist = half * CULL;
    const cx = railW / 2;
    let nearest = -1;
    let nearestD = Infinity;

    for (let i = 0; i < centres.length; i++) {
      const screenX = centres[i]! + offset;
      const dx = screenX - cx;
      const absDx = Math.abs(dx);
      const sv = setters[i]!;

      // Cull: force to edge state once, skip until card re-enters the band.
      if (absDx > cullDist) {
        if (sv.lastV !== 0) {
          sv.lastV = 0;
          sv.scale(SCALE_EDGE);
          sv.opacity(OPACITY_EDGE);
          // Tilt fully away; direction matches which side of centre it sits on.
          sv.rotateY(dx > 0 ? -MAX_ROTATE_Y : MAX_ROTATE_Y);
          sv.translateZ(0);
        }
        vis[i] = -1;
        continue;
      }

      if (absDx < nearestD) {
        nearestD = absDx;
        nearest = i;
      }

      const target = Math.max(0, 1 - absDx / half);
      const cur = vis[i]!;
      const v = (vis[i] = cur < 0 ? target : cur + (target - cur) * alpha);

      // side: +1 = left of centre (left edge tilts away), −1 = right of centre
      const side = dx <= 0 ? 1 : -1;
      writeCard(sv, v, side);

      // z-index follows depth: higher v = closer = higher z.
      const z = Math.round(v * 100);
      if (sv.el.style.zIndex !== String(z)) sv.el.style.zIndex = String(z);
    }

    if (nearest !== activeIdx) {
      if (activeIdx >= 0) els[activeIdx]?.classList.remove("is-active");
      if (nearest >= 0) els[nearest]?.classList.add("is-active");
      activeIdx = nearest;
    }
  };

  const tick = (_t: number, deltaMs: number) => {
    if (!inView || !setW) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    const frames = dt * 60;

    x += (-props.speed * s.factor + s.vel) * dt;

    const eased = nudge * (1 - Math.pow(1 - 0.12, frames));
    nudge -= eased;
    x -= eased * NUDGE_GAIN;

    render(1 - Math.pow(1 - LERP, frames));
  };

  const isHeld = () => hovered || focused || dragging || coasting || userPaused.value;
  const pause = (d: number = DUR.md) =>
    gsap.to(s, { factor: 0, duration: d, ease: "power2.out", overwrite: "auto" });
  const resume = () => {
    if (isHeld()) return;
    gsap.to(s, { factor: 1, duration: DUR.lg, ease: EASE.inout, overwrite: "auto" });
  };

  const onEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hovered = true;
    pause();
  };
  const onLeave = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hovered = false;
    resume();
  };

  let pointerId = -1;
  let lastX = 0;
  let lastT = 0;
  let dragVel = 0;

  const onDown = (e: PointerEvent) => {
    if (e.button !== 0 || dragging) return;
    dragging = true;
    coasting = false;
    pointerId = e.pointerId;
    lastX = e.clientX;
    lastT = e.timeStamp;
    dragVel = 0;
    gsap.killTweensOf(s);
    s.factor = 0;
    s.vel = 0;
    railEl.setPointerCapture(e.pointerId);
    railEl.classList.add("is-dragging");
  };
  const onMove = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return;
    const dx = e.clientX - lastX;
    const dtMs = Math.max(1, e.timeStamp - lastT);
    x += dx;
    dragVel = dragVel * 0.6 + (dx / dtMs) * 1000 * 0.4;
    lastX = e.clientX;
    lastT = e.timeStamp;
  };
  const onUp = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    pointerId = -1;
    if (railEl.hasPointerCapture(e.pointerId)) railEl.releasePointerCapture(e.pointerId);
    railEl.classList.remove("is-dragging");
    if (e.timeStamp - lastT > 80) dragVel = 0;
    s.vel = gsap.utils.clamp(-MAX_FLING, MAX_FLING, dragVel);
    coasting = true;
    gsap.to(s, {
      vel: 0,
      duration: DUR.md,
      ease: "power2.out",
      onComplete: () => {
        coasting = false;
        resume();
      },
    });
  };

  const onFocusIn = (e: FocusEvent) => {
    if (!(e.target as HTMLElement).matches(":focus-visible")) return;
    focused = true;
    pause(DUR.sm);
  };
  const onFocusOut = (e: FocusEvent) => {
    if (railEl.contains(e.relatedTarget as Node | null)) return;
    focused = false;
    resume();
  };

  let glide: ReturnType<Gsap["to"]> | null = null;
  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir || !setW) return;
    e.preventDefault();
    let nearest = Infinity;
    for (const c of centres) {
      const off = c + x - setW - railW / 2;
      if (Math.abs(off) < Math.abs(nearest)) nearest = off;
    }
    const delta = -(nearest + dir * step);
    const p = { v: 0 };
    let applied = 0;
    glide?.kill();
    glide = gsap.to(p, {
      v: delta,
      duration: DUR.sm,
      ease: EASE.out,
      onUpdate: () => {
        x += p.v - applied;
        applied = p.v;
      },
    });
  };

  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    x -= e.deltaX;
  };

  let lastY = window.scrollY;
  const onPageScroll = () => {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    if (!inView || Math.abs(dy) > 400) return;
    nudge = gsap.utils.clamp(-600, 600, nudge + dy);
  };
  let offPageScroll: () => void;
  const lenis = $lenis.value;
  if (lenis) {
    offPageScroll = lenis.on("scroll", onPageScroll);
  } else {
    window.addEventListener("scroll", onPageScroll, { passive: true });
    offPageScroll = () => window.removeEventListener("scroll", onPageScroll);
  }

  const io = new IntersectionObserver(([entry]) => {
    inView = !!entry?.isIntersecting;
    if (inView) vis.fill(-1);
  });
  io.observe(railEl);

  const ro = new ResizeObserver(() => measure());
  ro.observe(railEl);

  const stopItemsWatch = watch(
    () => props.items.length,
    () => nextTick(measure)
  );
  const stopPauseWatch = watch(userPaused, (p) => (p ? pause() : resume()));

  railEl.addEventListener("pointerenter", onEnter);
  railEl.addEventListener("pointerleave", onLeave);
  railEl.addEventListener("pointerdown", onDown);
  railEl.addEventListener("pointermove", onMove);
  railEl.addEventListener("pointerup", onUp);
  railEl.addEventListener("pointercancel", onUp);
  railEl.addEventListener("focusin", onFocusIn);
  railEl.addEventListener("focusout", onFocusOut);
  railEl.addEventListener("keydown", onKey);
  railEl.addEventListener("wheel", onWheel, { passive: false });

  measure();
  if (userPaused.value) s.factor = 0;
  gsap.ticker.add(tick);

  return () => {
    gsap.ticker.remove(tick);
    gsap.killTweensOf(s);
    glide?.kill();
    offPageScroll();
    io.disconnect();
    ro.disconnect();
    stopItemsWatch();
    stopPauseWatch();
    railEl.removeEventListener("pointerenter", onEnter);
    railEl.removeEventListener("pointerleave", onLeave);
    railEl.removeEventListener("pointerdown", onDown);
    railEl.removeEventListener("pointermove", onMove);
    railEl.removeEventListener("pointerup", onUp);
    railEl.removeEventListener("pointercancel", onUp);
    railEl.removeEventListener("focusin", onFocusIn);
    railEl.removeEventListener("focusout", onFocusOut);
    railEl.removeEventListener("keydown", onKey);
    railEl.removeEventListener("wheel", onWheel);
    railEl.classList.remove("is-dragging");
    if (activeIdx >= 0) els[activeIdx]?.classList.remove("is-active");
    gsap.set(els, { clearProps: "transform,opacity,rotateY,translateZ" });
    trackEl.style.transform = "";
  };
}
</script>

<template>
  <section
    ref="section"
    class="loom-day loom-catalogue product-rail-section"
    data-chapter="catalogue"
    aria-labelledby="catalogue-title"
  >
    <div class="loom-wrap mb-8 flex flex-wrap items-end justify-between gap-4 sm:mb-10">
      <h2 id="catalogue-title" class="loom-display loom-display--m">{{ title }}</h2>
      <div class="flex items-center gap-4">
        <p class="loom-label product-rail-section__hint" aria-hidden="true">
          {{ live ? t("catalogueDrag") : t("catalogueHint") }} →
        </p>
        <button
          v-if="live"
          type="button"
          class="product-rail-section__toggle"
          :aria-pressed="userPaused"
          :aria-label="userPaused ? t('carouselPlay') : t('carouselPause')"
          @click="userPaused = !userPaused"
        >
          <UIcon
            :name="
              userPaused ? 'i-heroicons-play-20-solid' : 'i-heroicons-pause-20-solid'
            "
            class="h-5 w-5"
          />
        </button>
      </div>
    </div>

    <div
      ref="rail"
      class="product-rail"
      :class="`is-${mode}`"
      role="region"
      aria-roledescription="carousel"
      :aria-label="title"
      tabindex="0"
    >
      <div ref="track" class="product-rail__track">
        <template v-for="c in copies" :key="c">
          <article
            v-for="([name, meta, image], i) in items"
            :key="`${c}-${i}`"
            data-card
            class="product-rail__card"
            :role="c === realCopy ? 'group' : undefined"
            :aria-roledescription="c === realCopy ? 'slide' : undefined"
            :aria-label="c === realCopy ? `${i + 1} / ${items.length}` : undefined"
            :aria-hidden="c === realCopy ? undefined : 'true'"
          >
            <figure class="product-rail__figure">
              <img
                :src="image"
                :alt="name"
                loading="lazy"
                decoding="async"
                draggable="false"
                width="800"
                height="450"
              />
              <span class="product-rail__glow" aria-hidden="true" />
              <span class="product-rail__accent" aria-hidden="true" />
              <figcaption class="product-rail__labels">
                <span class="product-rail__index" aria-hidden="true">{{
                  pad(i + 1)
                }}</span>
                <span class="product-rail__caption">
                  <span class="product-rail__name">{{ name }}</span>
                  <span class="product-rail__meta">{{ meta }}</span>
                </span>
              </figcaption>
            </figure>
          </article>
        </template>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Dark ground; still `.loom-day` so it stays opaque above the WebGL stage. */
.product-rail-section {
  --rail-ground: #05070a;
  --rail-accent: #e8b938;
  background-color: var(--rail-ground);
  color: var(--beige);
  overflow-x: clip;
}

.product-rail-section__hint {
  color: color-mix(in srgb, var(--beige) 72%, transparent);
}

.product-rail-section__toggle {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in srgb, var(--beige) 30%, transparent);
  border-radius: 999px;
  color: var(--beige);
  transition: background-color 0.3s var(--ease), border-color 0.3s var(--ease);
}

.product-rail-section__toggle:hover {
  border-color: var(--beige);
  background: color-mix(in srgb, var(--beige) 10%, transparent);
}

.product-rail-section :focus-visible {
  outline-color: var(--beige);
}

/* ── Rail ─────────────────────────────────────────────────── */
.product-rail {
  --card-w: 300px;
  /* card height is derived from 16:9 ratio in CSS on the card itself */

  /*
   * Fan step: how far apart card centres are placed. Much tighter than
   * card width — this creates the heavy overlap from the design reference.
   * 0.44 × card width means each successive card's centre is 44% of a
   * card-width from the previous, so neighbours tuck deeply behind centre.
   */
  --fan-step: calc(var(--card-w) * 0.44);

  /*
   * Perspective is set on the FIXED container (not the moving track) so the
   * vanishing point stays centred while the track translates. If perspective
   * were on the track, the VP would drift with x and distort the fan.
   */
  perspective: 900px;
  perspective-origin: 50% 50%;

  position: relative;
  padding-block: 40px 56px;
  -webkit-user-select: none;
  user-select: none;
  outline-offset: -6px;
}

@media (min-width: 640px) {
  .product-rail {
    --card-w: 380px;
    perspective: 1100px;
  }
}

@media (min-width: 1024px) {
  .product-rail {
    --card-w: 460px;
    perspective: 1400px;
  }
}

.product-rail.is-static,
.product-rail.is-reduced {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--beige) 30%, transparent) transparent;
  /* Flat strip: no 3D context needed. */
  perspective: none;
}

.product-rail.is-live {
  overflow-x: clip;
  touch-action: pan-y;
}

.product-rail__track {
  position: relative;
  display: flex;
  align-items: center;
  width: max-content;
  /*
   * preserve-3d: cards' rotateY + translateZ are computed in the 3D space
   * of .product-rail, not flattened here on the track.
   */
  transform-style: preserve-3d;
}

.is-static .product-rail__track,
.is-reduced .product-rail__track {
  gap: 16px;
  padding-inline: calc(50% - var(--card-w) / 2);
  /* Flat strip: collapse 3D context so reduced-motion gets a normal strip. */
  transform-style: flat;
}

.is-live .product-rail__track {
  gap: 0;
  will-change: transform;
}

/*
 * Fan overlap in live mode: each card's leading edge is offset by --fan-step
 * from the previous card's leading edge. negative margin = overlap.
 */
.is-live .product-rail__card {
  margin-inline-start: calc(var(--fan-step) - var(--card-w));
}

/* ── Card ─────────────────────────────────────────────────── */
.product-rail__card {
  position: relative;
  flex: none;
  width: var(--card-w);
  /* Landscape 16:9 — matches the design reference. */
  aspect-ratio: 16 / 9;
  /* Fixed radius — NOT animated. Animating it triggers paint every frame. */
  border-radius: 1rem;
  scroll-snap-align: center;
  transform-origin: 50% 50%;
  /*
   * Composited properties only: scale, opacity, rotateY, translateZ.
   * No layout or paint recalc per frame.
   */
  will-change: transform, opacity;
}

.product-rail__figure {
  position: absolute;
  inset: 0;
  margin: 0;
  overflow: hidden;
  border-radius: inherit;
  background: color-mix(in srgb, var(--navy) 80%, black);
}

.product-rail__figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
  /*
   * Inactive cards are desaturated and dimmed — a cheap CSS differentiator
   * that requires zero GSAP writes. CSS transition handles the fade when
   * is-active is toggled.
   */
  filter: saturate(0.5) brightness(0.7);
  transition: filter 0.4s var(--ease);
}

.product-rail__card.is-active .product-rail__figure img {
  filter: saturate(1) brightness(1);
}

/* ── Active-card states (toggled by a single class, not per-frame setters) ── */
.product-rail__glow,
.product-rail__accent,
.product-rail__labels {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s var(--ease);
}

.product-rail__glow {
  border-radius: inherit;
  box-shadow: 0 0 0 1px color-mix(in srgb, var(--rail-accent) 70%, transparent),
    0 0 48px -6px color-mix(in srgb, var(--rail-accent) 35%, transparent),
    0 28px 70px -18px color-mix(in srgb, var(--rail-accent) 30%, transparent);
}

.product-rail__accent {
  background: color-mix(in srgb, var(--rail-accent) 42%, transparent);
}

.product-rail__card.is-active .product-rail__glow {
  opacity: 1;
}

.product-rail__card.is-active .product-rail__accent {
  opacity: 0.55;
}

.product-rail__card.is-active .product-rail__labels {
  opacity: 1;
}

.product-rail__index {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.55rem;
  border-radius: 999px;
  background: color-mix(in srgb, var(--navy) 82%, transparent);
  color: var(--beige);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1.2;
}

.product-rail__caption {
  position: absolute;
  inset-inline: 0;
  bottom: 0;
  display: grid;
  gap: 0.15rem;
  padding: 2.75rem 0.9rem 0.9rem;
  background: linear-gradient(
    to top,
    color-mix(in srgb, var(--rail-ground) 90%, transparent) 35%,
    transparent
  );
  color: var(--beige);
}

.product-rail__name {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25;
}

.product-rail__meta {
  font-size: 0.75rem;
  color: color-mix(in srgb, var(--beige) 80%, transparent);
}

/* Fallback when JS is off or reduced motion — captions always readable. */
.is-static .product-rail__labels,
.is-reduced .product-rail__labels {
  opacity: 1;
}
</style>
