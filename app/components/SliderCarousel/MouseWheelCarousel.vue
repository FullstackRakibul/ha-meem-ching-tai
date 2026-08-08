<script setup>
import { Carousel, Pagination, Navigation, Slide } from "vue3-carousel";
import "vue3-carousel/carousel.css";

const props = defineProps({
  // The parent intercepts the wheel itself (to hand scrolling over to the page
  // on the last slide), so the carousel's own wheel handling stays ON at all
  // times — disabling it would also kill backward/up navigation.
  wheelEnabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["slide-change", "total-slides"]);

const images = [
  {
    id: 1,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai33.jpeg",
    title: "Precision Engineering",
    desc: "Crafting export-quality accessories for the global apparel industry.",
  },

  {
    id: 2,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai31.jpeg",
    title: "Precision Engineering",
    desc: "Crafting export-quality accessories for the global apparel industry.",
  },

  {
    id: 3,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai34.jpeg",
    title: "Advanced Technology",
    desc: "Leveraging modern machinery to ensure consistent, world-class quality.",
  },

  {
    id: 4,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai20.jpeg",
    title: "Precision Engineering",
    desc: "Crafting export-quality accessories for the global apparel industry.",
  },

  {
    id: 5,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai30.jpeg",
    title: "Built for Export",
    desc: "Strengthening Bangladesh's backward linkage industry.",
  },

  {
    id: 6,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai03.jpeg",
    title: "Strategic Partnership",
    desc: "A joint venture between Ha-Meem Group and Ching Tai.",
  },
  {
    id: 7,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg",
    title: "Global Reach",
    desc: "Trusted by sourcing teams across five continents.",
  },
];

const currentSlide = ref(0);
const isLastSlide = computed(() => currentSlide.value >= images.length - 1);

onMounted(() => {
  emit("total-slides", images.length);
  emit("slide-change", currentSlide.value);
});

// v-model is the reliable source of truth in vue3-carousel v0.15 —
// the emitted events (slide-start/slide-end) differ in payload shape.
watch(currentSlide, (index) => emit("slide-change", index));

// vue3-carousel 0.15 config. Notes on the non-obvious values:
//
//   autoplay — typed `number | undefined`: it IS the delay in ms. Passing the
//     `{ delay, pauseOnHover }` object shape from other carousel libraries
//     leaves autoplay silently dead. `pauseOnHover` is a separate top-level
//     prop called `pauseAutoplayOnHover`.
//
//   transition — also gates the wheel: the library sets `isSliding` for the
//     full duration and `useWheel` discards every event while it's true. At
//     2000ms that swallowed almost all wheel input, which is what made
//     up/down navigation feel stuck. 800ms still reads cinematic.
//
//   wrapAround stays false — index.vue's handover logic keys off "last slide"
//     to release the wheel to the page, and wrapping would never let it settle.
const config = computed(() => ({
  height: "100vh",
  itemsToShow: 1,
  gap: 0,
  wrapAround: false,
  // Cross-fade suits full-bleed photography (and the Ken Burns zoom) far
  // better than a horizontal slide.
  slideEffect: "fade",
  transition: 800,
  // With wrapAround:false, next() clamps at the last slide — so once we land
  // there autoplay would keep firing a no-op interval forever. Dropping it to
  // 0 stops the timer (the library treats <= 0 as "off" and re-inits on
  // change), which is right: the last slide is where the page takes over.
  autoplay: isLastSlide.value ? 0 : 6000,
  pauseAutoplayOnHover: true,
  // Object form raises the delta threshold above the default 10 so trackpad
  // micro-scrolls don't fire a slide change, and throttles repeat events.
  mouseWheel: props.wheelEnabled ? { threshold: 15, throttleTime: 200 } : false,
}));
</script>

<template>
  <Carousel v-model="currentSlide" v-bind="config" class="hct-carousel">
    <Slide v-for="slide in images" :key="slide.id">
      <div class="carousel__item">
        <!-- Image with Ken Burns Zoom Animation -->
        <img :src="slide.url" alt="" class="slide-image" />

        <!-- Overlay Text (Title & Description) -->
        <div class="text-overlay">
          <h2 class="overlay-title">{{ slide.title }}</h2>
          <p class="overlay-desc">{{ slide.desc }}</p>
        </div>

        <!-- Scrim keeps the glass header readable over bright images -->
        <div class="slide-scrim"></div>
      </div>
    </Slide>

    <template #addons>
      <Navigation />
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
.hct-carousel {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.carousel__item {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  /* Required for the Ken Burns zoom to stay inside */
}

/* ============================================
   KEN BURNS (Zoom) ANIMATION
   ============================================ */
/* Base state only. The zoom is applied to the ACTIVE slide (below) instead of
   every slide at once — otherwise each hidden slide's animation is already
   mid-cycle when it fades in, so it arrives at an arbitrary zoom level. */
.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transform: scale(1);
}

/* ============================================
   TEXT OVERLAY (Header & Description)
   ============================================ */
.text-overlay {
  position: absolute;
  inset: 0;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  pointer-events: none;
  /* Allows clicks to pass through to nav controls */
}

.overlay-title {
  font-family: serif;
  font-weight: bold;
  font-size: 2.5rem;
  line-height: 1.2;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 1rem;
}

.overlay-desc {
  max-width: 32rem;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  font-weight: 300;
}

/* Responsive text sizes */
@media (min-width: 768px) {
  .overlay-title {
    font-size: 5rem;
  }

  .overlay-desc {
    font-size: 1.25rem;
  }
}

/* Top-down gradient so nav text stays legible on light photos */
.slide-scrim {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(0, 0, 0, 0.05) 22%,
    rgba(0, 0, 0, 0) 45%,
    rgba(0, 0, 0, 0.1) 80%,
    rgba(0, 0, 0, 0.5) 100%
  );
}
</style>

<style>
/* Unscoped: vue3-carousel renders these internals outside our scope id */
.hct-carousel {
  /* Modern Ring Navigation */
  --vc-nav-background: transparent;
  --vc-nav-color: rgba(255, 255, 255, 0.8);
  --vc-nav-border: 1.5px solid rgba(255, 255, 255, 0.6);
  --vc-nav-border-radius: 50%;
  --vc-nav-width: 50px;
  --vc-nav-height: 50px;

  /* Sleek Pagination Dots */
  --vc-pgn-background-color: rgba(255, 255, 255, 0.4);
  --vc-pgn-active-color: rgba(255, 255, 255, 1);
  --vc-pgn-width: 12px;
  --vc-pgn-height: 12px;
  --vc-pgn-border-radius: 50%;
}

.hct-carousel .carousel__viewport {
  height: 100vh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.hct-carousel .carousel__track {
  height: 100vh;
  padding: 0;
  margin: 0;
}

/* width:100% (not 100vw) — 100vw includes the vertical scrollbar's width and
   is what pushes slides off-screen, producing a horizontal scrollbar. */
.hct-carousel .carousel__slide {
  height: 100vh;
  width: 100%;
  padding: 0;
  margin: 0;
  flex-shrink: 0;
}

/* --- Fade effect --------------------------------------------------------
   With slideEffect:"fade" the library stacks every slide in one grid cell
   (.is-effect-fade) and cross-fades opacity. `flex-shrink` above is a
   flex-only property and is inert here, but the track must not keep the
   flex sizing, so re-assert the grid the fade layout depends on. */
.hct-carousel.is-effect-fade .carousel__track {
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  height: 100vh;
}

.hct-carousel.is-effect-fade .carousel__slide {
  grid-area: 1 / 1;
  height: 100vh;
}

/* Ease the fade rather than running it linear — the library only sets a
   duration, so the timing function is ours to choose. */
.hct-carousel.is-effect-fade .carousel__slide {
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Overlay copy rises in behind the fade, title first. Keyed to --active so it
   replays on every slide change instead of only on mount. */
.hct-carousel .carousel__slide--active .overlay-title,
.hct-carousel .carousel__slide--active .overlay-desc {
  animation: hctRiseIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

.hct-carousel .carousel__slide--active .overlay-title {
  animation-delay: 150ms;
}

.hct-carousel .carousel__slide--active .overlay-desc {
  animation-delay: 300ms;
}

@keyframes hctRiseIn {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hct-carousel .carousel__slide--active .overlay-title,
  .hct-carousel .carousel__slide--active .overlay-desc {
    animation: none;
  }
}

/* Ken Burns runs only on the active slide, so the zoom starts from scale(1)
   each time a slide comes forward. `--vc-*`/`--active` are library classes,
   hence this lives in the unscoped block. Duration comfortably exceeds the
   6s autoplay delay so the motion never visibly resets mid-view. */
.hct-carousel .carousel__slide--active .slide-image {
  animation: hctKenBurns 9s ease-out forwards;
}

@keyframes hctKenBurns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.12);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hct-carousel .carousel__slide--active .slide-image {
    animation: none;
  }
}

/* Modern Pagination Positioning */
.hct-carousel .carousel__pagination {
  position: absolute;
  bottom: 2.5rem;
  width: 100%;
  margin: 0;
  z-index: 20;
  gap: 10px;
}

/* Modern Arrow Hover Effects */
.hct-carousel .carousel__prev:hover,
.hct-carousel .carousel__next:hover {
  --vc-nav-color: #ffffff;
  --vc-nav-background: rgba(255, 255, 255, 0.1);
  transform: scale(1.05);
}

/* Dot Transitions for a polished feel */
.hct-carousel .carousel__pagination-button {
  transition: all 0.3s ease;
}

.hct-carousel .carousel__pagination-button--active {
  transform: scale(1.2);
}
</style>
