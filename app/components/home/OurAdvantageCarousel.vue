<script setup>
import { Carousel, Slide } from 'vue3-carousel'
import 'vue3-carousel/carousel.css'

const carouselRef = ref(null)

// 4 Data items to match your screenshot
const advantageItems = [
  {
    id: 1,
    title: 'Unmatched Quality Control',
    description: 'We lead the industry with rigorous quality checks at every stage of production, ensuring zero defects for global apparel clients.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg',
  },
  {
    id: 2,
    title: 'Eco-Friendly Practices',
    description: 'Committed to sustainable manufacturing with advanced waste-management, low-emission technology, and ethical local sourcing.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg',
  },
  {
    id: 3,
    title: 'Innovative Fabric Solutions',
    description: 'State-of-the-art machinery allows for creative, complex textile patterns, seamless integration, and rapid scaling capabilities.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg',
  },
  {
    id: 4,
    title: 'Skilled Workforce Expertise',
    description: 'Our team of skilled engineers and technicians bring decades of hands-on experience and proprietary knowledge to every order.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai14.jpeg',
  }
]

// Carousel Configuration.
// gap: 0 at every breakpoint — the design is one continuous band, and any
// gap would break it into separate cards. Separation is the 1px divider
// drawn on each slide's left edge (see the style block).
const config = {
  itemsToShow: 1,
  transition: 600,
  wrapAround: true, // Infinite loop
  gap: 0,
  breakpoints: {
    768: {
      itemsToShow: 2,
      gap: 0,
    },
    1024: {
      itemsToShow: 4,
      gap: 0,
    },
  },
  
}

// Pause/resume on hover. Guarded with optional calls: the Autoplay plugin
// is not registered above, so these methods are absent — without the guard
// every mouseenter would throw.
const pauseAutoplay = () => {
  carouselRef.value?.pauseAutoplay?.()
}
const resumeAutoplay = () => {
  carouselRef.value?.playAutoplay?.()
}
</script>

<template>
  <section class="bg-white">
    <!-- Header sits on a tinted band; the card band below is white and runs
         full-bleed, so the columns read as one continuous strip divided by
         hairlines rather than as separate floating cards. -->
    <div class="bg-navy-50 py-16 md:py-20">
      <UContainer>
        <div class="text-center relative">
          <UBadge label="OUR ADVANTAGE" color="neutral" variant="soft"
            class="border border-gray-200 bg-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-5" />
          <h2 class="text-3xl md:text-5xl font-bold text-primary leading-[1.15] tracking-tight">
            Why We Stand Out in the<br class="hidden md:block" />
            Texora Industry
          </h2>
        </div>
      </UContainer>
    </div>

    <!-- Carousel Wrapper (Handles mouse enter/leave to pause/resume autoplay) -->
    <div class="w-full border-y border-gray-200" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
      <Carousel ref="carouselRef" v-bind="config" class="advantage-carousel">
        <Slide v-for="item in advantageItems" :key="item.id">
          <!-- Hairline on the left edge forms the column divider -->
          <article class="advantage-card group h-full w-full bg-white flex flex-col text-left">

            <div class="px-7 pt-8 pb-6 flex flex-col grow">
              <!-- Title — held to two lines so every column aligns -->
              <h3 class="font-bold text-xl text-primary mb-6 leading-snug min-h-14">
                {{ item.title }}
              </h3>

              <!-- Image with Animation -->
              <div class="overflow-hidden rounded-lg mb-6 aspect-4/3 relative">
                <img :src="item.image" alt="HCTPAL Manufacturing" loading="lazy"
                  class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105" />
              </div>

              <!-- Description -->
              <p class="text-sm text-gray-500 leading-relaxed grow">
                {{ item.description }}
              </p>
            </div>

            <!-- Footer bar: full-width rule, icon boxed off in its own cell -->
            <div class="flex items-stretch border-t border-gray-200 mt-auto">
              <a href="#"
                class="grow flex items-center gap-2 px-7 py-5 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-secondary transition-colors">
                Read More
                <UIcon name="i-heroicons-arrow-right-20-solid" class="text-sm" />
              </a>
              <div class="flex items-center justify-center px-6 border-l border-gray-200 text-gray-400
                          group-hover:text-secondary transition-colors">
                <UIcon name="i-heroicons-square-3-stack-3d" class="text-xl" />
              </div>
            </div>
          </article>
        </Slide>
      </Carousel>
    </div>
  </section>
</template>

<style>
/* Unscoped: vue3-carousel renders these internals outside our scope id.
   The design is a single continuous band, so slides carry NO gap, radius
   or shadow — separation comes from a 1px divider on each slide's left
   edge, which is why `gap: 0` is set in the carousel config. */
.advantage-carousel .carousel__slide {
  padding: 0;
  display: flex;
  align-items: stretch;
  height: auto; /* Stretch cards to equal height */
}

.advantage-carousel .carousel__track {
  align-items: stretch;
}

/* Column divider hairlines. Using a pseudo-element rather than
   border-left avoids the doubled line where two slides meet and keeps
   the divider full-bleed to the band's top and bottom edges. */
.advantage-carousel .advantage-card {
  position: relative;
}

.advantage-carousel .advantage-card::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background-color: var(--color-gray-200, #e5e7eb);
}

/* Subtle lift on hover — the band stays flat, only the tint changes. */
.advantage-carousel .advantage-card {
  transition: background-color 0.3s ease;
}

.advantage-carousel .advantage-card:hover {
  background-color: #fafbfd;
}
</style>