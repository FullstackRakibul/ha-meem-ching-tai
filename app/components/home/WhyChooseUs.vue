<template>
  <section class="py-20 bg-[#f5f5f0]">
    <UContainer>
      <!-- Section Header -->
      <div class="flex flex-col items-center mb-12 lg:mb-16 text-center">
        <!-- Gold line separator design -->
        <div class="flex items-center gap-3 mb-4 text-navy-600 text-xs font-semibold tracking-widest uppercase">
          <span class="h-4 w-px bg-[#e8b938]"></span>
          Why Choose Us
          <span class="h-4 w-px bg-[#e8b938]"></span>
        </div>
        <!-- Main Headline -->
        <h2 class="text-3xl md:text-5xl font-bold text-[#1a1a1a] leading-tight font-serif tracking-tight">
          Lead time is the industry's weakness.<br class="hidden md:block" />
          This is the answer.
        </h2>
      </div>

      <!-- Main Layout: 3 Columns (Left Cards | Center Image | Right Cards) -->
      <div class="flex flex-col lg:flex-row items-stretch justify-center gap-6 lg:gap-8">

        <!-- Left Column: Cards 01 & 02 -->
        <div class="bg-white rounded-3xl shadow-lg px-8 py-6 flex flex-col divide-y divide-gray-100 w-full lg:max-w-sm">
          <div v-for="(item, index) in cardsLeft" :key="index" class="py-6 first:pt-0 last:pb-0">
            <div class="flex items-start gap-4">
              <UIcon :name="item.icon" class="text-[#e8b938] w-8 h-8 shrink-0 mt-1" />
              <div>
                <h3 class="text-xl font-bold font-serif text-[#1a1a1a] mb-1 leading-tight">{{ item.title }}</h3>
                <p class="text-[15px] text-gray-500 leading-relaxed">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Center Column: The Hero Image -->
        <div class="w-full lg:flex-1 lg:max-w-xl flex items-center">
          <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai07.jpeg"
            alt="Ha-Meem Ching Tai Garment Manufacturing"
            class="w-full h-full object-cover rounded-3xl shadow-xl aspect-4/5 lg:aspect-auto min-h-[350px]" />
        </div>

        <!-- Right Column: Cards 03 & 04 -->
        <div class="bg-white rounded-3xl shadow-lg px-8 py-6 flex flex-col divide-y divide-gray-100 w-full lg:max-w-sm">
          <div v-for="(item, index) in cardsRight" :key="index" class="py-6 first:pt-0 last:pb-0">
            <div class="flex items-start gap-4">
              <UIcon :name="item.icon" class="text-[#e8b938] w-8 h-8 shrink-0 mt-1" />
              <div>
                <h3 class="text-xl font-bold font-serif text-[#1a1a1a] mb-1 leading-tight">{{ item.title }}</h3>
                <p class="text-[15px] text-gray-500 leading-relaxed">{{ item.text }}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </UContainer>
  </section>
</template>

<script setup>
// Data for left column (2 cards)
const cardsLeft = [
  {
    title: '01. Reducing lead time',
    text: 'Fabrics are mostly local, but imported accessories delay production and shipment. Making them at home closes the gap.',
    icon: 'i-heroicons-clock-20-solid'
  },
  {
    title: '02. Saving foreign currency',
    text: 'Lower import dependency keeps earnings inside Bangladesh and strengthens the trade balance.',
    icon: 'i-heroicons-banknotes-20-solid'
  }
]

// Data for right column (2 cards)
const cardsRight = [
  {
    title: '03. Integrated supply chain',
    text: 'One step toward a fully integrated chain — from raw material production to finished garments.',
    icon: 'i-heroicons-link-20-solid'
  },
  {
    title: '04. Export growth',
    text: 'Faster turnarounds increase buyers\' confidence in placing export orders with Bangladesh.',
    icon: 'i-heroicons-chart-bar-20-solid'
  }
]
</script>