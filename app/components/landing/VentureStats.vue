<!-- components/landing/VentureStats.vue -->
<script setup lang="ts">
const stats = [
  { value: '৳100cr', label: 'Initial Investment', desc: 'Phase one capital expenditure' },
  { value: '500K', label: 'Monthly Output (yd)', desc: 'Initial phase: sizing & weaving' },
  { value: '2M', label: 'Future Capacity (yd)', desc: 'Per month at full scale' },
  { value: '12,000', label: 'Employment Target', desc: '90% local hiring mandate' },
  { value: '$9M', label: 'Solar Investment', desc: '16.9 MW capacity across Textile Zone' },
  { value: 'Zero', label: 'Water Discharge', desc: 'Goal by 2030 with caustic recovery' },
  { value: '25%', label: 'Ching Tai Stake', desc: 'Chinese JV partner equity' },
]
</script>

<template>
  <section id="venture" class="venture-stats" data-reveal>
    <div class="venture-stats__header">
      <p class="venture-stats__eyebrow">The Venture at a Glance</p>
      <h2 class="venture-stats__headline">
        A new era in garment accessories manufacturing
      </h2>
    </div>

    <div class="venture-stats__grid">
      <article
        v-for="stat in stats"
        :key="stat.label"
        class="stat-card"
      >
        <p class="stat-card__value">{{ stat.value }}</p>
        <p class="stat-card__label">{{ stat.label }}</p>
        <p class="stat-card__desc">{{ stat.desc }}</p>
      </article>
    </div>
  </section>
</template>
