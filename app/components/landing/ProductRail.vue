<!-- components/landing/ProductRail.vue -->
<script setup lang="ts">
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

// ── Concave wall ──────────────────────────────────────────────────────────
// Per-breakpoint shape lives in CSS (--rail-visible, --rail-mag, --rail-rotate,
// perspective) and is read once per measure(). The engine only knows the maths.

/** Gap growth at t = 1, as a fraction of the centre gap (spec cap: 0.2). */
const GAP_GROWTH = 0.12;
/** LUT resolution for the x correction, in samples per card step. Must be even. */
const LUT_PER_STEP = 32;
/** Cards farther than this many steps past t = 1 are frozen in the culled state. */
const CULL_STEPS = 1.5;
/** Skip a card's write when its offset moved less than this (px). */
const WRITE_EPS = 0.05;

const NUDGE_GAIN = 0.35;
const MAX_FLING = 2400;

type RailMode = "static" | "reduced" | "live";

const section = ref<HTMLElement | null>(null);
const rail = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);

const mode = ref<RailMode>("static");
const copies = ref(1);
const userPaused = ref(false);
/** Rail holds keyboard focus (drift paused for the user). */
const focusHeld = ref(false);
/** Item index of the centred card — written only when it changes. */
const activeItem = ref(0);

const live = computed(() => mode.value === "live");
const realCopy = computed(() => (live.value ? 2 : 1));
const activeEntry = computed(() => props.items[activeItem.value] ?? props.items[0]);
/** Announce the readout only while the drift is held, never while it runs. */
const announce = computed(() => userPaused.value || focusHeld.value);

const pad = (n: number) => String(n).padStart(2, "0");

useScrollScene(section, (ctx) => (ctx.mode === "reduced" ? nativeRail() : liveRail(ctx)));

type Gsap = SceneContext["gsap"];

/** One card's last written state. */
type CardSlot = {
  el: HTMLElement;
  /** Signed offset from rail centre at the last write (px). */
  lastDx: number;
  /** 0 inside the band, ±1 while frozen in the culled state on that side. */
  culled: -1 | 0 | 1;
};

/** Arc geometry in px, rebuilt by measure(). Pure data — no DOM. */
type Arc = {
  /** Offset at which t reaches 1: the outermost visible slot. */
  half: number;
  cull: number;
  persp: number;
  magEdge: number;
  rotEdge: number;
  /** Half card width. */
  hw: number;
  /** LUT sample spacing and x-correction samples over [0, cull]. */
  du: number;
  xc: Float32Array;
};

const cssNum = (cs: CSSStyleDeclaration, name: string, fallback: number) => {
  const v = parseFloat(cs.getPropertyValue(name));
  return Number.isFinite(v) ? v : fallback;
};

/** Depth and rotation ease in from the centre: e = t². */
function arcState(arc: Arc, a: number) {
  const tt = Math.min(a / arc.half, 1);
  const e = tt * tt;
  // Size comes from depth alone: magnification m = p / (p − z) ⇒ z = p(1 − 1/m).
  const m = 1 + (arc.magEdge - 1) * e;
  const rad = arc.rotEdge * e * (Math.PI / 180);
  return {
    tt,
    z: arc.persp * (1 - 1 / m),
    rot: arc.rotEdge * e,
    cos: arc.hw * Math.cos(rad),
    sin: arc.hw * Math.sin(rad),
  };
}

/**
 * Builds the x-correction LUT so every pair of neighbours shows the same
 * projected gap (growing ≤ GAP_GROWTH toward the edge). Perspective pushes
 * magnified cards outward; the correction pulls them back.
 *
 * Exact by construction: a card's left edge projects linearly in its
 * pre-projection centre X, so X is solved in closed form from its inner
 * neighbour's projected right edge. The centre step is seeded linearly
 * (its cards are almost flat) and every later step is solved from the one
 * before. Mirror symmetry covers the left side.
 */
function buildArc(step: number, cardW: number, cs: CSSStyleDeclaration, persp: number): Arc {
  const visible = cssNum(cs, "--rail-visible", 7);
  const half = (step * (visible - 1)) / 2;
  const cull = half + CULL_STEPS * step;
  const du = step / LUT_PER_STEP;
  const n = Math.ceil(cull / du);
  const arc: Arc = {
    half,
    cull,
    persp,
    magEdge: cssNum(cs, "--rail-mag", 1.3),
    rotEdge: cssNum(cs, "--rail-rotate", 52),
    hw: cardW / 2,
    du,
    xc: new Float32Array(n + 1),
  };
  const gap = step - cardW;
  // Projected edges of a right-side card whose outer (right) edge leans in.
  const leftEdge = (u: number, X: number) => {
    const s = arcState(arc, u);
    return ((X - s.cos) * persp) / (persp - s.z + s.sin);
  };
  const rightEdge = (u: number, X: number) => {
    const s = arcState(arc, u);
    return ((X + s.cos) * persp) / (persp - s.z - s.sin);
  };
  const solveX = (u: number, left: number) => {
    const s = arcState(arc, u);
    return (left * (persp - s.z + s.sin)) / persp + s.cos;
  };

  const X = new Float64Array(n + 1);
  const seed = LUT_PER_STEP / 2;
  // The pair straddling the centre is symmetric: its gap splits evenly.
  const xHalf = solveX(step / 2, gap / 2);
  for (let j = 0; j <= n; j++) {
    if (j <= seed) {
      X[j] = (xHalf * j) / seed;
    } else {
      const ja = j - LUT_PER_STEP;
      const a = ja * du;
      const innerRight = ja >= 0 ? rightEdge(a, X[ja]!) : -leftEdge(-a, X[-ja]!);
      const mid = Math.min(Math.abs(a + step / 2) / half, 1);
      X[j] = solveX(j * du, innerRight + gap * (1 + GAP_GROWTH * mid * mid));
    }
    arc.xc[j] = X[j]! - j * du;
  }
  return arc;
}

function xCorrection(arc: Arc, a: number) {
  const n = arc.xc.length - 1;
  const f = Math.min(a / arc.du, n);
  const i = Math.min(Math.floor(f), n - 1);
  return arc.xc[i]! + (arc.xc[i + 1]! - arc.xc[i]!) * (f - i);
}

/**
 * One composited write per card: x correction, depth and inward turn.
 * `side` is +1 right of centre, −1 left. rotateY(−θ) brings a right card's
 * right (outer) edge toward the viewer, so outer edges render taller.
 */
function writeCard(slot: CardSlot, arc: Arc, a: number, side: number) {
  const s = arcState(arc, a);
  const x = side * xCorrection(arc, a);
  slot.el.style.transform = `translate3d(${x}px,0,${s.z}px) rotateY(${-side * s.rot}deg)`;
}

const cardsIn = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
const centreOf = (el: HTMLElement) => el.offsetLeft + el.offsetWidth / 2;
const clearCards = (els: HTMLElement[]) => els.forEach((el) => el.style.removeProperty("transform"));

/* ── Reduced motion: flat native scroll-snap strip, no JS writes ──── */
function nativeRail() {
  mode.value = "reduced";
  copies.value = 1;
  return () => {
    mode.value = "static";
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
  let slots: CardSlot[] = [];
  let arc: Arc | null = null;
  let positioned = false;
  let inView = true;
  let shownItem = -1;

  let hovered = false;
  let dragging = false;
  let coasting = false;

  const wrap = (v: number) => gsap.utils.wrap(-setW, 0, v);

  // All layout reads happen here — never in tick() or render().
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

    const cs = getComputedStyle(railEl);
    arc = buildArc(step, els[0]!.offsetWidth, cs, parseFloat(cs.perspective) || 1200);
    slots = els.map((el) => ({ el, lastDx: NaN, culled: 0 }));
    centres = els.map(centreOf);
    if (!positioned) {
      x = railW / 2 - centres[0]!;
      positioned = true;
    }
    x = wrap(x);
  };

  const render = () => {
    if (!setW || !arc) return;

    // Card state is a pure function of screen offset, so the wrap seam is
    // pixel-identical: card i lands exactly where card i ± n just was.
    x = wrap(x);
    const offset = x - setW;
    trackEl.style.transform = `translate3d(${offset}px,0,0)`;

    const cx = railW / 2;
    let nearest = -1;
    let nearestD = Infinity;

    for (let i = 0; i < centres.length; i++) {
      const dx = centres[i]! + offset - cx;
      const a = Math.abs(dx);
      const side = dx < 0 ? -1 : 1;
      const slot = slots[i]!;

      // Culled = the t = 1 state held at the band edge; written once per side.
      if (a > arc.cull) {
        if (slot.culled !== side) {
          writeCard(slot, arc, arc.cull, side);
          slot.culled = side;
        }
        continue;
      }

      if (a < nearestD) {
        nearestD = a;
        nearest = i;
      }

      if (slot.culled === 0 && Math.abs(dx - slot.lastDx) < WRITE_EPS) continue;
      slot.culled = 0;
      slot.lastDx = dx;
      writeCard(slot, arc, a, side);
    }

    const item = nearest >= 0 ? nearest % n : -1;
    if (item >= 0 && item !== shownItem) {
      shownItem = item;
      activeItem.value = item;
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

    render();
  };

  const isHeld = () => hovered || focusHeld.value || dragging || coasting || userPaused.value;
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
    focusHeld.value = true;
    pause(DUR.sm);
  };
  const onFocusOut = (e: FocusEvent) => {
    if (railEl.contains(e.relatedTarget as Node | null)) return;
    focusHeld.value = false;
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
    focusHeld.value = false;
    clearCards(cardsIn(trackEl));
    trackEl.style.removeProperty("transform");
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
            :name="userPaused ? 'i-heroicons-play-20-solid' : 'i-heroicons-pause-20-solid'"
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
              <div class="product-rail__swatch">
                <img
                  :src="image"
                  :alt="name"
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                  width="800"
                  height="1200"
                />
              </div>
              <!-- Visible under each card when static/reduced; screen-reader only when live. -->
              <figcaption class="product-rail__caption">
                <span class="product-rail__name">{{ name }}</span>
                <span class="product-rail__meta">{{ meta }}</span>
              </figcaption>
            </figure>
          </article>
        </template>
      </div>
    </div>

    <!-- Swatch ticket: the centred card's readout, pinned on a running stitch. -->
    <div v-if="live && activeEntry" class="product-rail__readout">
      <span class="product-rail__stitch" aria-hidden="true" />
      <div
        class="product-rail__ticket-slot"
        :aria-live="announce ? 'polite' : 'off'"
        aria-atomic="true"
      >
        <Transition name="rail-ticket">
          <p :key="activeItem" class="product-rail__ticket">
            <span class="product-rail__ticket-no">{{ pad(activeItem + 1) }}</span>
            <span class="product-rail__ticket-name">{{ activeEntry[0] }}</span>
            <span class="product-rail__ticket-meta">{{ activeEntry[1] }}</span>
          </p>
        </Transition>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Paper ground; still `.loom-day` so it stays opaque above the WebGL stage. */
.product-rail-section {
  --rail-ground: color-mix(in srgb, var(--beige) 70%, var(--white));
  --rail-hairline: color-mix(in srgb, var(--navy) 22%, transparent);
  background-color: var(--rail-ground);
  color: var(--navy);
  overflow-x: clip;
}

.product-rail-section__hint {
  color: var(--gray-600);
}

.product-rail-section__toggle {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--rail-hairline);
  border-radius: 999px;
  color: var(--navy);
  transition: background-color 0.3s var(--ease), border-color 0.3s var(--ease);
}

.product-rail-section__toggle:hover {
  border-color: var(--navy);
  background: color-mix(in srgb, var(--navy) 6%, transparent);
}

/* ── Rail ─────────────────────────────────────────────────── */
/*
 * Breakpoint shape, read by the engine in measure():
 *   --rail-visible  slots on screen; the outermost reaches t = 1 and is cropped
 *   --rail-mag      magnification at t = 1, produced by translateZ alone
 *   --rail-rotate   inward turn at t = 1, in degrees
 * --card-w ranges keep the outermost slot straddling the rail edge across the
 * whole breakpoint (verified numerically 320–2560px).
 */
.product-rail {
  --card-w: clamp(7.5rem, 42vw, 17rem);
  --rail-gap: calc(var(--card-w) * 0.15);
  --rail-visible: 3;
  --rail-mag: 1.18;
  --rail-rotate: 24;

  /*
   * Perspective sits on the FIXED rail, not the moving track, so the
   * vanishing point stays centred while the track translates. Scaling it with
   * the card keeps the arc identical at every width inside a breakpoint.
   */
  perspective: calc(var(--card-w) * 5);
  perspective-origin: 50% 50%;

  position: relative;
  -webkit-user-select: none;
  user-select: none;
  outline-offset: -6px;
}

@media (min-width: 640px) {
  .product-rail {
    --card-w: clamp(8rem, 20vw, 13rem);
    --rail-visible: 5;
    --rail-mag: 1.24;
    --rail-rotate: 40;
    perspective: calc(var(--card-w) * 7);
  }
}

@media (min-width: 1024px) {
  .product-rail {
    --card-w: clamp(9rem, 13vw, 20rem);
    --rail-visible: 7;
    --rail-mag: 1.3;
    --rail-rotate: 52;
    perspective: calc(var(--card-w) * 9);
  }
}

.product-rail.is-static,
.product-rail.is-reduced {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: var(--rail-hairline) transparent;
  padding-block: 0.5rem 1.25rem;
  /* Flat strip: no 3D context. */
  perspective: none;
}

.product-rail.is-live {
  overflow-x: clip;
  touch-action: pan-y;
  /* Vertical bleed for the edge cards: (tallest edge − 1) / 2 × 1.5 card-w ≈ 0.29. */
  padding-block: calc(var(--card-w) * 0.3);
}

.product-rail__track {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--rail-gap);
  width: max-content;
}

.is-static .product-rail__track,
.is-reduced .product-rail__track {
  align-items: flex-start;
  padding-inline: calc(50% - var(--card-w) / 2);
}

.is-live .product-rail__track {
  /* Cards turn and recede in the rail's 3D space, not flattened here. */
  transform-style: preserve-3d;
  will-change: transform;
}

/* ── Card ─────────────────────────────────────────────────── */
.product-rail__card {
  position: relative;
  flex: none;
  width: var(--card-w);
  scroll-snap-align: center;
  transform-origin: 50% 50%;
}

.is-live .product-rail__card {
  will-change: transform;
}

.product-rail__figure {
  margin: 0;
}

.product-rail__swatch {
  position: relative;
  aspect-ratio: 2 / 3;
  overflow: hidden;
  /* ≈12% of card width. Fixed — never animated. */
  border-radius: calc(var(--card-w) * 0.12);
  background: color-mix(in srgb, var(--navy) 8%, var(--rail-ground));
}

/* 1px hairline drawn over the photo so light images keep their edge. */
.product-rail__swatch::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--navy) 12%, transparent);
  pointer-events: none;
}

.product-rail__swatch img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
}

.product-rail__caption {
  display: grid;
  gap: 0.15rem;
  padding-top: 0.75rem;
}

.product-rail__name {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.25;
}

.product-rail__meta {
  font-size: 0.75rem;
  color: var(--gray-600);
}

/* Live: the readout speaks for the centred card; captions stay for AT. */
.is-live .product-rail__caption {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}

/* ── Swatch ticket readout ────────────────────────────────── */
.product-rail__readout {
  position: relative;
  display: grid;
  place-items: center;
  /* Reserved height: the cross-fade never shifts layout. */
  height: 3rem;
}

/* Running stitch spanning the rail. */
.product-rail__stitch {
  position: absolute;
  inset-inline: 0;
  top: 50%;
  border-top: 2px dashed color-mix(in srgb, var(--navy) 35%, transparent);
}

.product-rail__ticket-slot {
  position: relative;
  display: grid;
  max-width: calc(100% - 2rem);
}

.product-rail__ticket {
  grid-area: 1 / 1;
  justify-self: center;
  display: flex;
  align-items: baseline;
  gap: 0.75rem;
  max-width: 100%;
  margin: 0;
  padding: 0.5rem 0.9rem;
  border: 1px solid var(--rail-hairline);
  border-radius: 3px;
  background: var(--rail-ground);
  white-space: nowrap;
  /* On the element itself, so an interrupted fade reverses from where it is. */
  transition: opacity 0.35s var(--ease);
}

.product-rail__ticket-no {
  padding-right: 0.75rem;
  border-right: 1px solid var(--rail-hairline);
  font-family: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  font-size: 0.8rem;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
}

.product-rail__ticket-name {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.875rem;
  font-weight: 700;
}

.product-rail__ticket-meta {
  font-size: 0.75rem;
  color: var(--gray-600);
}

.rail-ticket-enter-from,
.rail-ticket-leave-to {
  opacity: 0;
}
</style>
