<!-- components/landing/WhyMatters.vue -->
<script setup lang="ts">
const { t } = useLocale()

// Numbers stay literal (they are not language-dependent); copy comes from
// the locale store so the whole card set switches with the site.
const cards = computed(() => [
  { number: '01', title: t('why1Title'), text: t('why1Text') },
  { number: '02', title: t('why2Title'), text: t('why2Text') },
  { number: '03', title: t('why3Title'), text: t('why3Text') },
  { number: '04', title: t('why4Title'), text: t('why4Text') },
])
</script>

<template>
  <section id="why-matters" class="why-matters" data-reveal>
    <div class="why-matters__header">
      <p class="why-matters__eyebrow">{{ t('whyEyebrow') }}</p>
      <h2 class="why-matters__headline">{{ t('whyHeadline') }}</h2>
    </div>

    <div class="why-matters__track">
      <article
        v-for="card in cards"
        :key="card.number"
        class="why-card"
      >
        <p class="why-card__number">{{ card.number }}</p>
        <h3 class="why-card__title">{{ card.title }}</h3>
        <p class="why-card__text">{{ card.text }}</p>
      </article>
    </div>
  </section>
</template>
