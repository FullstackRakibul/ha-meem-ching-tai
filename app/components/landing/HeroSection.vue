<!-- components/landing/HeroSection.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from "vue";

const ready = ref(false);

// The four verified product lines, cycled one at a time under the wordmark.
const productLines = [
  "Pocketing",
  "Interlining",
  "Lining / Taffeta",
  "Waistband / Elastic",
];
const lineIndex = ref(0);
let lineTimer: ReturnType<typeof setInterval> | undefined;

onMounted(() => {
  setTimeout(() => {
    ready.value = true;
  }, 100);

  // Ambient motion is opt-out: hold on the first line under reduced-motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  lineTimer = setInterval(() => {
    lineIndex.value = (lineIndex.value + 1) % productLines.length;
  }, 2600);
});

onBeforeUnmount(() => {
  clearInterval(lineTimer);
});
</script>

<template>
  <section id="top" :class="['catalog-hero', { 'catalog-hero--ready': ready }]">
    <div class="catalog-hero__image" data-hero-image>
      <img
        src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai60.jpeg"
        alt="Precision engineering — HCTPAL manufacturing floor"
      />
    </div>
    <div class="catalog-hero__veil" />

    <h1 class="catalog-hero__word" data-hero-word>
      <span style="--letter: 0">H</span>
      <span style="--letter: 1">C</span>
      <span style="--letter: 2">T</span>
      <span style="--letter: 3">P</span>
      <span style="--letter: 4">A</span>
      <span style="--letter: 5">L</span>
    </h1>

    <div class="catalog-hero__left">
      <p>
        Precision Engineering. Crafting export-quality accessories for the global apparel
        industry.
      </p>
      <a class="tiny-link" href="#collections">
        <span>Explore Catalog</span>
        <i>
          <svg width="12" height="12" viewBox="0 0 20 20">
            <path d="M3 10h13M11 5l5 5-5 5" />
          </svg>
        </i>
      </a>
    </div>

    <div class="catalog-hero__statement">
      <p>Strategic Partnership</p>
      <h2>Ha-Meem × Ching Tai</h2>
    </div>

    <div class="hero-object" data-parallax="0.06">
      <p>Integrated Supply Chain</p>
      <span>From raw yarn to finished accessories</span>
      <div>
        <!-- TODO(confirm: replace with a real HCTPAL asset — Unsplash placeholder) -->
        <img
          src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai51.jpeg"
          alt="Close-up of greige pocketing fabric on the loom"
        />
      </div>
    </div>

    <div class="catalog-hero__footer">
      <span>Ghorashal, Narsingdi · Bangladesh</span>
      <span>Pocketing & Accessories Division</span>
    </div>
  </section>
</template>
