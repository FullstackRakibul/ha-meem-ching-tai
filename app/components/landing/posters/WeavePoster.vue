<!-- components/landing/posters/WeavePoster.vue -->
<script setup lang="ts">
/**
 * Output as cloth — woven as denim.
 *
 * The panel is 64 × 32 cells. The woven rows are exactly the share of today's
 * output in future capacity (500,000 ÷ 2,000,000 = 25%, i.e. 8 of 32 rows).
 * Those rows are indigo 3/1 twill, the weave that makes denim: a shuttle
 * carries the weft across, one pick per row, back and forth, and the cloth
 * appears behind it. The finished edge gets a red-line selvedge, a gold
 * double topstitch and a light stone-wash. The other 24 rows stay raw indigo
 * warp yarn — capacity still to come.
 *
 * Plays once when the poster comes into view. Without JavaScript, or under
 * reduced motion, it shows the finished state straight away.
 */
import { WOVEN_SHARE } from "~/composables/useLoomStage";

const COLS = 64;
const ROWS = 32;
const W = COLS * 2;
const H = ROWS * 2;
const ROW_H = H / ROWS;
const wovenRows = Math.round(ROWS * WOVEN_SHARE);
const WOVEN_H = wovenRows * ROW_H;

/** One pick per woven row. Even rows run left to right, odd rows come back. */
const picks = Array.from({ length: wovenRows }, (_, i) => {
  const y = i * ROW_H + ROW_H / 2;
  const ltr = i % 2 === 0;
  return { i, y, ltr, d: ltr ? `M0 ${y}H${W}` : `M${W} ${y}H0` };
});

/** Raw warp yarns hanging below the cloth, one per column. */
const warp = Array.from({ length: COLS }, (_, i) => i * 2 + 1);

const root = ref<SVGSVGElement | null>(null);
/** Set by JS only, so the server-rendered poster is already finished. */
const armed = ref(false);
const weaving = ref(false);

let io: IntersectionObserver | undefined;

onMounted(() => {
  const el = root.value;
  if (!el) return;
  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }
  armed.value = true;
  io = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      weaving.value = true;
      io?.disconnect();
    },
    { threshold: 0.35 }
  );
  io.observe(el);
});

onBeforeUnmount(() => io?.disconnect());
</script>

<template>
  <svg
    ref="root"
    :class="[
      'loom-poster',
      'loom-poster--weave',
      'denim',
      { 'is-armed': armed, 'is-weaving': weaving },
    ]"
    data-poster="stats"
    :viewBox="`0 0 ${W} ${H}`"
    :style="{ '--rows': wovenRows }"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
    focusable="false"
  >
    <defs>
      <!-- 3/1 twill: indigo warp with the white weft showing as diagonal ribs. -->
      <pattern id="hctDenimTwill" width="2" height="2" patternUnits="userSpaceOnUse">
        <rect class="denim__ink" width="2" height="2" />
        <path class="denim__rib" d="M-0.5 0.5L0.5-0.5M0 2L2 0M1.5 2.5L2.5 1.5" />
      </pattern>

      <!-- Slubs: short uneven weft highlights, the texture of real denim. -->
      <pattern id="hctDenimSlub" width="11" height="6" patternUnits="userSpaceOnUse">
        <path class="denim__slub" d="M1 1.1h2.4M6.5 3.1h1.6M3 5.1h3M8.6 0.6h1.4" />
      </pattern>

      <!-- Stone-wash: the middle of the cloth fades lighter. -->
      <radialGradient id="hctDenimWash" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stop-color="#dfe8f2" stop-opacity="0.32" />
        <stop offset="1" stop-color="#dfe8f2" stop-opacity="0" />
      </radialGradient>
    </defs>

    <!--
      Raw warp: indigo yarns over the whole panel. The cloth is woven over
      the top quarter; below it they stay bare (future capacity).
    -->
    <g class="denim__warp">
      <path v-for="x in warp" :key="x" :d="`M${x} 0V${H}`" />
    </g>

    <!-- The cloth, one pick at a time. -->
    <path
      v-for="p in picks"
      :key="`pick-${p.i}`"
      class="denim__pick"
      :d="p.d"
      pathLength="1"
      stroke="url(#hctDenimTwill)"
      :stroke-width="ROW_H + 0.06"
      :style="{ '--i': p.i }"
    />

    <!-- Red-line selvedge, finished as each pick turns at the edge. -->
    <g
      v-for="p in picks"
      :key="`selv-${p.i}`"
      class="denim__selvedge"
      :style="{ '--i': p.i }"
    >
      <rect
        class="denim__selvedge-base"
        x="0"
        :y="p.i * ROW_H"
        width="1.3"
        :height="ROW_H + 0.06"
      />
      <rect
        class="denim__selvedge-base"
        :x="W - 1.3"
        :y="p.i * ROW_H"
        width="1.3"
        :height="ROW_H + 0.06"
      />
      <rect
        class="denim__selvedge-red"
        x="0.5"
        :y="p.i * ROW_H"
        width="0.28"
        :height="ROW_H + 0.06"
      />
      <rect
        class="denim__selvedge-red"
        :x="W - 0.78"
        :y="p.i * ROW_H"
        width="0.28"
        :height="ROW_H + 0.06"
      />
    </g>

    <!-- Finish, once the last pick is in: slubs, wash, then the topstitch. -->
    <g class="denim__finish">
      <rect :width="W" :height="WOVEN_H" fill="url(#hctDenimSlub)" />
      <rect :width="W" :height="WOVEN_H" fill="url(#hctDenimWash)" />
    </g>
    <g class="denim__topstitch">
      <path :d="`M2.3 ${WOVEN_H - 2.1}H${W - 2.3}`" />
      <path :d="`M2.3 ${WOVEN_H - 1.1}H${W - 2.3}`" />
    </g>

    <!-- The shuttle: carries the weft across each row, then disappears. -->
    <g v-for="p in picks" :key="`shuttle-${p.i}`" :transform="`translate(0 ${p.y})`">
      <g :class="['denim__shuttle', p.ltr ? 'is-ltr' : 'is-rtl']" :style="{ '--i': p.i }">
        <path
          class="denim__shuttle-body"
          d="M-3.4 0Q-3.4-1.05 0-1.05Q3.4-1.05 3.4 0Q3.4 1.05 0 1.05Q-3.4 1.05-3.4 0Z"
        />
        <path class="denim__shuttle-bobbin" d="M-1.5 0H1.5" />
      </g>
    </g>
  </svg>
</template>

<style scoped>
.denim {
  /* Artwork colours: denim indigo and thread, not UI tokens. */
  --denim-ink: #1f3b63;
  --denim-rib: #4a6d9a;
  --denim-yarn: #5b7fae;
  --denim-thread: var(--wood-tan, #c8954d);
  --selvedge: #ece6d8;
  --selvedge-red: #b8402f;
  /* One pick takes this long; the next starts right after. */
  --pass: 0.42s;
  --gap: 0.06s;

  display: block;
  width: 100%;
  height: auto;
  overflow: visible;
}

.denim__ink {
  fill: var(--denim-ink);
}

.denim__rib {
  fill: none;
  stroke: var(--denim-rib);
  stroke-width: 0.34;
  stroke-linecap: square;
}

.denim__slub {
  fill: none;
  stroke: #e6edf5;
  stroke-width: 0.35;
  stroke-linecap: round;
  opacity: 0.22;
}

.denim__warp path {
  fill: none;
  stroke: var(--denim-yarn);
  stroke-width: 0.45;
  stroke-linecap: round;
  opacity: 0.5;
}

/* Alternate yarn weight so the warp reads as spun yarn, not ruled lines. */
.denim__warp path:nth-child(3n) {
  opacity: 0.32;
}

.denim__warp path:nth-child(4n + 1) {
  stroke-width: 0.6;
}

.denim__pick {
  fill: none;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
}

.denim__selvedge-base {
  fill: var(--selvedge);
}

.denim__selvedge-red {
  fill: var(--selvedge-red);
}

.denim__topstitch path {
  fill: none;
  stroke: var(--denim-thread);
  stroke-width: 0.32;
  stroke-dasharray: 1.3 0.8;
  stroke-linecap: round;
}

.denim__shuttle {
  opacity: 0;
}

.denim__shuttle-body {
  fill: var(--denim-thread);
  stroke: rgb(0 0 0 / 0.35);
  stroke-width: 0.15;
}

.denim__shuttle-bobbin {
  fill: none;
  stroke: var(--selvedge);
  stroke-width: 0.5;
  stroke-linecap: round;
}

/* ── Armed by JS: start from bare warp. ─────────────────────────── */
.is-armed .denim__pick {
  stroke-dashoffset: 1;
}

.is-armed .denim__selvedge,
.is-armed .denim__finish,
.is-armed .denim__topstitch {
  opacity: 0;
}

/* ── Weaving: one pick per row, the shuttle leading. ────────────── */
.is-weaving .denim__pick {
  animation: denim-pick var(--pass) linear forwards;
  animation-delay: calc(var(--i) * (var(--pass) + var(--gap)) + 0.2s);
}

.is-weaving .denim__selvedge {
  animation: denim-fade 0.25s ease-out forwards;
  animation-delay: calc(var(--i) * (var(--pass) + var(--gap)) + 0.2s + var(--pass) * 0.8);
}

.is-weaving .denim__shuttle.is-ltr {
  animation: denim-shuttle-ltr var(--pass) linear forwards;
  animation-delay: calc(var(--i) * (var(--pass) + var(--gap)) + 0.2s);
}

.is-weaving .denim__shuttle.is-rtl {
  animation: denim-shuttle-rtl var(--pass) linear forwards;
  animation-delay: calc(var(--i) * (var(--pass) + var(--gap)) + 0.2s);
}

.is-weaving .denim__finish {
  animation: denim-fade 0.9s ease-out forwards;
  animation-delay: calc(var(--rows) * (var(--pass) + var(--gap)) + 0.3s);
}

.is-weaving .denim__topstitch {
  animation: denim-fade 0.6s ease-out forwards;
  animation-delay: calc(var(--rows) * (var(--pass) + var(--gap)) + 0.8s);
}

@keyframes denim-pick {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes denim-fade {
  to {
    opacity: 1;
  }
}

/* The shuttle is 6.8 units long; it starts just off one edge and ends just off the other. */
@keyframes denim-shuttle-ltr {
  0% {
    opacity: 1;
    transform: translateX(-2px);
  }

  92% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(130px);
  }
}

@keyframes denim-shuttle-rtl {
  0% {
    opacity: 1;
    transform: translateX(130px);
  }

  92% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: translateX(-2px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .denim__pick,
  .denim__selvedge,
  .denim__finish,
  .denim__topstitch,
  .denim__shuttle {
    animation: none !important;
  }
}
</style>
