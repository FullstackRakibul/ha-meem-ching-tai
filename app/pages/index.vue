<template>
  <div>
    <!-- Sticky full-screen carousel stage. This page is `fullBleed` (see
         definePageMeta), so the layout applies no width constraint or top padding
         and the slides genuinely reach the screen edges. -->
    <!-- data-lenis-prevent: the stage runs its own wheel arbitration below
         (carousel navigation + handover to the page). Lenis must not consume
         those events or preventDefault() here would have nothing to cancel. -->
    <!-- On touch the stage is a PLAIN block, not sticky, and carries no
         `data-lenis-prevent`: there are no wheel events to arbitrate, so the
         desktop handover has nothing to do, and keeping the stage pinned only
         traps the user on the hero with no way to reach the content. A normal
         100dvh block simply scrolls away under a swipe. -->
    <div
      ref="stageRef"
      :data-lenis-prevent="isTouch ? undefined : ''"
      class="w-full overflow-hidden"
      :class="isTouch ? 'relative z-0 h-[100dvh]' : 'sticky top-0 z-0 h-screen'"
    >
      <MouseWheelCarousel :wheel-enabled="wheelEnabled" @slide-change="onSlideChange" @total-slides="onTotalSlides" />
    </div>
    <!-- Site content: sits above the sticky carousel and slides up over it.
         Full-width so its background fully occludes the carousel underneath. -->
    <div ref="contentRef" class="relative z-10 bg-gray-50">
      <!-- Company Description -->
      <div class="relative z-10 bg-[#f5f5f0] min-h-screen">
        <div class="">
          <CompanyDescription />
          <WhyChooseUs />
          <IntroVideoBanner />
          <OurAdvantageCarousel />
          <VentureAtAGlance />
          <InteractiveHeroShowcase />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWindowScroll, useDebounceFn, useEventListener } from '@vueuse/core'
import CompanyDescription from '~/components/home/CompanyDescription.vue'

// Opt out of the layout's width constraint + fixed-header top padding so the
// carousel can occupy the full viewport.
definePageMeta({ fullBleed: true })

// Keep in sync with `mouseWheel.threshold` in MouseWheelCarousel.vue.
const WHEEL_THRESHOLD = 15

const stageRef = ref(null)
const contentRef = ref(null)

// Coarse pointer = phone/tablet. Everything below (sticky pin, wheel
// arbitration, Lenis exclusion) is desktop-only behaviour; on touch the hero
// is an ordinary full-height block and the browser's own scrolling handles it.
// Starts false so SSR renders the desktop markup and corrects on mount.
const isTouch = ref(false)

onMounted(() => {
  const mq = window.matchMedia('(hover: none) and (pointer: coarse)')
  isTouch.value = mq.matches
  const onChange = (e) => (isTouch.value = e.matches)
  mq.addEventListener('change', onChange)
  onBeforeUnmount(() => mq.removeEventListener('change', onChange))
})

const currentSlide = ref(0)
const totalSlides = ref(0)
const isDrifting = ref(false)

const { y } = useWindowScroll()

const onTotalSlides = (count) => (totalSlides.value = count)
const onSlideChange = (index) => (currentSlide.value = index)

const isLastSlide = computed(
  () => totalSlides.value > 0 && currentSlide.value >= totalSlides.value - 1,
)

// The carousel's own wheel handling stays enabled at all times so it can always
// navigate both forwards and backwards. Only the drift animation suppresses it,
// to stop slides changing mid-handover.
const wheelEnabled = computed(() => !isDrifting.value)

// Gentle, eased drift from the last slide into the content section.
let driftTimer = null

const DRIFT_DURATION = 1.6 // seconds

const driftToContent = () => {
  if (isDrifting.value || !contentRef.value) return
  isDrifting.value = true

  const target = contentRef.value.getBoundingClientRect().top + window.scrollY

  // Route the handover through Lenis. Lenis owns window.scrollY while it's
  // running, so a native scrollTo({behavior:'smooth'}) would be fighting it
  // frame-for-frame and visibly stutter. Falls back to native when Lenis is
  // absent (reduced-motion, or before the plugin has initialised).
  const { $lenis } = useNuxtApp()

  if ($lenis) {
    $lenis.scrollTo(target, {
      duration: DRIFT_DURATION,
      easing: (t) => 1 - Math.pow(1 - t, 3), // ease-out cubic
    })
  } else {
    window.scrollTo({ top: target, behavior: 'smooth' })
  }

  clearTimeout(driftTimer)
  driftTimer = setTimeout(() => {
    isDrifting.value = false
  }, DRIFT_DURATION * 1000 + 100)
}

onBeforeUnmount(() => clearTimeout(driftTimer))

const debouncedDrift = useDebounceFn(driftToContent, 60)

// Wheel arbitration on the sticky stage.
//
//   down + last slide  -> take over, drift into the page content
//   up   + last slide  -> let the carousel step backwards (do NOT unlock)
//   any other slide    -> let the carousel navigate natively, both directions
//
// The listener is non-passive so preventDefault() is honoured.
useEventListener(
  stageRef,
  'wheel',
  (event) => {
    // Touch devices never reach the handover logic — the stage isn't pinned
    // there, so there is nothing to hand over from. (Some touch laptops do
    // emit wheel events; this keeps them on the plain-scroll path to match
    // the non-sticky layout they were served.)
    if (isTouch.value) return

    // Already scrolled into the content: the page owns the wheel. Scrolling back
    // up to the stage hands control to the carousel again on the next event.
    if (y.value > window.innerHeight * 0.9) return

    // While drifting, swallow input so it doesn't fight the animation.
    if (isDrifting.value) {
      event.preventDefault()
      return
    }

    // Match the carousel's own wheel threshold (mouseWheel.threshold in
    // MouseWheelCarousel). Below it the library ignores the event entirely, so
    // treating it as a real scroll here would drift the page on a stray
    // trackpad twitch that never moved the carousel.
    if (Math.abs(event.deltaY) <= WHEEL_THRESHOLD) return

    const scrollingDown = event.deltaY > 0

    if (isLastSlide.value && scrollingDown) {
      event.preventDefault()
      debouncedDrift()
      return
    }

    // Every other case (including up-scroll on the last slide) falls through
    // untouched so vue3-carousel handles the slide change itself.
  },
  { passive: false },
)
</script>