<!-- components/landing/VentureStats.vue -->
<script setup lang="ts">
const { t } = useLocale()

// Values are numerals/symbols and stay literal; labels come from the store.
const stats = computed(() => [
  { value: '৳100cr', label: t('stat1Label'), desc: t('stat1Desc') },
  { value: '500K', label: t('stat2Label'), desc: t('stat2Desc') },
  { value: '2M', label: t('stat3Label'), desc: t('stat3Desc') },
  { value: '12,000', label: t('stat4Label'), desc: t('stat4Desc') },
  { value: '$9M', label: t('stat5Label'), desc: t('stat5Desc') },
  { value: 'Zero', label: t('stat6Label'), desc: t('stat6Desc') },
  { value: '25%', label: t('stat7Label'), desc: t('stat7Desc') },
])
</script>

<template>
  <section id="venture" class="venture-stats" data-reveal>
    <div class="venture-stats__header">
      <p class="venture-stats__eyebrow">{{ t('ventureEyebrow') }}</p>
      <h2 class="venture-stats__headline">{{ t('ventureHeadline') }}</h2>
    </div>

    <div class="venture-stats__grid">
      <article v-for="stat in stats" :key="stat.label" class="stat-card">
        <p class="stat-card__value">{{ stat.value }}</p>
        <p class="stat-card__label">{{ stat.label }}</p>
        <p class="stat-card__desc">{{ stat.desc }}</p>
      </article>
    </div>
  </section>
</template>
