<!-- components/landing/ProductRail.vue -->
<script setup lang="ts">
/**
 * Scene 07 — Catalogue. An endlessly looping card rail on a dark ground: the
 * card nearest the rail's centre is full size and opaque, cards toward the
 * edges shrink and fade.
 *
 * Plumbing follows the landing-page motion contract (utils/motion.ts):
 *  - GSAP arrives through `useScrollScene` (lazy, scoped, auto-reverted) and
 *    the loop runs on `gsap.ticker` — the page's single animation loop.
 *  - `$lenis` is optional: when it exists its scroll event nudges the rail,
 *    otherwise a native `scroll` listener does (Lenis is off on touch).
 *  - Reduced motion: no ticker, no clones — a native scroll-snap strip whose
 *    centre-scale is driven by the strip's own `scroll` event.
 *
 * Until motion loads (and without JS) the rail is that same native strip,
 * unscaled, so the catalogue never waits on an engine.
 */
import type { SceneContext } from "~/composables/useScrollScene";
import { DUR, EASE } from "~/utils/motion";

const props = withDefaults(
  defineProps<{
    title: string;
    items: Array<[string, string, string]>; // [name, meta, image]
    /** Auto-run speed in px/s. */
    speed?: number;
  }>(),
  { speed: 60 },
);

const { t } = useLocale();
const { $lenis } = useNuxtApp();

/**
 * How a card looks at closeness `v` (1 = centred, 0 = at/past the edge).
 * Radius is the *rendered* corner in rem, i.e. after the card's own scale.
 */
type Curve = {
  scale: (v: number) => number;
  opacity: (v: number) => number;
  radius: (v: number) => number;
  /** Caption + index visibility, given how "lit" (centred) the card is. */
  labels: (lit: number) => number;
};

// [ref-tune] Live stage — fitted to the reference: card heights there run
// 1, .81, .64, .49, .36, .25, .16, .09 at even spacing, which `v^1.5` tracks
// within ~0.02. Steep from the centre out, so the middle card dominates.
const STAGE: Curve = {
  scale: (v) => 0.06 + 0.94 * v ** 1.5,
  opacity: (v) => 0.08 + 0.92 * v ** 1.5,
  radius: (v) => 0.35 + 0.8 * v,
  labels: (lit) => lit,
};

/** Reduced-motion strip — gentle and linear; every caption stays readable. */
const STRIP: Curve = {
  scale: (v) => 0.55 + 0.45 * v,
  opacity: (v) => 0.35 + 0.65 * v,
  radius: (v) => 0.5 + 0.75 * v,
  labels: () => 1,
};

/** Share of the remaining distance the visual state closes per 60fps frame. */
const LERP = 0.18; // [ref-tune] was 0.14 — snappier tracking
/** How much page scroll (px) carries over into rail travel. */
const NUDGE_GAIN = 0.35;
/** Fastest fling a drag release may hand to the momentum tween (px/s). */
const MAX_FLING = 2400;

type RailMode = "static" | "reduced" | "live";

const section = ref<HTMLElement | null>(null);
const rail = ref<HTMLElement | null>(null);
const track = ref<HTMLElement | null>(null);

const mode = ref<RailMode>("static");
/** How many copies of `items` are rendered (live mode loops over ≥ 3). */
const copies = ref(1);
const userPaused = ref(false);
const live = computed(() => mode.value === "live");
/** The real, accessible set is the middle copy in live mode; the rest are clones. */
const realCopy = computed(() => (live.value ? 2 : 1));

const pad = (n: number) => String(n).padStart(2, "0");

useScrollScene(section, (ctx) => (ctx.mode === "reduced" ? nativeRail(ctx) : liveRail(ctx)));

/* ── Shared: per-card visual writer ─────────────────────────────────── */

type Gsap = SceneContext["gsap"];

/** quickSetter-backed writes for every card; skips cards whose value hasn't moved. */
function cardWriter(gsap: Gsap, els: HTMLElement[], curve: Curve) {
  const part = (sel: string) => els.map((el) => el.querySelector<HTMLElement>(sel)!);
  const glows = part("[data-glow]");
  const accents = part("[data-accent]"); // [ref-tune]
  const labels = part("[data-labels]"); // [ref-tune]
  const setters = els.map((el, i) => ({
    scale: gsap.quickSetter(el, "scale"),
    opacity: gsap.quickSetter(el, "opacity"),
    radius: gsap.quickSetter(el, "borderRadius", "rem"),
    glow: gsap.quickSetter(glows[i]!, "opacity"),
    accent: gsap.quickSetter(accents[i]!, "opacity"), // [ref-tune]
    labels: gsap.quickSetter(labels[i]!, "opacity"), // [ref-tune]
  }));
  const writtenV = new Float32Array(els.length).fill(-1);
  const writtenF = new Float32Array(els.length).fill(-1);
  const zIndex = new Int16Array(els.length).fill(-1);

  return {
    /**
     * `v` is closeness to centre: 1 at the centre, 0 at (or past) the edge.
     * `focus` is the same idea measured in cards: 1 when centred, 0 once a
     * full card-step away — so glow/accent/labels light only the centre card.
     */
    write(i: number, v: number, focus: number) {
      if (Math.abs(v - writtenV[i]!) < 5e-4 && Math.abs(focus - writtenF[i]!) < 5e-4) return;
      writtenV[i] = v;
      writtenF[i] = focus;
      const s = setters[i]!;
      const scale = curve.scale(v);
      s.scale(scale);
      s.opacity(curve.opacity(v));
      // Divide out the scale so the *rendered* corner matches the curve.
      s.radius(curve.radius(v) / scale);
      const lit = focus * focus * (3 - 2 * focus); // smoothstep
      s.glow(lit);
      s.accent(lit * 0.85); // [ref-tune] gold tint rides the glow
      s.labels(curve.labels(lit)); // [ref-tune] index + caption on the centre card only
      const z = Math.round(v * 100);
      if (z !== zIndex[i]) {
        zIndex[i] = z;
        els[i]!.style.zIndex = String(z);
      }
    },
    clear() {
      gsap.set(els, { clearProps: "transform,opacity,borderRadius,zIndex" });
      gsap.set([...glows, ...accents, ...labels], { clearProps: "opacity" });
    },
  };
}

/** Width of one card-step in normalised distance, for the `focus` band. */
const focusOf = (v: number, band: number) => Math.max(0, (v - (1 - band)) / band);

const cardsIn = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>("[data-card]"));
/** Card centre x relative to the track (offsetLeft ignores transforms). */
const centreOf = (el: HTMLElement) => el.offsetLeft + el.offsetWidth / 2;

/* ── Reduced motion: native scroll-snap strip ───────────────────────── */

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

  let els: HTMLElement[] = [];
  let writer: ReturnType<typeof cardWriter> | null = null;
  let centres: number[] = [];
  let railW = 0;
  let band = 1;

  // Purpose: the centre-scale effect, driven by the user's own scroll — no loop.
  const paint = () => {
    if (!writer) return;
    const half = railW / 2;
    const left = railEl.scrollLeft;
    centres.forEach((c, i) => {
      const v = 1 - Math.min(1, Math.abs((c - left - half) / half));
      writer!.write(i, v, focusOf(v, band));
    });
  };

  const measure = () => {
    writer?.clear();
    els = cardsIn(trackEl);
    writer = cardWriter(gsap, els, STRIP);
    centres = els.map(centreOf);
    railW = railEl.clientWidth;
    const step = els.length > 1 ? els[1]!.offsetLeft - els[0]!.offsetLeft : railW;
    band = Math.min(1, step / (railW / 2));
    paint();
  };

  measure();
  railEl.addEventListener("scroll", paint, { passive: true });
  const ro = new ResizeObserver(measure);
  ro.observe(railEl);

  return () => {
    railEl.removeEventListener("scroll", paint);
    ro.disconnect();
    writer?.clear();
  };
}

/* ── Live: auto-running infinite loop ───────────────────────────────── */

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

  /**
   * Single source of truth for the track position. Auto-run, momentum, page
   * scroll, wheel, keyboard and drag all write `x`; only `tick` renders it.
   * Kept in [-setW, 0) and rendered at `x - setW` so the middle copy is the
   * one in view.
   */
  let x = 0;
  /** Tweened by GSAP: `factor` eases auto-run in/out, `vel` carries a fling. */
  const s = { factor: 1, vel: 0 };
  /** Page-scroll displacement still to be eased into the rail. */
  let nudge = 0;

  let n = 0;
  let setW = 0;
  let step = 0;
  let railW = 0;
  let centres: number[] = [];
  let els: HTMLElement[] = [];
  let writer: ReturnType<typeof cardWriter> | null = null;
  /** Smoothed closeness-to-centre per card; -1 = snap to target next frame. */
  let vis: Float32Array = new Float32Array(0);
  let positioned = false;
  let inView = true;

  let hovered = false;
  let focused = false;
  let dragging = false;
  let coasting = false;

  const wrap = (v: number) => gsap.utils.wrap(-setW, 0, v);

  const measure = () => {
    els = cardsIn(trackEl);
    n = props.items.length;
    if (!n || els.length < n * 2) return;

    step = els.length > 1 ? els[1]!.offsetLeft - els[0]!.offsetLeft : els[0]!.offsetWidth;
    setW = els[n]!.offsetLeft - els[0]!.offsetLeft;
    railW = railEl.clientWidth;

    // Enough copies that a full viewport always sits inside rendered cards,
    // with one spare set either side of the middle copy.
    const needed = Math.max(3, 2 + Math.ceil(railW / setW));
    if (needed !== copies.value) {
      copies.value = needed;
      nextTick(measure);
      return;
    }

    writer?.clear();
    writer = cardWriter(gsap, els, STAGE);
    centres = els.map(centreOf);
    vis = new Float32Array(els.length).fill(-1);
    if (!positioned) {
      // Start with the first real card centred.
      x = railW / 2 - centres[0]!;
      positioned = true;
    }
    x = wrap(x);
  };

  const render = (alpha: number) => {
    if (!writer || !setW) return;

    const wrapped = wrap(x);
    if (wrapped !== x) {
      // Every card jumped by ±setW; hand each card the smoothed state of the
      // card that previously occupied its on-screen slot, so nothing pops.
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

    // Normalise against half the rail, but never fewer than ~3.5 cards so the
    // falloff still reads on narrow phones. [ref-tune] was step * 2.5
    const half = Math.max(railW / 2, step * 3.5);
    const band = Math.min(1, step / half);
    for (let i = 0; i < centres.length; i++) {
      const d = (centres[i]! + offset - railW / 2) / half;
      const target = 1 - Math.min(1, Math.abs(d));
      const cur = vis[i]!;
      const v = (vis[i] = cur < 0 ? target : cur + (target - cur) * alpha);
      writer.write(i, v, focusOf(v, band));
    }
  };

  // Purpose: the rail's continuous drift — the scene's one primary move.
  const tick = (_time: number, deltaMs: number) => {
    if (!inView || !setW) return;
    const dt = Math.min(deltaMs, 50) / 1000;
    const frames = dt * 60;

    x += (-props.speed * s.factor + s.vel) * dt;

    const eased = nudge * (1 - Math.pow(1 - 0.12, frames));
    nudge -= eased;
    x -= eased * NUDGE_GAIN;

    render(1 - Math.pow(1 - LERP, frames));
  };

  /* Pause / resume — always eased, never a hard stop. */
  const isHeld = () => hovered || focused || dragging || coasting || userPaused.value;

  const pause = (duration: number = DUR.md) =>
    gsap.to(s, { factor: 0, duration, ease: "power2.out", overwrite: "auto" });

  const resume = () => {
    if (isHeld()) return;
    gsap.to(s, { factor: 1, duration: DUR.lg, ease: EASE.inout, overwrite: "auto" });
  };

  /* Hover (mouse only — touch has no hover). */
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

  /* Drag / swipe via Pointer Events. */
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
    dragVel = dragVel * 0.6 + ((dx / dtMs) * 1000) * 0.4;
    lastX = e.clientX;
    lastT = e.timeStamp;
  };

  const onUp = (e: PointerEvent) => {
    if (!dragging || e.pointerId !== pointerId) return;
    dragging = false;
    pointerId = -1;
    if (railEl.hasPointerCapture(e.pointerId)) railEl.releasePointerCapture(e.pointerId);
    railEl.classList.remove("is-dragging");

    // A pointer that stopped before lifting shouldn't fling.
    if (e.timeStamp - lastT > 80) dragVel = 0;
    s.vel = gsap.utils.clamp(-MAX_FLING, MAX_FLING, dragVel);
    coasting = true;
    // Purpose: momentum after release, decaying before auto-run re-engages.
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

  /* Keyboard: pause while focus-visible inside; ←/→ step one card. */
  const onFocusIn = (e: FocusEvent) => {
    // Mouse clicks focus the rail too — only keyboard focus should hold it.
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
    // Offset of the card nearest the centre, then one card further along.
    let nearest = Infinity;
    for (const c of centres) {
      const off = c + x - setW - railW / 2;
      if (Math.abs(off) < Math.abs(nearest)) nearest = off;
    }
    const delta = -(nearest + dir * step);
    const p = { v: 0 };
    let applied = 0;
    glide?.kill();
    // Purpose: bring the next card to the centre on an arrow key.
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

  /* Horizontal trackpad swipes scrub the rail; vertical wheel stays the page's. */
  const onWheel = (e: WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    e.preventDefault();
    x -= e.deltaX;
  };

  /* Page scroll → rail nudge. Lenis when present, native scroll otherwise. */
  let lastY = window.scrollY;
  const onPageScroll = () => {
    const y = window.scrollY;
    const dy = y - lastY;
    lastY = y;
    // Ignore anchor jumps and off-screen scrolling.
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

  // No work at all while the section is off-screen.
  const io = new IntersectionObserver(([entry]) => {
    inView = !!entry?.isIntersecting;
    if (inView) vis.fill(-1);
  });
  io.observe(railEl);

  const ro = new ResizeObserver(() => measure());
  ro.observe(railEl);

  const stopItemsWatch = watch(
    () => props.items.length,
    () => nextTick(measure),
  );
  const stopPauseWatch = watch(userPaused, (paused) => (paused ? pause() : resume()));

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
    trackEl.style.transform = "";
    writer?.clear();
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
          <UIcon :name="userPaused ? 'i-heroicons-play-20-solid' : 'i-heroicons-pause-20-solid'" class="h-5 w-5" />
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
            <span data-glow class="product-rail__glow" aria-hidden="true" />
            <figure class="product-rail__figure">
              <img
                :src="image"
                :alt="name"
                loading="lazy"
                decoding="async"
                draggable="false"
                width="600"
                height="800"
              />
              <span data-accent class="product-rail__accent" aria-hidden="true" />
              <figcaption data-labels class="product-rail__labels">
                <span class="product-rail__index" aria-hidden="true">{{ pad(i + 1) }}</span>
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
  /* [ref-tune] near-black ground + gold accent, per the reference */
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
  --card-w: 180px;
  --gap: 16px;
  position: relative;
  padding-block: 32px 48px;
  -webkit-user-select: none;
  user-select: none;
  outline-offset: -6px;
}

@media (min-width: 640px) {
  .product-rail {
    --card-w: 240px;
    --gap: 24px;
  }
}

/* Static (pre-motion) + reduced motion: a native, keyboard-scrollable strip. */
.product-rail.is-static,
.product-rail.is-reduced {
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  scrollbar-color: color-mix(in srgb, var(--beige) 30%, transparent) transparent;
}

/* Live: JS owns horizontal travel; `clip` (not `hidden`) can't be scrolled by focus. */
.product-rail.is-live {
  overflow-x: clip;
  touch-action: pan-y;
}

.product-rail__track {
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--gap);
  width: max-content;
}

.is-static .product-rail__track,
.is-reduced .product-rail__track {
  /* Lets the first and last card reach the centre. */
  padding-inline: calc(50% - var(--card-w) / 2);
}

.is-live .product-rail__track {
  gap: 0;
  will-change: transform;
}

/*
 * [ref-tune] Stacked deck, live only: card centres sit 0.4 × card width apart
 * (as in the reference), so neighbours tuck behind the centre card. A
 * negative `gap` is invalid CSS, hence the margin. The native strips keep
 * their positive gap so nothing overlaps there.
 */
.is-live .product-rail__card {
  margin-inline-start: calc(var(--card-w) * -0.6);
}

/* ── Card ─────────────────────────────────────────────────── */
.product-rail__card {
  position: relative;
  flex: none;
  width: var(--card-w);
  aspect-ratio: 3 / 4;
  border-radius: 1.25rem;
  scroll-snap-align: center;
  transform-origin: 50% 50%;
}

.product-rail__glow {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  opacity: 0;
  pointer-events: none;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--rail-accent) 70%, transparent),
    0 0 48px -6px color-mix(in srgb, var(--rail-accent) 35%, transparent),
    0 28px 70px -18px color-mix(in srgb, var(--rail-accent) 30%, transparent);
}

.product-rail__figure {
  position: absolute;
  inset: 0;
  margin: 0;
  overflow: hidden;
  border-radius: inherit;
  background: var(--navy);
}

.product-rail__figure img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
  -webkit-user-drag: none;
}

/* [ref-tune] Gold tint on the centred card; GSAP drives its opacity. */
.product-rail__accent {
  position: absolute;
  inset: 0;
  opacity: 0;
  pointer-events: none;
  background: color-mix(in srgb, var(--rail-accent) 42%, transparent);
  mix-blend-mode: overlay;
}

/* [ref-tune] Index + caption as one layer, so one setter fades both. */
.product-rail__labels {
  position: absolute;
  inset: 0;
  margin: 0;
  pointer-events: none;
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
  background: linear-gradient(to top, color-mix(in srgb, var(--rail-ground) 90%, transparent) 35%, transparent);
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
</style>
