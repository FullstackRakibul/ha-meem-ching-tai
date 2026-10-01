<template>
  <!-- Scroll progress tracer: replaces the native scrollbar. 
       Now styled as a garment stitch (Mustard Gold thread on a dashed rail)
       with an integrated Back to Top button. -->
  <div
    class="scroll-tracer"
    :class="{ 'scroll-tracer--on-dark': onDark }"
    aria-hidden="true"
  >
    <!-- The Sewing Track -->
    <div class="scroll-tracer__track">
      <!-- The fabric guideline (Unread dashed line) -->
      <div class="scroll-tracer__rail"></div>

      <!-- The gold thread (Read dashed line) -->
      <div class="scroll-tracer__trail" :style="{ height: `${progress}%` }"></div>

      <!-- The needle/knot (Leading edge) -->
      <div class="scroll-tracer__dot" :style="{ top: `${progress}%` }"></div>
    </div>

    <!-- Back to Top Button -->
    <button
      type="button"
      class="back-to-top"
      :class="{ 'is-visible': showTopBtn }"
      @click="scrollToTop"
      aria-label="Back to top"
    >
      <svg
        class="w-5 h-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { useWindowScroll, useWindowSize, useDebounceFn } from "@vueuse/core";
import { useRoute, useNuxtApp } from "#app";

const { y } = useWindowScroll();
const { height: viewportHeight } = useWindowSize();
const nuxtApp = useNuxtApp();

// Document height calculation
const docHeight = ref(0);
const measure = () => {
  docHeight.value = document.documentElement.scrollHeight;
};
const debouncedMeasure = useDebounceFn(measure, 100);

onMounted(() => {
  measure();
  const observer = new ResizeObserver(debouncedMeasure);
  observer.observe(document.body);
  onBeforeUnmount(() => observer.disconnect());
});

watch(viewportHeight, measure);

// Dark mode check for hero section overlap
const route = useRoute();
const onDark = computed(
  () => route.meta.fullBleed === true && y.value < viewportHeight.value * 0.85
);

// Scroll progress calculation (0 to 100)
const progress = computed(() => {
  const scrollable = docHeight.value - viewportHeight.value;
  if (scrollable <= 0) return 0;
  return Math.min(100, Math.max(0, (y.value / scrollable) * 100));
});

// Show the Back to Top button only after scrolling down one viewport height
const showTopBtn = computed(() => y.value > viewportHeight.value * 0.5);

// Smooth scroll to top using Lenis if available, fallback to native
const scrollToTop = () => {
  if (nuxtApp.$lenis) {
    nuxtApp.$lenis.scrollTo(0, { immediate: false, duration: 1.2 });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
};
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
  right: 12px;
  bottom: 0;
  width: 48px;
  /* Widened to contain the button */
  z-index: 60;
  pointer-events: none;
  /* Let clicks pass through the container... */
}

/* ─── The Sewing Track ─── */
.scroll-tracer__track {
  position: absolute;
  top: 0;
  bottom: 85px;
  /* Stop before the button */
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
}

/* Unread Track: Faint dashed guideline */
.scroll-tracer__rail {
  position: absolute;
  inset: 0;
  width: 2px;
  /* Dashed gradient to mimic a stitch path */
  background-image: linear-gradient(
    to bottom,
    rgba(39, 66, 87, 0.2) 50%,
    transparent 50%
  );
  background-size: 2px 14px;
}

/* Read Track: Mustard Gold thread */
.scroll-tracer__trail {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 2px;
  background-image: linear-gradient(to bottom, #e8b938 50%, transparent 50%);
  background-size: 2px 14px;
}

/* The Needle / Knot */
.scroll-tracer__dot {
  position: absolute;
  left: 50%;
  width: 4px;
  height: 18px;
  /* Elongated to look like a needle weaving the thread */
  border-radius: 4px;
  background: #e8b938;
  transform: translate(-50%, -100%);
  box-shadow: 0 2px 8px rgba(39, 66, 87, 0.5);
}

/* ─── Over Dark Backgrounds (Hero Section) ─── */
.scroll-tracer--on-dark .scroll-tracer__rail {
  background-image: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0.25) 50%,
    transparent 50%
  );
}

.scroll-tracer--on-dark .scroll-tracer__trail {
  background-image: linear-gradient(to bottom, #ffffff 50%, transparent 50%);
}

.scroll-tracer--on-dark .scroll-tracer__dot {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

/* ─── Back to Top Button ─── */
.back-to-top {
  position: absolute;
  bottom: 24px;
  left: 50%;
  width: 42px;
  height: 42px;
  border-radius: 50%;

  /* Matches your reference image: Gold core, heavy dark ring */
  background-color: #948fc8;
  border: 4px solid #142e53;
  color: #142e53;

  display: flex;
  align-items: center;
  justify-content: center;

  /* ...re-enable clicks for the button specifically */
  pointer-events: auto;
  cursor: pointer;

  /* Hidden state */
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%) translateY(15px) scale(0.9);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateX(-50%) translateY(0) scale(1);
}

.back-to-top:hover {
  background-color: #f1ca58;
  transform: translateX(-50%) translateY(-3px) scale(1.05);
  box-shadow: 0 10px 20px -5px rgba(20, 46, 83, 0.3);
}

/* ─── Transitions & Hardware Acceleration ─── */
.scroll-tracer__trail,
.scroll-tracer__dot {
  transition-property: height, top, background-image, background, box-shadow;
  transition-duration: 120ms, 120ms, 400ms, 400ms, 400ms;
  transition-timing-function: linear, linear, ease, ease, ease;
}

/* ─────────────── Reduced motion ─────────────── */
@media (prefers-reduced-motion: reduce) {
  .stitch__thread,
  .stitch__needle,
  .to-top,
  .to-top__ring-fill {
    transition: none;
  }

  .back-to-top {
    transition: opacity 0.2s;
    transform: translateX(-50%);
  }

  .back-to-top:hover {
    transform: translateX(-50%);
  }
}

/* Hide on touch devices — they handle their own scrollbars/momentum natively */
@media (max-width: 640px) {
  .stitch {
    display: none;
  }

  .to-top {
    right: 12px;
  }
}
</style>
