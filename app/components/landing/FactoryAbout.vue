<!-- components/landing/FactoryAbout.vue -->
<script setup lang="ts">
const { t } = useLocale()
</script>

<template>
  <section id="factory" class="factory-about" data-reveal>
    <div class="factory-about__image">
      <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai03.jpeg"
        alt="HCTPAL factory interior with modern machinery" />
    </div>

    <div class="factory-about__content">
      <p class="factory-about__eyebrow">{{ t('factoryEyebrow') }}</p>
      <h2 class="factory-about__title">{{ t('factoryTitle') }}</h2>

      <div class="factory-point">
        <span class="factory-point__number">No. 01</span>
        <div>
          <p class="factory-point__title">{{ t('factory1Title') }}</p>
          <p class="factory-point__text">{{ t('factory1Text') }}</p>
        </div>
      </div>

      <div class="factory-point">
        <span class="factory-point__number">No. 02</span>
        <div>
          <p class="factory-point__title">{{ t('factory2Title') }}</p>
          <p class="factory-point__text">{{ t('factory2Text') }}</p>
        </div>
      </div>

      <div class="factory-point">
        <span class="factory-point__number">No. 03</span>
        <div>
          <p class="factory-point__title">{{ t('factory3Title') }}</p>
          <p class="factory-point__text">
            Output meets Ha-Meem Group's own factories and ships internationally,
            competing with established markets like Japan and China.
          </p>
        </div>
      </div>

      <div class="factory-quote">
        <p class="factory-quote__text">
          "The project initially started with sizing and weaving… The next phase aims to take
          production to approximately 2 million yards per month."
        </p>
        <p class="factory-quote__author">— Muhammad Amin, CEO of Ha-Meem Group</p>
      </div>
    </div>
  </section>
</template>