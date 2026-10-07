<!-- components/landing/Loader.vue -->
<script setup lang="ts">
/**
 * Loader — threading.
 *
 * One gold thread sews a running stitch across the centre as progress runs
 * 0 → 100, with a needle at its leading edge; the HCTPAL wordmark is
 * uncovered behind the needle (clip-path). Progress is one CSS variable,
 * --loader-p (0–1), registered with @property so a short linear transition
 * smooths jumps between values.
 *
 * Exit (`loaded`): it starts at once — the thread pulls taut (0.2s), then the
 * cover opens along the seam, top half up and bottom half down (0.45s). It is
 * gone in 0.65s, never adds waiting time, and is then hidden, inert and
 * click-through. The first paint is correct from CSS alone. Reduced motion:
 * no thread motion, a 0.2s fade.
 */
const props = defineProps<{
  loaded: boolean
  loadingProgress: number
}>()

const percent = computed(() => String(props.loadingProgress).padStart(2, '0'))
/** The one value the thread, needle and wordmark read. Done means drawn. */
const progress = computed(() =>
  props.loaded ? 1 : Math.min(1, Math.max(0, props.loadingProgress / 100))
)
</script>

<template>
  <div
    :class="['loader', { 'loader--done': loaded }]"
    :style="{ '--loader-p': progress }"
    :inert="loaded"
    aria-hidden="true"
  >
    <div class="loader__half loader__half--top">
      <div class="loader__topline">
        <span>Ha-Meem Ching Tai</span>
        <span>Narsingdi · Bangladesh</span>
      </div>
      <div class="loader__center">
        <p class="loader__eyebrow">Pocketing · Interlining · Lining · Waistband</p>
        <p class="loader__percentage"><span class="loader__digits">{{ percent }}</span>%</p>
        <p class="loader__word">HCTPAL</p>
      </div>
    </div>

    <div class="loader__half loader__half--bottom">
      <div class="loader__bottom">
        <span>Dhaka · Bangladesh</span>
        <span><span class="loader__digits">{{ percent }}</span>%</span>
      </div>
    </div>

    <!-- The seam: dashed ghost, the sewn stitch, the taut thread, the needle. -->
    <div class="loader__seam">
      <span class="loader__ghost" />
      <span class="loader__stitch" />
      <span class="loader__taut" />
      <span class="loader__needle-run">
        <svg class="loader__needle" viewBox="0 0 36 8" focusable="false">
          <path
            fill-rule="evenodd"
            d="M1.5 2.4L28 3.2L36 4L28 4.8L1.5 5.6A1.6 1.6 0 0 1 1.5 2.4ZM4 3.4L9 3.55A0.45 0.45 0 0 1 9 4.45L4 4.6A0.6 0.6 0 0 1 4 3.4Z"
          />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped>
/* Registered so it can transition: every moving part reads this one value. */
@property --loader-p {
  syntax: "<number>";
  inherits: true;
  initial-value: 0;
}

.loader {
  --seam-w: min(84vw, 760px);
  position: fixed;
  inset: 0;
  z-index: 2500;
  overflow: hidden;
  color: var(--on-night);
  /* A short linear glide between progress values. */
  transition: --loader-p var(--dur-xs) linear;
}

/* ─── The cover: two halves that meet at the seam ─── */
.loader__half {
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  height: 50%;
  flex-direction: column;
  padding: clamp(14px, 2.4vw, 34px);
  background: var(--night);
}

.loader__half--top {
  top: 0;
  justify-content: space-between;
}

.loader__half--bottom {
  bottom: 0;
  justify-content: flex-end;
}

.loader__topline,
.loader__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.13em;
  line-height: 1.2;
  text-transform: uppercase;
}

.loader__topline {
  padding-bottom: 14px;
  border-bottom: 1px solid var(--light-line);
}

.loader__bottom {
  padding-top: 14px;
  border-top: 1px solid var(--light-line);
}

.loader__center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(8px, 1.4vh, 14px);
  padding-bottom: clamp(14px, 2.6vh, 26px);
  text-align: center;
}

.loader__eyebrow {
  color: var(--on-night-muted);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.19em;
  line-height: 1.4;
  text-transform: uppercase;
}

.loader__percentage {
  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: 600;
  letter-spacing: 0.08em;
}

/* Fixed-width digits, so the label never jitters as the number changes. */
.loader__digits {
  display: inline-block;
  min-width: 3ch;
  font-variant-numeric: tabular-nums;
  text-align: right;
}

/* The wordmark spans the seam's width, so its reveal edge is the needle. */
.loader__word {
  width: var(--seam-w);
  font-size: clamp(56px, 14vw, 168px);
  font-weight: 800;
  letter-spacing: -0.06em;
  line-height: 0.82;
  clip-path: inset(0 calc((1 - var(--loader-p)) * 100%) 0 0);
}

/* ─── The seam ─── */
.loader__seam {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--seam-w);
  height: 2px;
  transform: translate(-50%, -50%);
}

.loader__ghost,
.loader__stitch,
.loader__taut,
.loader__needle-run {
  position: absolute;
  inset: 0;
}

.loader__ghost {
  border-top: 2px dashed color-mix(in srgb, var(--gold) 22%, transparent);
}

/* The running stitch, sewn as far as the needle has gone. */
.loader__stitch {
  border-top: 2px dashed var(--gold);
  clip-path: inset(0 calc((1 - var(--loader-p)) * 100%) 0 0);
}

.loader__taut {
  background: var(--gold);
  opacity: 0;
}

.loader__needle-run {
  transform: translateX(calc(var(--loader-p) * 100%));
}

/* Tip on the leading edge; the eye trails back along the stitch. */
.loader__needle {
  position: absolute;
  top: 50%;
  left: 0;
  width: 36px;
  height: 8px;
  color: var(--gold);
  transform: translate(-100%, -50%);
}

.loader__needle path {
  fill: currentColor;
  stroke: none;
}

/* ─── Exit ─── */
.loader--done {
  visibility: hidden;
  pointer-events: none;
  /* Hidden once the halves are open: taut (xs) + open (sm). */
  transition: --loader-p var(--dur-xs) linear,
    visibility 0s linear calc(var(--dur-xs) + var(--dur-sm));
}

.loader--done .loader__stitch,
.loader--done .loader__needle-run,
.loader--done .loader__seam {
  opacity: 0;
}

.loader--done .loader__taut {
  opacity: 1;
}

.loader--done .loader__half--top {
  transform: translateY(-100%);
}

.loader--done .loader__half--bottom {
  transform: translateY(100%);
}

@media (prefers-reduced-motion: no-preference) {
  /* 1 · The thread pulls taut: stitches close into one line. */
  .loader--done .loader__stitch,
  .loader--done .loader__needle-run,
  .loader--done .loader__taut {
    transition: opacity var(--dur-xs) linear;
  }

  /* 2 · The cover opens along the seam, and the thread goes with it. */
  .loader--done .loader__half {
    transition: transform var(--dur-sm) var(--ease-inout) var(--dur-xs);
  }

  .loader--done .loader__seam {
    transition: opacity var(--dur-sm) linear var(--dur-xs);
  }
}

/* Reduced motion: nothing sews or opens; the loader fades in 0.2s. The
   !important beats main.css's global 0.01ms transition clamp. */
@media (prefers-reduced-motion: reduce) {
  .loader {
    transition: none;
  }

  .loader--done {
    opacity: 0;
    transition: opacity var(--dur-xs) linear, visibility 0s linear var(--dur-xs) !important;
  }

  .loader--done .loader__half--top,
  .loader--done .loader__half--bottom {
    transform: none;
  }

  .loader--done .loader__stitch,
  .loader--done .loader__needle-run,
  .loader--done .loader__seam {
    opacity: 1;
  }

  .loader--done .loader__taut {
    opacity: 0;
  }
}
</style>
