<template>
  <!-- Running-stitch scroll tracer + back-to-top.
       Tracer is decorative (aria-hidden, pointer-events:none); button is live. -->
  <div class="stitch-root">
    <!-- ── Sewing tracer (desktop edge) ──────────────────────────────────── -->
    <div
      v-if="mounted"
      class="stitch"
      :class="{ 'stitch--on-dark': onDark }"
      aria-hidden="true"
    >
      <!-- Unread: faint stitch guide (needle holes waiting for thread). -->
      <div class="stitch__rail"></div>

      <!-- Read: the thread, sewn stitch-by-stitch as you scroll. -->
      <div class="stitch__thread" :style="{ height: `${progress}%` }"></div>

      <!-- The needle, leading the thread and dipping as it sews. -->
      <div class="stitch__needle" :style="{ top: `${progress}%` }">
        <span class="stitch__needle-tip"></span>
      </div>
    </div>

    <!-- ── Back to top ───────────────────────────────────────────────────── -->
    <Transition name="totop">
      <button
        v-if="showTop"
        type="button"
        class="to-top"
        aria-label="Back to top"
        @click="scrollToTop"
      >
        <!-- Progress ring — a compact second tracer that works on mobile too. -->
        <svg class="to-top__ring" viewBox="0 0 44 44" aria-hidden="true">
          <circle class="to-top__ring-track" cx="22" cy="22" r="20" />
          <circle
            class="to-top__ring-fill"
            cx="22"
            cy="22"
            r="20"
            :stroke-dasharray="RING_C"
            :stroke-dashoffset="ringOffset"
          />
        </svg>
        <svg class="to-top__arrow" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 19V5M5 12l7-7 7 7" />
        </svg>
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { useWindowScroll, useWindowSize, useDebounceFn } from "@vueuse/core";

const RING_R = 20;
const RING_C = 2 * Math.PI * RING_R;

const { y } = useWindowScroll();
const { height: viewportHeight } = useWindowSize();

const mounted = ref(false);

// Full document height changes as images load and sections mount, so it can't
// be captured once — recompute on resize and on a debounced body-resize tick.
const docHeight = ref(0);
const measure = () => {
  docHeight.value = document.documentElement.scrollHeight;
};
const debouncedMeasure = useDebounceFn(measure, 100);

// The only dark backdrop is the homepage's sticky hero, which owns roughly the
// first viewport. `fullBleed` is the same flag the layout uses for edge-to-edge
// pages, so it identifies hero pages without this component knowing routes.
const route = useRoute();
const onDark = computed(
  () => route.meta.fullBleed === true && y.value < viewportHeight.value * 0.85
);

const progress = computed(() => {
  const scrollable = docHeight.value - viewportHeight.value;
  if (scrollable <= 0) return 0;
  return Math.min(100, Math.max(0, (y.value / scrollable) * 100));
});

/* --- Back to top ---------------------------------------------------------- */
const showTop = computed(
  () => viewportHeight.value > 0 && y.value > viewportHeight.value * 0.6
);
const ringOffset = computed(() => RING_C * (1 - progress.value / 100));

const scrollToTop = () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const nuxt = useNuxtApp();
  // Use the page's Lenis instance so the return matches the site's smooth
  // scroll; fall back to the native API if Lenis isn't mounted.
  if (nuxt.$lenis?.scrollTo) {
    nuxt.$lenis.scrollTo(0, { immediate: reduce, duration: reduce ? 0 : 1.1 });
  } else {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }
};

onMounted(() => {
  mounted.value = true;
  measure();
  // Late-loading imagery changes page height after mount; observing the body
  // keeps the tracer honest without polling.
  const observer = new ResizeObserver(debouncedMeasure);
  observer.observe(document.body);
  onBeforeUnmount(() => observer.disconnect());
});

watch(viewportHeight, measure);
</script>

<style scoped>
/* ─────────────── Running-stitch tracer ─────────────── */
.stitch {
  /* Stitch rhythm — tweak these to change the sewing look.
     --dash = length of one stitch, --gap = thread-under gap between stitches. */
  --dash: 7px;
  --gap: 6px;
  --thread: 2px;

  position: fixed;
  top: 0;
  right: 14px;
  bottom: 0;
  width: 12px;
  z-index: 60;
  pointer-events: none;
}

/* Unread guide — the stitch line waiting to be sewn. */
.stitch__rail {
  position: absolute;
  inset: 0;
  width: var(--thread);
  margin: 0 auto;
  background: repeating-linear-gradient(
    to bottom,
    rgba(20, 46, 83, 0.18) 0 var(--dash),
    transparent var(--dash) calc(var(--dash) + var(--gap))
  );
  /* Soft fade at the very top and bottom so the line doesn't hit the edges. */
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent,
    #000 6%,
    #000 94%,
    transparent
  );
  mask-image: linear-gradient(to bottom, transparent, #000 6%, #000 94%, transparent);
}

/* Read thread — navy stitches, grown from the top as you scroll. */
.stitch__thread {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: var(--thread);
  margin: 0 auto;
  background: repeating-linear-gradient(
    to bottom,
    var(--color-navy-500, #142e53) 0 var(--dash),
    transparent var(--dash) calc(var(--dash) + var(--gap))
  );
  transition: height 90ms linear;
}

/* The needle head — a teardrop tip that dips down as it sews. */
.stitch__needle {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: top 90ms linear;
}

.stitch__needle-tip {
  display: block;
  width: 9px;
  height: 9px;
  background: #fff;
  border-radius: 50% 50% 50% 0;
  /* teardrop — the point faces the stitch line */
  transform: translateY(-1px) rotate(45deg);
  box-shadow: 0 0 0 1px var(--color-navy-500, #142e53), 0 0 8px 2px rgba(20, 46, 83, 0.5),
    0 0 16px 4px rgba(20, 46, 83, 0.22);
  animation: sew 1.15s ease-in-out infinite;
}

/* The sewing motion: the needle bobs straight down and back up. */
@keyframes sew {
  0%,
  100% {
    transform: translateY(-1.5px) rotate(45deg);
  }

  50% {
    transform: translateY(2.5px) rotate(45deg);
  }
}

/* Over the dark hero, lift the whole stitch to white. */
.stitch--on-dark .stitch__rail {
  background: repeating-linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.24) 0 var(--dash),
    transparent var(--dash) calc(var(--dash) + var(--gap))
  );
}

.stitch--on-dark .stitch__thread {
  background: repeating-linear-gradient(
    to bottom,
    #fff 0 var(--dash),
    transparent var(--dash) calc(var(--dash) + var(--gap))
  );
}

.stitch--on-dark .stitch__needle-tip {
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.9), 0 0 8px 2px rgba(255, 255, 255, 0.6),
    0 0 16px 4px rgba(255, 255, 255, 0.3);
}

/* ─────────────── Back to top ─────────────── */
.to-top {
  position: fixed;
  right: 14px;
  bottom: max(18px, env(safe-area-inset-bottom, 0px));
  z-index: 61;
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  border-radius: 9999px;
  background: #fff;
  border: 1px solid rgba(20, 46, 83, 0.12);
  box-shadow: 0 6px 20px rgba(20, 46, 83, 0.16), 0 1px 2px rgba(20, 46, 83, 0.1);
  color: var(--color-navy-500, #142e53);
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease,
    background-color 0.3s ease, color 0.3s ease;
}

.to-top:hover {
  transform: translateY(-3px);
  background: var(--color-navy-500, #142e53);
  color: #fff;
  box-shadow: 0 10px 26px rgba(20, 46, 83, 0.28);
}

.to-top:active {
  transform: translateY(-1px) scale(0.96);
}

.to-top:focus-visible {
  outline: 2px solid var(--color-navy-500, #142e53);
  outline-offset: 3px;
}

.to-top__ring {
  position: absolute;
  inset: 0;
  width: 44px;
  height: 44px;
  transform: rotate(-90deg);
  /* start the fill at 12 o'clock */
  pointer-events: none;
}

.to-top__ring-track {
  fill: none;
  stroke: rgba(20, 46, 83, 0.12);
  stroke-width: 2;
}

.to-top__ring-fill {
  fill: none;
  stroke: var(--color-navy-500, #142e53);
  stroke-width: 2;
  stroke-linecap: round;
  transition: stroke-dashoffset 90ms linear;
}

.to-top:hover .to-top__ring-track {
  stroke: rgba(255, 255, 255, 0.25);
}

.to-top:hover .to-top__ring-fill {
  stroke: #fff;
}

.to-top__arrow {
  position: relative;
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
}

/* Entrance */
.totop-enter-active,
.totop-leave-active {
  transition: opacity 0.35s ease, transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.totop-enter-from,
.totop-leave-to {
  opacity: 0;
  transform: translateY(14px) scale(0.85);
}

/* ─────────────── Reduced motion ─────────────── */
@media (prefers-reduced-motion: reduce) {
  .stitch__thread,
  .stitch__needle,
  .to-top,
  .to-top__ring-fill {
    transition: none;
  }

  .stitch__needle-tip {
    animation: none;
    transform: rotate(45deg);
  }

  .totop-enter-active,
  .totop-leave-active {
    transition: opacity 0.2s ease;
  }

  .totop-enter-from,
  .totop-leave-to {
    transform: none;
  }
}

/* Touch/narrow: the edge stitch crowds the screen — hide it, keep the button. */
@media (max-width: 640px) {
  .stitch {
    display: none;
  }

  .to-top {
    right: 12px;
  }
}
</style>
