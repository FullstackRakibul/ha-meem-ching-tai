<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
// 4 Data items with matching titles and background images
// IMPORTANT: Replace these Unsplash URLs with your actual factory image URLs
const items = [
  {
    id: 1,
    title: 'Garment Artistry',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai15.jpeg'
  },
  {
    id: 2,
    title: 'Fabric Elegance',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg'
  },
  {
    id: 3,
    title: 'Style Insider',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg'
  },
  {
    id: 4,
    title: 'Trend Curator',
    image: 'https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg'
  }
]

const activeIndex = ref(0)
let interval = null

// Autoplay Logic
const startAutoplay = () => {
  if (interval) clearInterval(interval)
  interval = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % items.length
  }, 9000) // Changes every 9 seconds
}

const stopAutoplay = () => {
  if (interval) {
    clearInterval(interval)
    interval = null
  }
}

// Handle user hover/click
const handleSelect = (index) => {
  stopAutoplay()
  activeIndex.value = index
}

// Lifecycle hooks
onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<template>
  <section class="relative w-full h-[80vh] lg:h-screen overflow-hidden bg-gray-100" @mouseenter="stopAutoplay"
    @mouseleave="startAutoplay">

    <!-- Background Images Loop (Smooth Crossfade) -->
    <div v-for="(item, index) in items" :key="item.id"
      class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
      :class="activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'">
      <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
    </div>

    <!-- Subtle Gradient Overlay (Ensures text is highly readable) -->
    <div class="absolute inset-0 z-20 bg-linear-to-b from-black/20 via-transparent to-black/30 pointer-events-none">
    </div>

    <!-- 4 Interactive Columns -->
    <div class="absolute inset-0 z-30 grid grid-cols-4 divide-x divide-white/30">
      <div v-for="(item, index) in items" :key="item.id"
        class="relative group cursor-pointer flex flex-col items-center pt-[20vh] transition-colors duration-300"
        @mouseenter="handleSelect(index)" @click="handleSelect(index)">

        <!-- ACTIVE State: Dark Pill Badge -->
        <div v-if="activeIndex === index"
          class="bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 text-white text-sm font-medium uppercase tracking-widest transition-all duration-300">
          {{ item.title }}
        </div>

        <!-- INACTIVE State: Faded Text -->
        <div v-else
          class="text-white/50 text-sm font-medium uppercase tracking-widest group-hover:text-white transition-colors duration-300">
          {{ item.title }}
        </div>

      </div>
    </div>

  </section>
</template>

<style scoped>
/* Tailwind handles all styling */
</style>