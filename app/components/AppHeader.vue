<template>
  <header class="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] transition-all duration-500 ease-in-out
            backdrop-blur-xl rounded-full shadow-xl border border-white/30"
    :class="scrolled ? 'max-w-xl px-6 py-2 bg-white/80' : 'bg-white/80 max-w-7xl px-10 py-2'">
    <div class="flex items-center justify-between w-full gap-2">

      <!-- Left: Logo (Collapses to 0 width when scrolled) -->
      <div
        class="flex items-center gap-2 text-[#1a1a1a] font-bold tracking-tight transition-all duration-500 ease-in-out shrink-0 overflow-hidden whitespace-nowrap"
        :class="scrolled ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-2 text-sm'">
        <span class="shrink-0">HAMEEM CHING TAI POCKETING & ACCESSORIES LTD.</span>
      </div>

      <!-- Center: Nav (flex-1 makes it perfectly center when sides collapse) -->
      <nav
        class="flex items-center justify-center gap-6 lg:gap-8 font-medium tracking-wide uppercase text-[#274257] transition-all duration-500 ease-in-out flex-1"
        :class="scrolled ? 'text-xs' : 'text-sm'">
        <ULink to="#" class="hover:text-[#e8b938] transition-colors">Home</ULink>
        <ULink to="#" class="hover:text-[#e8b938] transition-colors">Why it matters</ULink>
        <ULink to="#" class="hover:text-[#e8b938] transition-colors">The venture at a glance</ULink>
      </nav>

      <!-- Right: Search + CTA (Collapses when scrolled) -->
      <div
        class="flex items-center gap-3 shrink-0 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
        :class="scrolled ? 'opacity-0 w-0' : 'opacity-100 w-auto'">
        <!-- <button
          class="hidden sm:flex items-center justify-center rounded-full border border-gray-200 text-[#274257] hover:text-[#e8b938] hover:border-[#e8b938] transition-colors w-10 h-10">
          <UIcon name="i-heroicons-magnifying-glass-20-solid" />
        </button> -->
        <UButton label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid"
          class="bg-[#e8b938] hover:bg-[#d4a52f] text-[#1a1a1a] font-medium rounded-full px-6 py-2.5 text-sm" />
      </div>

      <!-- Mobile Menu Hamburger (Always visible) -->
      <button class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-[#274257] ml-2 shrink-0"
        @click="mobileOpen = !mobileOpen">
        <UIcon :name="mobileOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'" class="text-xl" />
      </button>
    </div>

    <!-- Mobile Dropdown -->
    <div v-if="mobileOpen"
      class="lg:hidden mt-4 pt-4 border-t border-gray-200 flex flex-col gap-3 text-sm uppercase font-medium text-[#274257]">
      <ULink to="#" @click="mobileOpen = false">Home</ULink>
      <ULink to="#" @click="mobileOpen = false">Why it matters</ULink>
      <ULink to="#" @click="mobileOpen = false">The venture at a glance</ULink>
      <ULink to="#" @click="mobileOpen = false">The facility</ULink>
    </div>
  </header>
</template>

<script setup>
import { useWindowScroll, useDebounceFn } from '@vueuse/core'

const { y } = useWindowScroll()
const scrolled = ref(false)
const mobileOpen = ref(false)

const updateScrolled = useDebounceFn(() => {
  scrolled.value = y.value > 50
}, 50)

watch(y, updateScrolled)
</script>