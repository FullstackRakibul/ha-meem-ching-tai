<!-- components/landing/HeroSection.vue -->
<script setup lang="ts">
const { t } = useLocale()
import { onMounted, ref } from 'vue'

const ready = ref(false)

onMounted(() => {
  setTimeout(() => {
    ready.value = true
  }, 100)
})
</script>

<template>
  <section id="top" :class="['catalog-hero', { 'catalog-hero--ready': ready }]">
    <div class="catalog-hero__image" data-hero-image>
      <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai31.jpeg"
        alt="Precision engineering — HCTPAL manufacturing floor" />
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
      <p>{{ t('heroLede') }}</p>
      <a class="tiny-link" href="#collections">
        <span>{{ t('heroCta') }}</span>
        <i>
          <svg width="12" height="12" viewBox="0 0 20 20">
            <path d="M3 10h13M11 5l5 5-5 5" />
          </svg>
        </i>
      </a>
    </div>

    <div class="catalog-hero__statement">
      <p>{{ t('heroStatementLabel') }}</p>
      <h2>{{ t('heroStatementTitle') }}</h2>
    </div>

    <div class="hero-object" data-parallax="0.06">
      <p>Integrated Supply Chain</p>
      <span>From raw materials to finished trims</span>
      <div>
        <img src="https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=600"
          alt="Fabric weave close-up" />
      </div>
    </div>

    <div class="catalog-hero__footer">
      <span>Ghorashal, Narsingdi · Bangladesh</span>
      <span>Pocketing & Accessories Division</span>
    </div>
  </section>
</template>