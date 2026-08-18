<script setup>
// Navigation/Pagination addons are not imported: the control bar below is
// hand-rolled (see "Custom controls"), driven by v-model.
import { Carousel, Slide } from "vue3-carousel";
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
    url: "https://api.hameemgroup.com:9012/Resources/HCTPALc/HameemChingTai40.jpeg",
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

  // {
  //   id: 5,
  //   url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai30.jpeg",
  //   title: "Built for Export",
  //   desc: "Strengthening Bangladesh's backward linkage industry.",
  // },

  {
    id: 5,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai03.jpeg",
    title: "Strategic Partnership",
    desc: "A joint venture between Ha-Meem Group and Ching Tai.",
  },
  {
    id: 6,
    url: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg",
    title: "Global Reach",
    desc: "Trusted by sourcing teams across five continents.",
  },
];

const currentSlide = ref(0);
const isLastSlide = computed(() => currentSlide.value >= images.length - 1);

// Coarse pointer = phone/tablet. Used to switch the carousel from
// wheel-driven (desktop) to swipe-driven (touch); see `config` below.
// Resolved on the client only — SSR has no matchMedia, and defaulting to
// false means the server renders the desktop config, which then corrects on
// mount before any interaction is possible.
const isTouch = ref(false);

onMounted(() => {
  const mq = window.matchMedia("(hover: none) and (pointer: coarse)");
  isTouch.value = mq.matches;
  const onChange = (e) => (isTouch.value = e.matches);
  mq.addEventListener("change", onChange);
  onBeforeUnmount(() => mq.removeEventListener("change", onChange));
});

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
//   transition — does double duty, and that is the tension to tune. It is both
//     the cross-fade duration AND the wheel gate: the library holds
//     `isSliding` for the whole transition and `useWheel` drops every event
//     while it is true. Too long and consecutive wheel steps get eaten (the
//     old 2000ms felt broken); too short and the fade looks abrupt.
//
//     1100ms with the symmetric ease-in-out curve in the CSS below now uses
//     the full duration visually, so the gate and the visible fade end
//     together. That is the intended feel here — a dissolve you can watch
//     finish — and it is why the curve is NOT front-loaded: opacity has no
//     momentum to imply, so an aggressive ease just reads as a snap. If
//     consecutive scrolls ever feel eaten, lower this number rather than
//     sharpening the curve.
//
//   wrapAround stays false — index.vue's handover logic keys off "last slide"
//     to release the wheel to the page, and wrapping would never let it settle.
const config = computed(() => ({
  height: "100dvh",
  itemsToShow: 1,
  gap: 0,
  wrapAround: false,
  // Cross-fade suits full-bleed photography (and the Ken Burns zoom) far
  // better than a horizontal slide.
  slideEffect: "fade",
  transition: 1100,
  // With wrapAround:false, next() clamps at the last slide — so once we land
  // there autoplay would keep firing a no-op interval forever. Dropping it to
  // 0 stops the timer (the library treats <= 0 as "off" and re-inits on
  // change), which is right: the last slide is where the page takes over.
  autoplay: isLastSlide.value ? 0 : 6000,
  pauseAutoplayOnHover: true,
  // Raise the delta threshold above the library default of 10 so trackpad
  // micro-scrolls don't fire a slide change.
  //
  // NOTE: `throttleTime` exists in vue3-carousel's WheelConfig type but is
  // never read by useWheel() — only `threshold` is. Wheel repeat-rate is
  // actually gated by `isSliding`, i.e. by `transition` above, so that is the
  // knob that controls how quickly consecutive wheel steps are accepted.
  //
  //   On touch the wheel config is irrelevant (no wheel events fire) and the
  //   parent no longer intercepts anything — vertical swipes must scroll the
  //   page normally. Slide changes come from `touchDrag` instead.
  mouseWheel: !isTouch.value && props.wheelEnabled ? { threshold: 15 } : false,
  // Horizontal swipe navigates slides. On desktop it stays off so a click-drag
  // on a full-bleed photo doesn't feel like a broken image drag.
  touchDrag: isTouch.value,
}));

// --- Custom controls ------------------------------------------------------
// The library's <Navigation>/<Pagination> addons are styled only through
// --vc-* variables, which isn't enough for the treatment below (labelled
// counter, progress bar, hover-expanding arrows). We have v-model and the
// slide count already, so driving it directly is simpler than fighting them.
const goTo = (index) => {
  currentSlide.value = Math.min(images.length - 1, Math.max(0, index));
};

const goPrev = () => goTo(currentSlide.value - 1);
const goNext = () => goTo(currentSlide.value + 1);

const slideLabel = computed(() => String(currentSlide.value + 1).padStart(2, "0"));
const totalLabel = computed(() => String(images.length).padStart(2, "0"));
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

        <!-- Touch affordance. The arrows are hidden on phones, so without this
             nothing tells the user the hero is swipeable. Shown on the first
             slide only — once they've moved, the hint has done its job. -->
        <div v-if="isTouch && currentSlide === 0" class="swipe-hint" aria-hidden="true">
          <UIcon name="i-heroicons-chevron-double-right-20-solid" />
          <span>Swipe</span>
        </div>
      </div>
    </Slide>

    <template #addons>
      <!-- Custom control bar: counter, progress ticks, arrows. Sits above the
           scrim (z-20) and is the only interactive layer on the slide. -->
      <div class="hct-controls">
        <!-- Slide counter -->
        <div class="hct-counter">
          <span class="hct-counter__current">{{ slideLabel }}</span>
          <span class="hct-counter__rule"></span>
          <span class="hct-counter__total">{{ totalLabel }}</span>
        </div>

        <!-- Tick bar: one segment per slide, doubles as direct navigation -->
        <div class="hct-ticks">
          <button
            v-for="(slide, index) in images"
            :key="slide.id"
            type="button"
            class="hct-tick"
            :class="{
              'is-active': index === currentSlide,
              'is-past': index < currentSlide,
            }"
            :aria-label="`Go to slide ${index + 1}`"
            :aria-current="index === currentSlide ? 'true' : undefined"
            @click="goTo(index)"
          >
            <span class="hct-tick__fill"></span>
          </button>
        </div>

        <!-- Arrows -->
        <div class="hct-arrows">
          <button
            type="button"
            class="hct-arrow"
            :disabled="currentSlide === 0"
            aria-label="Previous slide"
            @click="goPrev"
          >
            <UIcon name="i-heroicons-arrow-left-20-solid" />
          </button>
          <button
            type="button"
            class="hct-arrow"
            :disabled="isLastSlide"
            aria-label="Next slide"
            @click="goNext"
          >
            <UIcon name="i-heroicons-arrow-right-20-solid" />
          </button>
        </div>
      </div>
    </template>
  </Carousel>
</template>

<style scoped>
.hct-carousel {
  width: 100%;
  height: 100dvh;
  overflow: hidden;
}

.carousel__item {
  position: relative;
  width: 100%;
  height: 100dvh;
  overflow: hidden;
  /* Required for the Ken Burns zoom to stay inside */
}

/* ============================================
   KEN BURNS (Zoom) ANIMATION
   ============================================ */
/* The zoom runs on EVERY slide continuously (see the unscoped block), not just
   the active one. Keying it to --active is what caused the visible "bounce":
   the outgoing slide lost the class mid-cross-fade, its animation was removed,
   and its transform snapped from ~scale(1.08) back to scale(1) while still
   half-visible. A continuous animation never starts or stops at transition
   time, so there is nothing left to snap. */
.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* Promote to its own layer so the scale animation and the opacity
     cross-fade don't force layout work on the same frame. */
  will-change: transform;
  backface-visibility: hidden;
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
  /* Generous side padding on phones so the copy never touches the edge, and
     bottom padding that clears the control bar sitting at the foot of the
     slide (which is taller on mobile now that it stacks). */
  padding: 6rem 1.5rem 8rem;
  pointer-events: none;
  /* Allows clicks to pass through to nav controls */
}

@media (min-width: 768px) {
  .text-overlay {
    padding: 6rem 2rem 9rem;
  }
}

/* Fluid type: clamp() lets one rule cover 320px phones through 4K without a
   ladder of breakpoints. The 6vw middle term is what keeps a long title from
   wrapping to four lines on a narrow phone. */
.overlay-title {
  font-family: serif;
  font-weight: bold;
  font-size: clamp(1.75rem, 6vw, 5rem);
  line-height: 1.15;
  color: #fff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 0.75rem;
  text-wrap: balance;
}

.overlay-desc {
  max-width: 32rem;
  font-size: clamp(0.9375rem, 2.2vw, 1.25rem);
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.4);
  font-weight: 300;
}

/* --- Swipe hint (touch only) -------------------------------------------- */
.swipe-hint {
  position: absolute;
  z-index: 16;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(4.5rem + env(safe-area-inset-bottom, 0px));
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.9rem;
  border-radius: 9999px;
  background: rgb(255 255 255 / 0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgb(255 255 255 / 0.25);
  color: rgb(255 255 255 / 0.9);
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  pointer-events: none;
  animation: hctSwipeNudge 2.4s ease-in-out infinite;
}

@keyframes hctSwipeNudge {
  0%,
  100% {
    transform: translateX(-50%);
    opacity: 0.75;
  }
  50% {
    transform: translateX(calc(-50% + 6px));
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .swipe-hint {
    animation: none;
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
/* Unscoped: vue3-carousel renders these internals outside our scope id.
   The library's nav/pagination CSS variables are gone along with the built-in
   addons; the control bar below is ours. */

/* ============================================
   CONTROL BAR
   ============================================ */
.hct-controls {
  position: absolute;
  z-index: 20;
  left: 0;
  right: 0;
  bottom: 2.25rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding-inline: max(1.5rem, calc((100% - 80rem) / 2 + 1rem));
  pointer-events: none; /* re-enabled per control below */
}

/* --- Counter --- */
.hct-counter {
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  color: #fff;
  font-variant-numeric: tabular-nums;
  text-shadow: 0 2px 12px rgb(0 0 0 / 0.4);
  flex-shrink: 0;
}

.hct-counter__current {
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1;
}

.hct-counter__rule {
  width: 1.5rem;
  height: 1px;
  background: rgb(255 255 255 / 0.5);
}

.hct-counter__total {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(255 255 255 / 0.65);
}

/* --- Tick bar --- */
/* One segment per slide. Reads as a progress bar and works as navigation,
   which the old dots couldn't convey. */
.hct-ticks {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  pointer-events: auto;
}

.hct-tick {
  flex: 1;
  height: 2px;
  min-width: 0;
  padding: 0;
  border: 0;
  background: rgb(255 255 255 / 0.25);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hct-tick:hover {
  height: 6px;
  background: rgb(255 255 255 / 0.4);
}

.hct-tick__fill {
  position: absolute;
  inset: 0;
  transform: scaleX(0);
  transform-origin: left;
  background: #e8b938;
  transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
}

/* Past slides stay filled so the bar reads as cumulative progress. */
.hct-tick.is-past .hct-tick__fill,
.hct-tick.is-active .hct-tick__fill {
  transform: scaleX(1);
}

.hct-tick.is-active {
  height: 6px;
}

/* --- Arrows --- */
.hct-arrows {
  display: flex;
  gap: 0.75rem;
  pointer-events: auto;
  flex-shrink: 0;
}

.hct-arrow {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid rgb(255 255 255 / 0.4);
  background: rgb(255 255 255 / 0.08);
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 300ms ease, border-color 300ms ease, color 300ms ease,
    transform 300ms cubic-bezier(0.22, 1, 0.36, 1), opacity 300ms ease;
}

.hct-arrow:hover:not(:disabled) {
  background: #fff;
  border-color: #fff;
  color: #142e53;
  transform: scale(1.08);
}

.hct-arrow:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Keyboard focus needs to survive the custom cursor rules. */
.hct-arrow:focus-visible,
.hct-tick:focus-visible {
  outline: 2px solid #e8b938;
  outline-offset: 3px;
}

/* --- Touch / small-screen control bar ---------------------------------- */
@media (max-width: 767px) {
  .hct-controls {
    gap: 0.875rem;
    /* env(safe-area-inset-bottom) keeps the bar off the iOS home indicator;
       it resolves to 0 everywhere else, so no separate rule is needed. */
    bottom: calc(1.25rem + env(safe-area-inset-bottom, 0px));
    padding-inline: 1.25rem;
  }

  .hct-counter__current {
    font-size: 1.125rem;
  }

  .hct-counter__rule {
    width: 1rem;
  }

  .hct-counter__total {
    font-size: 0.75rem;
  }

  /* Ticks are 2px tall — an unhittable tap target. Pad them out vertically
     with a transparent hit area while the visible bar stays thin, so tapping
     to jump slides actually works on a phone. */
  .hct-ticks {
    gap: 0.3rem;
  }

  .hct-tick {
    /* The visible rule is drawn by ::before; the button itself is a 24px tap
       target, comfortably above the 24px WCAG minimum for inline controls. */
    height: 24px;
    background: transparent;
    display: flex;
    align-items: center;
    overflow: visible;
  }

  .hct-tick::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 2px;
    background: rgb(255 255 255 / 0.25);
    transition: height 300ms cubic-bezier(0.22, 1, 0.36, 1);
  }

  .hct-tick.is-active::before {
    height: 4px;
  }

  /* The fill has to shrink to the visible rule too, or it would paint a solid
     24px block across the whole tap target. */
  .hct-tick__fill {
    top: 50%;
    bottom: auto;
    height: 2px;
    transform: translateY(-50%) scaleX(0);
  }

  .hct-tick.is-past .hct-tick__fill,
  .hct-tick.is-active .hct-tick__fill {
    transform: translateY(-50%) scaleX(1);
  }

  .hct-tick.is-active .hct-tick__fill {
    height: 4px;
  }

  /* Hover states are meaningless on touch and stick after a tap. */
  .hct-tick:hover {
    height: 24px;
    background: transparent;
  }

  /* Arrows are redundant on touch — swipe already works. */
  .hct-arrows {
    display: none;
  }
}

/* Tablets: keep the arrows but shrink them so the bar doesn't dominate. */
@media (min-width: 768px) and (max-width: 1023px) {
  .hct-controls {
    gap: 1.25rem;
    bottom: 1.75rem;
    padding-inline: 2rem;
  }

  .hct-arrow {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hct-tick,
  .hct-tick__fill,
  .hct-arrow {
    transition: none;
  }
}

.hct-carousel .carousel__viewport {
  height: 100dvh;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.hct-carousel .carousel__track {
  height: 100dvh;
  padding: 0;
  margin: 0;
}

/* width:100% (not 100vw) — 100vw includes the vertical scrollbar's width and
   is what pushes slides off-screen, producing a horizontal scrollbar. */
.hct-carousel .carousel__slide {
  height: 100dvh;
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
  height: 100dvh;
}

.hct-carousel.is-effect-fade .carousel__slide {
  grid-area: 1 / 1;
  height: 100dvh;
}

/* The library sets only a duration, so the curve is ours.
   A cross-fade is the one case where an aggressive ease is wrong: opacity has
   no momentum to imply, and easeOutExpo (the previous curve) dumped ~80% of
   the change into the first third of the duration, which reads as a snap
   followed by a long tail. This gentle symmetric ease-in-out keeps both slides
   partly visible through the middle of the transition, which is what actually
   looks like a dissolve. */
.hct-carousel.is-effect-fade .carousel__slide {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.45, 0, 0.55, 1);
}

/* Overlay copy rises in behind the fade, title first. Keyed to --active so it
   replays on every slide change instead of only on mount. */
.hct-carousel .carousel__slide--active .overlay-title,
.hct-carousel .carousel__slide--active .overlay-desc {
  animation: hctRiseIn 900ms cubic-bezier(0.22, 1, 0.36, 1) both;
}

/* Delays are tuned to the symmetric fade curve above, whose visual midpoint is
   ~550ms. The copy starts rising just past that point so it reads as arriving
   *with* the new image rather than racing ahead of it. */
.hct-carousel .carousel__slide--active .overlay-title {
  animation-delay: 400ms;
}

.hct-carousel .carousel__slide--active .overlay-desc {
  animation-delay: 560ms;
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

/* Ken Burns runs on EVERY slide, continuously — never keyed to --active.
   `alternate` means the zoom breathes 1 -> 1.14 -> 1 forever instead of ending
   on a `forwards` hold, so there is no terminal state to snap away from and no
   restart when a slide comes forward. The slide you are looking at is simply
   caught at whatever point in the cycle it happens to be, which is what makes
   the change read as a pure cross-fade with continuous motion behind it.

   `ease-in-out` + a 24s cycle keeps the drift slow enough that the arbitrary
   entry point is never perceptible as a jump in zoom level. */
.hct-carousel .slide-image {
  animation: hctKenBurns 24s ease-in-out infinite alternate;
}

@keyframes hctKenBurns {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.14);
  }
}

@media (prefers-reduced-motion: reduce) {
  .hct-carousel .slide-image {
    animation: none;
    transform: scale(1);
  }
}

/* The .carousel__pagination / __prev / __next rules that used to live here
   were removed with the built-in addons — those elements no longer render. */
</style>
