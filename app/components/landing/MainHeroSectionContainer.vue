<!-- components/landing/MainHeroSectionContainer.vue -->
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

    <!-- Rotating product line, sat under the wordmark -->
    <div class="catalog-hero__lines" aria-live="off">
      <span
        v-for="(line, index) in productLines"
        :key="line"
        :class="['catalog-hero__line', { 'is-active': index === lineIndex }]"
        aria-hidden="true"
      >
        {{ line }}
      </span>
      <span class="sr-only">{{ productLines.join(", ") }}</span>
    </div>

    <div class="catalog-hero__left">
      <p>
        Garment construction components, made in Bangladesh. Pocketing, interlining,
        lining and waistband — in commercial production at Narsingdi.
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
      <h2>Ha-Meem . Ching Tai</h2>
    </div>

    <div class="hero-object" data-parallax="0.06">
      <p>Six Decades of Componentry</p>
      <span>Ching Tai, Hong Kong — established 1965</span>
      <div>
        <!-- TODO(confirm: replace with a real HCTPAL asset — Unsplash placeholder) -->
        <img
          src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai51.jpeg"
          alt="Close-up of greige pocketing fabric on the loom"
        />
      </div>
    </div>

    <div class="catalog-hero__footer">
      <!-- TODO(confirm: exact plant address — sources say Narsingdi; "Ghorashal" unconfirmed) -->
      <span>Narsingdi · Bangladesh</span>
      <span>Pocketing &amp; Accessories Division</span>
    </div>

    <a class="catalog-hero__scroll" href="#collections" aria-label="Scroll to products">
      <span class="catalog-hero__scroll-line" aria-hidden="true" />
      <span class="catalog-hero__scroll-text">Scroll</span>
    </a>
  </section>
</template>

<style scoped>
/* ─── Hero Section Base Styles ─── */
/*
  Full-bleed from the viewport's top edge: the header floats over the image,
  so no margin-top. Top-anchored content is offset by var(--header) instead.
*/
.catalog-hero {
  position: relative;
  height: 100svh;
  min-height: 560px;
  overflow: hidden;
  background: var(--wood-tan);
  color: var(--paper);
}

.catalog-hero__image,
.catalog-hero__veil {
  position: absolute;
  inset: 0;
}

.catalog-hero__image {
  opacity: 0;
  scale: 1.35;
  transition: opacity 0.8s var(--ease), scale 1.25s var(--ease);
}

.catalog-hero__veil {
  opacity: 0;
  transition: opacity 0.75s var(--ease) 0.08s;
  background: linear-gradient(0deg, rgba(2, 65, 2, 0.955), transparent 48%),
    linear-gradient(90deg, rgb(15 27 28 / 0.42), transparent 42%);
}

.catalog-hero--ready .catalog-hero__image {
  opacity: 1;
  scale: 1;
}

.catalog-hero--ready .catalog-hero__veil {
  opacity: 1;
}

.catalog-hero__image img {
  object-fit: cover;
  object-position: center 68%;
  will-change: transform;
  width: 100%;
  height: 100%;
}

.catalog-hero__word {
  position: absolute;
  top: calc(var(--header) + clamp(40px, 6vw, 120px));
  left: 50%;
  z-index: 2;
  display: flex;
  width: calc(100% - clamp(32px, 3vw, 64px));
  justify-content: space-between;
  font-size: clamp(4rem, 12vw, 11rem);
  font-weight: 700;
  letter-spacing: -0.105em;
  line-height: 0.78;
  white-space: nowrap;
  transform: translateX(-50%);
  will-change: transform;
}

.catalog-hero__word span {
  display: inline-block;
  opacity: 0;
  transform: translateY(95%);
}

.catalog-hero--ready .catalog-hero__word span {
  animation: hero-letter 0.9s var(--ease) forwards;
  animation-delay: calc(0.18s + var(--letter) * 0.05s);
}

@keyframes hero-letter {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.catalog-hero__left,
.catalog-hero__statement,
.catalog-hero__footer,
.hero-object {
  opacity: 0;
}

.catalog-hero--ready .catalog-hero__left {
  animation: hero-content-in 0.65s 0.48s var(--ease) forwards;
}

.catalog-hero--ready .catalog-hero__statement {
  animation: hero-content-in 0.7s 0.58s var(--ease) forwards;
}

.catalog-hero--ready .hero-object {
  animation: hero-content-in 0.7s 0.68s var(--ease) forwards;
}

.catalog-hero--ready .catalog-hero__footer {
  animation: hero-content-in 0.55s 0.82s var(--ease) forwards;
}

@keyframes hero-content-in {
  from {
    opacity: 0;
    translate: 0 18px;
  }

  to {
    opacity: 1;
    translate: 0 0;
  }
}

.catalog-hero__left {
  position: absolute;
  bottom: clamp(76px, 13vh, 145px);
  left: max(12px, 1.1vw);
  z-index: 3;
  width: min(250px, 20vw);
}

.catalog-hero__left > p {
  max-width: 280px;
  margin-bottom: 22px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: -0.025em;
  line-height: 1.42;
  text-transform: uppercase;
}

.catalog-hero__statement {
  position: absolute;
  bottom: clamp(72px, 11vh, 125px);
  left: 50%;
  z-index: 3;
  text-align: center;
  transform: translateX(-50%);
}

.catalog-hero__statement > p {
  margin-bottom: 8px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.catalog-hero__statement h2 {
  font-size: clamp(26px, 3.8vw, 68px);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.87;
  text-transform: uppercase;
  font-family: var(--font-serif);
}

.hero-object {
  position: absolute;
  right: clamp(7vw, 11vw, 220px);
  bottom: clamp(38px, 7vh, 78px);
  z-index: 4;
  width: clamp(210px, 17vw, 290px);
  padding: clamp(18px, 1.6vw, 24px);
  border: 1px solid rgba(245, 242, 235, 0.18);
  background: rgba(15, 43, 44, 0.62);
  color: var(--paper);
  backdrop-filter: blur(10px);
  will-change: transform;
}

.hero-object > p,
.hero-object > span {
  display: block;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.13em;
  line-height: 1.35;
  text-transform: uppercase;
}

.hero-object > div {
  position: relative;
  aspect-ratio: 1.22;
  margin-block: clamp(16px, 1.8vw, 24px);
  border-block: 1px solid rgb(245, 242, 235);
  background: #d9c9bf;
}

.hero-object img {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.catalog-hero__footer {
  position: absolute;
  right: max(12px, 1.1vw);
  bottom: 13px;
  left: max(12px, 1.1vw);
  z-index: 3;
  display: flex;
  justify-content: space-between;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* ─── Screen Reader Only & Lines ─── */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.catalog-hero__lines {
  position: absolute;
  top: calc(var(--header) + clamp(120px, 17vw, 300px));
  left: max(12px, 1.1vw);
  z-index: 3;
  display: grid;
  height: 1.4em;
  font-size: clamp(0.75rem, 1.15vw, 0.95rem);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  opacity: 0;
}

.catalog-hero--ready .catalog-hero__lines {
  animation: hero-content-in 0.7s 0.74s var(--ease) forwards;
}

.catalog-hero__line {
  grid-area: 1 / 1;
  opacity: 0;
  transform: translateY(0.5em);
  transition: opacity 0.6s var(--ease), transform 0.6s var(--ease);
}

.catalog-hero__line.is-active {
  opacity: 1;
  transform: translateY(0);
}

/* ─── Hero Ambient Motion ─── */
.catalog-hero--ready .catalog-hero__image img {
  animation: hero-drift 26s ease-in-out infinite alternate;
}

@keyframes hero-drift {
  from {
    transform: scale(1.04) translate3d(0, 0, 0);
  }

  to {
    transform: scale(1.11) translate3d(-1.2%, -1.6%, 0);
  }
}

.catalog-hero__scroll {
  position: absolute;
  right: max(12px, 1.1vw);
  bottom: clamp(52px, 8vh, 96px);
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
}

.catalog-hero--ready .catalog-hero__scroll {
  animation: hero-content-in 0.6s 0.95s var(--ease) forwards;
}

.catalog-hero__scroll-line {
  position: relative;
  display: block;
  width: 1px;
  height: clamp(34px, 5vh, 54px);
  overflow: hidden;
  background: color-mix(in srgb, currentColor 25%, transparent);
}

.catalog-hero__scroll-line::after {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 40%;
  content: "";
  background: currentColor;
  animation: hero-scroll-cue 2.1s var(--ease) infinite;
}

.catalog-hero__scroll-text {
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  writing-mode: vertical-rl;
}

@keyframes hero-scroll-cue {
  0% {
    transform: translateY(-100%);
  }

  60%,
  100% {
    transform: translateY(250%);
  }
}

/* ─── Responsive Media Queries ─── */
@media (max-width: 1050px) {
  .hero-object {
    right: 5vw;
  }
}

@media (max-width: 840px) {
  .catalog-hero {
    height: 100svh;
    min-height: 620px;
  }

  .catalog-hero__word {
    top: calc(var(--header) + 32px);
    left: 8px;
    width: max-content;
    font-size: clamp(76px, 24.5vw, 104px);
    letter-spacing: -0.12em;
    transform: none;
  }

  .catalog-hero__left {
    bottom: 108px;
    left: 12px;
    width: 210px;
  }

  .catalog-hero__statement {
    right: 12px;
    bottom: 55px;
    left: auto;
    text-align: right;
    transform: none;
  }

  .catalog-hero__statement h2 {
    font-size: clamp(28px, 8vw, 38px);
  }

  .hero-object {
    right: 18px;
    bottom: 178px;
    width: 200px;
    padding: 16px;
  }
}

@media (max-width: 560px) {
  .catalog-hero__word {
    top: calc(var(--header) + 24px);
    width: calc(100% - 14px);
    font-size: min(15.8vw, 78px);
  }
}

@media (max-width: 480px) {
  .catalog-hero {
    display: flex;
    height: auto;
    min-height: 860px;
    flex-direction: column;
    justify-content: flex-end;
    padding: calc(var(--header) + 142px) 16px 18px;
  }

  .catalog-hero__word {
    top: calc(var(--header) + 24px);
    left: 16px;
    width: calc(100% - 32px);
    font-size: clamp(60px, 18vw, 78px);
    transform: none !important;
  }

  .catalog-hero__left,
  .catalog-hero__statement,
  .catalog-hero__footer,
  .hero-object {
    position: relative;
    right: auto;
    bottom: auto;
    left: auto;
    transform: none !important;
  }

  .catalog-hero__left {
    order: 1;
    width: min(100%, 300px);
  }

  .catalog-hero__statement {
    order: 2;
    align-self: flex-start;
    margin-top: 40px;
    text-align: left;
  }

  .catalog-hero__footer {
    order: 3;
    width: 100%;
    margin-top: 24px;
  }

  .hero-object {
    order: 4;
    align-self: flex-start;
    width: min(100%, 300px);
    margin-top: 34px;
    padding: 18px;
  }
}

/* Accessibility / Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .catalog-hero--ready .catalog-hero__image img,
  .catalog-hero__scroll-line::after {
    animation: none !important;
  }

  .catalog-hero__image img {
    transform: scale(1.04);
  }

  .catalog-hero__scroll-line::after {
    transform: translateY(0);
  }
}
</style>
