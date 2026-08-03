<template>
  <!-- `fullBleed` pages (e.g. a hero carousel that must touch the top of the
       viewport) opt out of the fixed-header offset and the width constraint. -->
  <div :class="fullBleed ? '' : 'max-w-7xl mx-auto px-4 pt-32 pb-12'">
    <slot />
  </div>
</template>

<script setup>
const route = useRoute()
const fullBleed = computed(() => route.meta.fullBleed === true)
</script>
