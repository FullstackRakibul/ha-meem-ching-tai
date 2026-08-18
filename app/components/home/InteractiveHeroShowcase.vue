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
  <!-- dvh, not vh: on mobile browsers vh is measured against the *expanded*
       viewport, so the bottom-anchored pills sit behind the URL bar. -->
  <section class="relative w-full h-[85dvh] md:h-[80vh] lg:h-screen overflow-hidden bg-gray-100"
    @mouseenter="stopAutoplay" @mouseleave="startAutoplay">

    <!-- Background Images Loop (Smooth Crossfade) -->
    <div v-for="(item, index) in items" :key="item.id"
      class="absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out"
      :class="activeIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'">
      <img :src="item.image" :alt="item.title" class="w-full h-full object-cover" />
    </div>

    <!-- Subtle Gradient Overlay (Ensures text is highly readable) -->
    <div class="absolute inset-0 z-20 bg-linear-to-b from-black/20 via-transparent to-black/30 pointer-events-none">
    </div>

    <!-- Interactive selectors.
         Desktop: four full-height columns, divided by hairlines, chosen on
         hover — the labels sit a fifth of the way down so they read against
         the image rather than crowding the top edge.
         Mobile: four columns of ~90px cannot hold "The venture at a glance"
         in uppercase tracked-out text; it wraps to unreadable slivers. So on
         small screens the same four items become a stacked list of full-width
         pills anchored to the bottom, chosen by tap. -->
    <div
      class="absolute inset-0 z-30 flex flex-col justify-end gap-2.5 p-5 pb-8
             md:grid md:grid-cols-4 md:gap-0 md:p-0 md:divide-x md:divide-white/30"
      :style="{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom, 0px))' }"
    >
      <button v-for="(item, index) in items" :key="item.id" type="button"
        class="relative group cursor-pointer flex md:flex-col md:items-center md:justify-start md:pt-[20vh] transition-colors duration-300 text-left md:text-center"
        :aria-pressed="activeIndex === index"
        @mouseenter="handleSelect(index)" @click="handleSelect(index)">

        <!-- ACTIVE State: Glass pill with gold accent.
             The accent is an underline on desktop (centred beneath the pill)
             and a leading bar on mobile, where a full-width pill has no
             natural centre to hang a 40px rule from. -->
        <div v-if="activeIndex === index"
          class="relative w-full md:w-auto flex items-center md:flex-col md:items-center gap-3 md:gap-2.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg px-5 py-3.5 md:px-6 md:py-3 text-white text-xs sm:text-sm font-semibold uppercase tracking-wider md:tracking-widest transition-all duration-500 ease-out">
          <span class="md:hidden h-4 w-0.5 shrink-0 rounded-full bg-[#e8b938]"></span>
          {{ item.title }}
          <span class="hidden md:block absolute -bottom-3 h-0.5 w-10 rounded-full bg-[#e8b938]"></span>
        </div>

        <!-- INACTIVE State: Faded, lifting on hover (desktop) or simply dimmed
             (mobile, where there is no hover to reveal it). -->
        <div v-else
          class="w-full md:w-auto rounded-full border border-white/10 md:border-transparent bg-black/15 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none px-5 py-3.5 md:px-6 md:py-3 text-white/60 md:text-white/50 text-xs sm:text-sm font-semibold uppercase tracking-wider md:tracking-widest transition-all duration-300 ease-out md:group-hover:text-white md:group-hover:border-white/20 md:group-hover:bg-white/5 md:group-hover:backdrop-blur-md md:group-hover:-translate-y-0.5">
          {{ item.title }}
        </div>

      </button>
    </div>

  </section>
</template>

<style scoped>
/* Tailwind handles all styling */
</style>