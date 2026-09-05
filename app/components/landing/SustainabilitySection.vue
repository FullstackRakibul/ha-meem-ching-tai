<script setup lang="ts">
import { ref } from 'vue'

// Data strictly separated from structure
interface Pillar {
  title: string
  description: string
  icon: string
  color: string
}

const { t } = useLocale()

const pillars = computed<Pillar[]>(() => [
  {
    title: t('pillar1Title'),
    description: t('pillar1Desc'),
    icon: 'i-heroicons-globe-americas',
    color: 'text-green-600',
  },
  {
    title: t('pillar2Title'),
    description: t('pillar2Desc'),
    icon: 'i-heroicons-document-check',
    color: 'text-blue-600',
  },
  {
    title: t('pillar3Title'),
    description: t('pillar3Desc'),
    icon: 'i-heroicons-arrow-path-rounded-square',
    color: 'text-teal-600',
  },
])
</script>

<template>
  <section id="sustainability-initiatives h-full"
    class="relative w-full min-h-[100vh] flex items-center overflow-hidden bg-slate-900">

    <!-- Background Image: HCTPAL Leaf Text -->
    <div class="absolute inset-0 z-0">
      <!-- Ensure the image path matches your /public directory -->
      <img src="../../assets/img/hctpal-SustainabilitySection.jpg" alt="HCTPAL Sustainability Background"
        class="w-full h-full object-cover opacity-70 scale-105 transform transition-transform duration-[15s] hover:scale-100" />
      <!-- Glass overlay ensures high-contrast readability for the text -->
      <div class="absolute inset-0 bg-gradient-to-r from-white/65 via-white/55 to-white/40 md:to-transparent"></div>
    </div>

    <!-- Background Floating Leaves Animation -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <div
        class="leaf leaf-1 absolute top-1/4 left-10 w-6 h-6 bg-green-500/40 rounded-tl-full rounded-br-full animate-float-1" />
      <div
        class="leaf leaf-2 absolute top-2/4 left-1/3 w-4 h-4 bg-green-400/30 rounded-tl-full rounded-br-full animate-float-2" />
      <div
        class="leaf leaf-3 absolute top-3/4 left-20 w-8 h-8 bg-green-600/20 rounded-tl-full rounded-br-full animate-float-3" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 w-full z-10 relative py-16">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        <!-- Left Content: High-Density "One-Look" Information -->
        <div class="lg:col-span-6 space-y-8">
          <div>
            <h2 class="font-manrope text-primary-200 text-sm font-bold tracking-widest text-green-700 uppercase mb-2">{{ t('visionEyebrow') }}</h2>
            <h3
              class="font-playfair text-4xl md:text-5xl font-extrabold tracking-tight text-primary-700 text-slate-900 leading-tight">{{ t('visionTitle') }}</h3>
            <p class="mt-4 text-base text-slate-700 leading-relaxed max-w-lg font-manrope">{{ t('visionBody') }}</p>
          </div>

          <!-- Data Cards -->
          <div class="grid grid-cols-1 gap-4">
            <article v-for="(pillar, idx) in pillars" :key="idx"
              class="glass-card p-4 rounded-md border-l-2 border-primary-600 flex items-start gap-4 transition-all duration-400 ease-out hover:translate-x-3 hover:shadow-xl group cursor-pointer">
              <div class="flex-shrink-0 mt-1">
                <div
                  class="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <UIcon :name="pillar.icon" :class="['w-5 h-5', pillar.color]" />
                </div>
              </div>
              <div>
                <h4 class="text-base font-bold text-slate-900 font-manrope">{{ pillar.title }}</h4>
                <p class="text-sm text-slate-600 mt-1 font-manrope leading-snug">{{ pillar.description }}</p>
              </div>
            </article>
          </div>
        </div>

        <!-- Right Content: Visual Anchor (Leaf Dress) -->
        <div class="lg:col-span-6 relative mt-12 lg:mt-0 flex justify-center lg:justify-end">

          <!-- Animated UIcon Leaves -->
          <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <UIcon name="i-heroicons-sparkles"
              class="absolute top-1/4 left-10 w-6 h-6 text-green-500/50 animate-float-1" />
            <UIcon name="i-heroicons-sparkles"
              class="absolute top-2/4 right-1/4 w-4 h-4 text-green-400/40 animate-float-2" />
            <UIcon name="i-heroicons-sparkles"
              class="absolute bottom-1/4 left-1/3 w-8 h-8 text-green-600/30 animate-float-3" />
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* Scoped Typography matching your configuration */
.font-manrope {
  font-family: 'Manrope', sans-serif;
}

.font-playfair {
  font-family: 'Playfair Display', serif;
}

/* Advanced Glassmorphism */
.glass-card {
  background: rgba(255, 255, 255, 0.445);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-right: 1px solid rgba(255, 255, 255, 0.5);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
}

/* Smooth Element Floating */
@keyframes float {
  0% {
    transform: translateY(0px) rotate(0deg) scale(1);
    opacity: 0;
  }

  15% {
    opacity: 1;
  }

  85% {
    opacity: 1;
  }

  100% {
    transform: translateY(-120px) rotate(45deg) scale(1.2);
    opacity: 0;
  }
}

.animate-float-1 {
  animation: float 7s ease-in-out infinite;
}

.animate-float-2 {
  animation: float 9s ease-in-out infinite 2s;
}

.animate-float-3 {
  animation: float 8s ease-in-out infinite 4s;
}
</style>