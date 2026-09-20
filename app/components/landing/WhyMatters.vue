<!-- components/landing/WhyMatters.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

// Process content
const cards = [
  {
    number: "01",
    title: "Reducing Lead Time",
    text:
      "Fabrics are mostly local, but imported accessories delay production. Making them at home closes the gap.",
  },
  {
    number: "02",
    title: "Saving Foreign Currency",
    text:
      "Lower import dependency keeps earnings inside Bangladesh, strengthening the national economy.",
  },
  {
    number: "03",
    title: "Integrated Supply Chain",
    text:
      "One step toward a fully integrated backward linkage chain — from raw fiber to finished garment accessory.",
  },
  {
    number: "04",
    title: "Export Growth",
    text:
      "Faster turnarounds increase buyers' confidence in placing export orders with Bangladesh.",
  },
];

// Intersection Observer for fast-loading scroll animations
const sectionRef = ref<HTMLElement | null>(null);
const isVisible = ref(false);
let observer: IntersectionObserver;

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting) {
        isVisible.value = true;
        observer.disconnect(); // Only animate once
      }
    },
    { threshold: 0.15 } // Triggers when 15% of section is visible
  );

  if (sectionRef.value) {
    observer.observe(sectionRef.value);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<template>
  <!--
    Theme mapped:
    var(--warm-ivory) -> bg-[#F5F2EB]
    var(--rust) -> text-[#C25934]
  -->
  <section id="why-matters" ref="sectionRef" class="relative overflow-hidden bg-[#F5F2EB] py-20 md:py-28 lg:py-40">
    <!-- Header Reveal -->
    <div class="mb-12 px-4 sm:mb-16 lg:mb-20 lg:px-10 transition-all duration-1000 ease-out transform"
      :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'">
      <p class="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#C25934] mb-4">
        Why It Matters
      </p>
      <!-- Assuming generic serif font, apply your var(--font-serif) via Tailwind config -->
      <h2
        class="font-serif text-[clamp(28px,4vw,64px)] font-normal tracking-[-0.04em] leading-none text-gray-900 max-w-225">
        Lead time is the industry's weakness. <br class="hidden md:block" />This is the
        answer.
      </h2>
    </div>

    <!-- Scroll Track with 'group' for the hover-defocus effect -->
    <div class="group flex gap-1 px-4 lg:px-10 overflow-x-auto snap-x snap-mandatory scrollbar-none pb-8"
      style="-ms-overflow-style: none; scrollbar-width: none">
      <article v-for="(card, index) in cards" :key="card.number"
        class="group/card relative flex-[0_0_clamp(280px,28vw,420px)] snap-start p-[clamp(28px,3vw,48px)] border border-gray-300/50 bg-black/2 transition-all duration-500 ease-out hover:-translate-y-2 hover:border-transparent group-hover:opacity-50 hover:opacity-100! cursor-pointer overflow-hidden transform"
        :class="isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'"
        :style="{ transitionDelay: `${isVisible ? index * 150 : 0}ms` }">
        <!-- Animated gradient border (draws in on hover) -->
        <span aria-hidden="true"
          class="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/card:opacity-100 motion-reduce:transition-none"
          style="
            padding: 1px;
            background: linear-gradient(120deg, transparent, #c25934, transparent);
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask-composite: exclude;
          "></span>

        <!-- Hover glow that eases in from the corner -->
        <div aria-hidden="true"
          class="pointer-events-none absolute -inset-px -z-10 opacity-0 transition-opacity duration-700 ease-out group-hover/card:opacity-100 motion-reduce:transition-none"
          style="
            background: radial-gradient(
              120% 120% at 100% 0%,
              rgba(194, 89, 52, 0.1),
              transparent 60%
            );
          "></div>

        <!-- Background decorative process line -->
        <div
          class="absolute top-[clamp(28px,3vw,48px)] left-0 w-full h-px bg-linear-to-r from-transparent via-[#C25934]/20 to-transparent -z-10">
        </div>

        <!-- Number (Rust colored) -->
        <p class="text-[10px] font-semibold tracking-widest text-[#C25934] mb-[clamp(20px,3vw,40px)]">
          {{ card.number }}
        </p>

        <!-- Title -->
        <h3
          class="font-serif text-[clamp(22px,2.4vw,36px)] font-normal tracking-[-0.03em] leading-[1.1] text-gray-900 mb-4">
          {{ card.title }}
        </h3>

        <!-- Text -->
        <p class="text-[13px] leading-[1.55] text-gray-600/80">
          {{ card.text }}
        </p>

        <!-- Bottom accent line -->
        <div
          class="absolute bottom-0 left-0 w-full h-0.5 bg-[#C25934] scale-x-0 origin-left transition-transform duration-500 ease-out group-hover/card:scale-x-100 motion-reduce:transition-none">
        </div>
      </article>
    </div>

    <!-- Interactive Scroll Hint (Only visible on desktop) -->
    <div class="hidden lg:flex items-center gap-3 px-10 mt-8 transition-opacity duration-1000 delay-800"
      :class="isVisible ? 'opacity-100' : 'opacity-0'">
      <div class="w-12 h-px bg-gray-400"></div>
      <span class="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Drag to explore</span>
    </div>
  </section>
</template>

<style scoped>
/* Ensures the scrollbar is hidden for webkit browsers */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}
</style>