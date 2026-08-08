<script setup>
import { Carousel, Slide } from "vue3-carousel";
import "vue3-carousel/carousel.css";

const carouselRef = ref(null);

// 4 Data items to match your screenshot
const advantageItems = [
  {
    id: 1,
    title: "Unmatched Quality Control",
    description:
      "We lead the industry with rigorous quality checks at every stage of production, ensuring zero defects for global apparel clients.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg",
  },
  {
    id: 2,
    title: "Eco-Friendly Practices",
    description:
      "Committed to sustainable manufacturing with advanced waste-management, low-emission technology, and ethical local sourcing.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg",
  },
  {
    id: 3,
    title: "Innovative Fabric Solutions",
    description:
      "State-of-the-art machinery allows for creative, complex textile patterns, seamless integration, and rapid scaling capabilities.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg",
  },
  {
    id: 4,
    title: "Skilled Workforce Expertise",
    description:
      "Our team of skilled engineers and technicians bring decades of hands-on experience and proprietary knowledge to every order.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai14.jpeg",
  },
];

// Carousel Configuration. Each slide is now an independent glass card, so a
// real gap separates them instead of the old hairline-divider band.
const config = {
  itemsToShow: 1,
  transition: 8000,
  wrapAround: true, // Infinite loop
  gap: 24,
  breakpoints: {
    768: {
      itemsToShow: 2,
      gap: 24,
    },
    1024: {
      itemsToShow: 3,
      gap: 24,
    },
  },
  autoplay: {
    delay: 8000,
    pauseOnHover: true,
  },
};

// Pause/resume on hover. Guarded with optional calls: the Autoplay plugin
// is not registered above, so these methods are absent — without the guard
// every mouseenter would throw.
const pauseAutoplay = () => {
  carouselRef.value?.pauseAutoplay?.();
};
const resumeAutoplay = () => {
  carouselRef.value?.playAutoplay?.();
};
</script>

<template>
  <section class="relative bg-navy-50 py-16 md:py-20 overflow-hidden">
    <!-- Ambient glow blobs — same glass/navy/gold language as the header & footer -->
    <div
      class="absolute -top-24 -left-24 w-96 h-96 bg-navy-200/50 rounded-full blur-3xl pointer-events-none"
    ></div>
    <div
      class="absolute -bottom-24 -right-24 w-96 h-96 bg-[#e8b938]/20 rounded-full blur-3xl pointer-events-none"
    ></div>

    <UContainer class="relative">
      <div class="text-center mb-12 lg:mb-16">
        <UBadge
          label="OUR ADVANTAGE"
          color="primary"
          variant="soft"
          class="border border-gray-200 bg-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-5"
        />
        <h2
          class="text-3xl md:text-5xl font-bold text-primary leading-[1.15] tracking-tight"
        >
          Why We Stand Out in the<br class="hidden md:block" />
          Manufacturing Industry
        </h2>
      </div>

      <!-- Carousel Wrapper (Handles mouse enter/leave to pause/resume autoplay) -->
      <div class="w-full" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
        <Carousel ref="carouselRef" v-bind="config" class="advantage-carousel">
          <Slide v-for="item in advantageItems" :key="item.id">
            <article
              class="advantage-card group h-full w-full flex flex-col text-left rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-xs transition-all duration-500 ease-in-out hover:bg-white/90 hover:border-[#e8b938]/50 hover:-translate-y-1.5"
            >
              <div class="px-5 pt-8 pb-6 flex flex-col grow">
                <!-- Title — held to two lines so every column aligns -->
                <h3 class="font-bold text-xl text-primary mb-2 leading-snug min-h-14">
                  {{ item.title }}
                </h3>

                <!-- Image with Animation -->
                <div class="overflow-hidden rounded-xl mb-6 aspect-4/3 relative">
                  <img
                    :src="item.image"
                    alt="HCTPAL Manufacturing"
                    loading="lazy"
                    class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  />
                </div>

                <!-- Description -->
                <p class="text-sm text-gray-500 leading-relaxed grow">
                  {{ item.description }}
                </p>
              </div>

              <!-- Footer bar: full-width rule, icon boxed off in its own cell -->
              <div class="flex items-stretch border-t border-gray-200/70 mt-auto">
                <a
                  href="#"
                  class="grow flex items-center gap-2 px-5 py-5 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-[#e8b938] transition-colors"
                >
                  Read More
                  <UIcon name="i-heroicons-arrow-right-20-solid" class="text-sm" />
                </a>
                <div
                  class="flex items-center justify-center px-6 border-l border-gray-200/70 text-gray-400 group-hover:text-[#e8b938] transition-colors"
                >
                  <UIcon name="i-heroicons-square-3-stack-3d" class="text-xl" />
                </div>
              </div>
            </article>
          </Slide>
        </Carousel>
      </div>
    </UContainer>
  </section>
</template>

<style>
/* Unscoped: vue3-carousel renders these internals outside our scope id.
   Each slide now hosts an independent glass card (radius, blur, border all
   live on .advantage-card), so the track just needs to stretch slides to
   equal height and let the configured gap show between them. */
.advantage-carousel .carousel__slide {
  padding: 0;
  display: flex;
  align-items: stretch;
  height: auto;
}

.advantage-carousel .carousel__track {
  align-items: stretch;
}
</style>
