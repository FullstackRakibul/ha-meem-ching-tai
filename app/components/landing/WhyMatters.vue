<!-- components/landing/WhyMatters.vue -->
<script setup lang="ts">
const cards = [
  {
    number: '01',
    title: 'Reducing Lead Time',
    text: 'Fabrics are mostly local, but imported accessories delay production. Making them at home closes the gap.',
  },
  {
    number: '02',
    title: 'Saving Foreign Currency',
    text: 'Lower import dependency keeps earnings inside Bangladesh, strengthening the national economy.',
  },
  {
    number: '03',
    title: 'Integrated Supply Chain',
    text: 'One step toward a fully integrated backward linkage chain — from raw fiber to finished garment accessory.',
  },
  {
    number: '04',
    title: 'Export Growth',
    text: "Faster turnarounds increase buyers' confidence in placing export orders with Bangladesh.",
  },
]
</script>

<template>
  <section id="why-matters" class="why-matters" data-reveal>
    <div class="why-matters__header">
      <p class="why-matters__eyebrow">Why It Matters</p>
      <h2 class="why-matters__headline">
        Lead time is the industry's weakness. This is the answer.
      </h2>
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
