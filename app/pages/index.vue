<template>
  <div>
    <!-- Sticky full-screen carousel stage. This page is `fullBleed` (see
         definePageMeta), so the layout applies no width constraint or top padding
         and the slides genuinely reach the screen edges. -->
    <div ref="stageRef" class="sticky top-0 z-0 w-full h-screen overflow-hidden">
      <MouseWheelCarousel
        :wheel-enabled="wheelEnabled"
        @slide-change="onSlideChange"
        @total-slides="onTotalSlides"
      />
    </div>
    <!-- Site content: sits above the sticky carousel and slides up over it.
         Full-width so its background fully occludes the carousel underneath. -->
    <div ref="contentRef" class="relative z-10 bg-gray-50">
      <!-- Company Description -->
      <div class="relative z-10 bg-[#f5f5f0] min-h-screen">
        <div class="space-y-12">
          <CompanyDescription />
          <WhyChooseUs />
        </div>
      </div>


      <div class="max-w-7xl mx-auto px-4 space-y-12 py-12">
      <!-- Hero Section -->
      <section class="py-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 class="text-5xl font-bold text-gray-900 mb-6">
              Welcome to Ha-Meem Ching Tai
            </h1>
            <p class="text-xl text-gray-600 mb-8">
              A global garment accessories manufacturing brand, crafting quality pocketing, interlinings, and
              trims for the world's leading apparel makers.
            </p>
            <div class="flex gap-4">
              <UButton size="lg" color="purple">Get Started</UButton>
              <UButton size="lg" color="gray" variant="outline">Learn More</UButton>
            </div>
          </div>
          <div class="bg-linear-to-br from-purple-100 to-purple-200 rounded-lg h-96 flex items-center justify-center">
            <UIcon name="i-heroicons-bolt-solid" class="text-purple-600 text-9xl" />
          </div>
        </div>
      </section>

      <!-- Features Section -->
      <section class="py-12">
        <h2 class="text-4xl font-bold text-gray-900 mb-12 text-center">Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <UIcon name="i-heroicons-bolt-solid" class="text-purple-600 text-3xl mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
            <p class="text-gray-600">
              Optimized performance with Nuxt 4 and Tailwind CSS for blazing fast page loads.
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <UIcon name="i-heroicons-shield-check-solid" class="text-purple-600 text-3xl mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Secure &amp; Reliable</h3>
            <p class="text-gray-600">
              Built with security best practices and proven technologies from the Vue ecosystem.
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
            <UIcon name="i-heroicons-sparkles-solid" class="text-purple-600 text-3xl mb-4" />
            <h3 class="text-xl font-semibold text-gray-900 mb-3">Modern Design</h3>
            <p class="text-gray-600">
              Beautiful components and layouts crafted with Nuxt UI and Tailwind CSS.
            </p>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="py-12 bg-linear-to-r from-purple-600 to-purple-800 rounded-lg text-white text-center">
        <h2 class="text-4xl font-bold mb-6">Ready to partner with us?</h2>
        <p class="text-lg mb-8 text-purple-100">Get in touch with Ha-Meem Ching Tai today.</p>
        <UButton color="white" size="lg">Contact Us</UButton>
      </section>
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
