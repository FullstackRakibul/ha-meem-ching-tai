<template>
  <section class="py-20 bg-white">
    <UContainer>
      <!-- Section Header -->
      <div class="text-center mb-12 lg:mb-16">
        <UBadge label="THE VENTURE AT A GLANCE" color="neutral" variant="soft"
          class="border border-gray-200 bg-transparent px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4" />
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1a1a1a] leading-tight">
          Key Metrics & Milestones
        </h2>
        <p class="text-gray-500 mt-3 text-lg max-w-2xl mx-auto">
          A snapshot of our strategic partnership, output, and economic impact.
        </p>
      </div>

      <!-- 4-Card Grid (Responsive) -->
      <!-- The first card is permanently "revealed" (image + dark treatment);
           the rest reach the identical state on hover. Both are driven by a
           single `featured` flag rather than duplicated hover classes, so
           the two states can't drift apart. -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <div v-for="(stat, index) in stats" :key="index"
          class="group relative rounded-2xl p-6 lg:p-8 overflow-hidden cursor-default transition-all duration-500 ease-in-out min-h-100 min-w-72 flex flex-col"
          :class="index === 0
            ? 'bg-slate-900 shadow-xl ring-1 ring-primary/20'
            : 'bg-slate-100 shadow-sm hover:shadow-xl'">

          <!-- Background Image — always visible on card 1, fades in on hover for the rest -->
          <img :src="stat.image" alt="" loading="lazy"
            class="absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out"
            :class="index === 0
              ? 'opacity-100 scale-100 group-hover:scale-105'
              : 'opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100'" />

          <!-- Dark Overlay (Enhances text readability on dark images) -->
          <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent transition-all duration-500 ease-in-out"
            :class="index === 0 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">
          </div>

          <!-- Content (Relative to stay on top) -->
          <div class="relative z-10 flex flex-col h-full gap-3">
            <!-- Icon Circle -->
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300"
              :class="index === 0
                ? 'bg-white text-primary'
                : 'bg-primary text-white group-hover:bg-white group-hover:text-primary'">
              <UIcon :name="stat.icon" />
            </div>

            <!-- Stat Data -->
            <div class="mt-auto flex flex-col gap-1">
              <span class="text-3xl font-bold transition-colors duration-300"
                :class="index === 0 ? 'text-white' : 'text-slate-800 group-hover:text-white'">
                {{ stat.value }}
              </span>
              <span class="text-lg font-semibold transition-colors duration-300"
                :class="index === 0 ? 'text-white' : 'text-slate-700 group-hover:text-white'">
                {{ stat.label }}
              </span>
              <p class="text-sm transition-colors duration-300 mt-1 leading-snug"
                :class="index === 0 ? 'text-white/90' : 'text-slate-500 group-hover:text-white/90'">
                {{ stat.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA -->
      <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
        <span class="text-sm text-gray-500">Don't hesitate. Contact us for a full breakdown of our capabilities.</span>
        <UButton label="Explore Our Milestones" trailing-icon="i-heroicons-arrow-right-20-solid"
          class="bg-primary hover:bg-secondary text-white font-medium rounded-full px-6 py-2.5 text-sm transition-colors" />
      </div>
    </UContainer>
  </section>
</template>

<script setup>
const stats = [
  {
    value: 'Tk 100 cr',
    label: 'Initial Investment',
    description: 'Phase one, expanding to all accessory categories.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai11.jpeg',
    icon: 'i-heroicons-banknotes-20-solid',
  },
  {
    value: '700,000 yd',
    label: 'Monthly Output',
    description: 'Fabric and accessories produced in the initial phase.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai12.jpeg',
    icon: 'i-heroicons-arrow-trending-up-20-solid',
  },
  {
    value: '2M yd',
    label: 'Future Capacity',
    description: 'Projected output per month at full-scale operations.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai13.jpeg',
    icon: 'i-heroicons-rocket-launch-20-solid',
  },
  {
    value: '15,000',
    label: 'Employment',
    description: 'Jobs generated across the entire venture.',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai14.jpeg',
    icon: 'i-heroicons-users-20-solid',
  }
]
</script>