<!-- components/landing/SustainabilityCTA.vue -->
<script setup lang="ts">
const { t } = useLocale()

const stats = computed(() => [
  {
    id: 'solar',
    value: t('sustainStat1Value'),
    label: t('sustainStat1Label'),
    desc: t('sustainStat1Desc'),
  },
  {
    id: 'water',
    value: t('sustainStat2Value'),
    label: t('sustainStat2Label'),
    desc: t('sustainStat2Desc'),
  },
])
</script>

<template>
  <section id="sustainability" class="sustainability-cta" data-reveal>
    <div class="sustainability-cta__header">
      <p class="sustainability-cta__eyebrow">{{ t('sustainEyebrow') }}</p>
      <h2 class="sustainability-cta__headline">{{ t('sustainHeadline') }}</h2>
    </div>

    <div class="sustainability-cta__stats">
      <article v-for="stat in stats" :key="stat.id" class="sustainability-stat">
        <p class="sustainability-stat__value">{{ stat.value }}</p>
        <p class="sustainability-stat__label">{{ stat.label }}</p>
        <p class="sustainability-stat__desc">{{ stat.desc }}</p>
      </article>
    </div>

    <a class="tiny-link" href="#contact">
      <span>{{ t('sustainCta') }}</span>
      <i>
        <svg width="12" height="12" viewBox="0 0 20 20">
          <path d="M3 10h13M11 5l5 5-5 5" />
        </svg>
      </i>
    </a>
  </section>
</template>
