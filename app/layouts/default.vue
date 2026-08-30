<template>
  <!-- `fullBleed` pages (e.g. a hero carousel that must touch the top of the
       viewport) opt out of the fixed-header offset and the width constraint. -->
  <!-- pt clears the fixed header, which is shorter on mobile (smaller pill,
       smaller top offset) — pt-32 there wastes most of the first screen. -->
  <div
    :class="
      fullBleed ? '' : 'lg:m8x-w-8xl max-w-7xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-12'
    "
  >
    <slot />
  </div>
</template>

<script setup>
const route = useRoute();
const fullBleed = computed(() => route.meta.fullBleed === true);
</script>
