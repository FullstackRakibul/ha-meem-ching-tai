<!-- components/landing/SustainabilityCTA.vue -->
<script setup lang="ts">
import { ref } from 'vue'

// Clean Architecture: Separate data from UI representation
const stats = ref([
  {
    id: 'solar',
    value: '16.9',
    unit: 'MW',
    label: 'Solar Power Capacity',
    desc: 'Driving our high-speed weaving and automated units.'
  },
  {
    id: 'water',
    value: 'Zero',
    unit: '',
    label: 'Water Discharge by 2030',
    desc: 'Achieved through advanced closed-loop caustic recovery.'
  }
])
</script>

<template>
  <section
    class="relative w-full min-h-[100vh] flex items-center justify-center overflow-hidden bg-slate-950 py-16 lg:py-24"
    data-reveal>
    <!-- Background: Ambient Glow -->
    <div class="absolute inset-0 pointer-events-none z-0 overflow-hidden flex items-center">
      <!-- Ambient Solar Flare -->
      <div
        class="absolute top-1/2 -translate-y-1/2 left-0 lg:left-1/4 w-[80vw] lg:w-[40vw] h-[80vw] lg:h-[40vw] bg-amber-500/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow">
      </div>

      <!-- Factory Energy Grid Lines -->
      <div
        class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30 mask-image-gradient">
      </div>
    </div>

    <div
      class="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

      <!-- Left Column: The Solar Core (Animated Visual) -->
      <div class="lg:col-span-5 flex justify-center lg:justify-start relative h-[300px] lg:h-[400px]">
        <div class="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center">

          <!-- Radiating Solar Waves -->
          <div class="absolute inset-0 border border-amber-500/40 rounded-full animate-solar-wave"
            style="animation-delay: 0s;"></div>
          <div class="absolute inset-0 border border-orange-500/30 rounded-full animate-solar-wave"
            style="animation-delay: 1.5s;"></div>
          <div class="absolute inset-0 border border-yellow-500/20 rounded-full animate-solar-wave"
            style="animation-delay: 3s;"></div>

          <!-- Inner Sun Core -->
          <div
            class="relative w-32 h-32 lg:w-48 lg:h-48 rounded-full bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600 shadow-[0_0_60px_rgba(245,158,11,0.6)] flex items-center justify-center overflow-hidden">
            <!-- Simulated surface activity -->
            <div
              class="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8),transparent)] animate-spin-slow">
            </div>
          </div>

          <!-- Energy Beam connecting Sun to Data (Desktop only) -->
          <div
            class="hidden lg:block absolute top-1/2 left-full w-full h-0.5 bg-gradient-to-r from-amber-500 to-transparent opacity-50 -translate-y-1/2 shadow-[0_0_10px_rgba(245,158,11,0.8)]">
          </div>
        </div>
      </div>

      <!-- Right Column: Factory Data & CTA -->
      <div class="lg:col-span-7 flex flex-col gap-6 lg:gap-8">

        <!-- Headers -->
        <header>
          <h2 class="text-amber-500 font-bold tracking-widest uppercase text-xs sm:text-sm mb-2">Solar-Powered
            Manufacturing</h2>
          <h3 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Harnessing the sun to <br class="hidden md:block" />build the future of textiles.
          </h3>
        </header>

        <!-- Stats Grid (The "Machinery") -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <article v-for="stat in stats" :key="stat.id"
            class="group relative p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-500 hover:bg-white/10 hover:border-amber-500/50 hover:-translate-y-1">
            <!-- Hover Energy Effect -->
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-amber-500/10 to-transparent transition-opacity duration-500">
            </div>

            <div class="relative z-10 flex flex-col h-full justify-between gap-2">
              <div class="flex items-baseline gap-1">
                <span
                  class="text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 group-hover:to-amber-200 transition-colors duration-300">
                  {{ stat.value }}
                </span>
                <span v-if="stat.unit" class="text-xl font-bold text-amber-500">{{ stat.unit }}</span>
              </div>

              <div>
                <p class="text-sm font-bold text-white uppercase tracking-wide">{{ stat.label }}</p>
                <p class="text-xs text-slate-400 mt-1 leading-relaxed">{{ stat.desc }}</p>
              </div>
            </div>
          </article>
        </div>

        <!-- Call to Action -->
        <div class="mt-4">
          <a href="#contact"
            class="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white text-slate-950 font-semibold text-sm transition-all duration-300 hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(251,191,36,0.4)]">
            <span>Explore Development Milestones</span>
            <span
              class="flex items-center justify-center w-6 h-6 rounded-full bg-slate-950 text-white group-hover:bg-white group-hover:text-slate-950 transition-colors">
              <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 10h10M11 5l5 5-5 5" />
              </svg>
            </span>
          </a>
        </div>

      </div>
    </div>
  </section>
</template>

<style scoped>
/* High-Performance CSS Animations for the Solar Effects */

.animate-pulse-slow {
  animation: pulse-glow 6s ease-in-out infinite alternate;
}

@keyframes pulse-glow {
  0% {
    opacity: 0.3;
    transform: scale(0.95) translateY(-50%);
  }

  100% {
    opacity: 0.7;
    transform: scale(1.05) translateY(-50%);
  }
}

.animate-solar-wave {
  animation: solar-radiate 4.5s cubic-bezier(0.1, 0.4, 0.2, 1) infinite;
}

@keyframes solar-radiate {
  0% {
    transform: scale(1);
    opacity: 1;
  }

  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.animate-spin-slow {
  animation: spin 15s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Fades out the background grid at the edges */
.mask-image-gradient {
  mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(circle at center, black 30%, transparent 80%);
}
</style>