<template>
  <div>
    <!-- Sticky full-screen carousel stage. This page is `fullBleed` (see
         definePageMeta), so the layout applies no width constraint or top padding
         and the slides genuinely reach the screen edges. -->
    <div ref="stageRef" class="sticky top-0 z-0 w-full h-screen overflow-hidden">
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

const stageRef = ref(null)
const contentRef = ref(null)

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
const driftToContent = () => {
  if (isDrifting.value || !contentRef.value) return
  isDrifting.value = true

  const target = contentRef.value.getBoundingClientRect().top + window.scrollY
  window.scrollTo({ top: target, behavior: 'smooth' })

  setTimeout(() => {
    isDrifting.value = false
  }, 900)
}

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
    // Already scrolled into the content: the page owns the wheel. Scrolling back
    // up to the stage hands control to the carousel again on the next event.
    if (y.value > window.innerHeight * 0.9) return

    // While drifting, swallow input so it doesn't fight the animation.
    if (isDrifting.value) {
      event.preventDefault()
      return
    }

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