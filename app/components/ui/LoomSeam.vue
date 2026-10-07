<!-- components/ui/LoomSeam.vue -->
<script setup lang="ts">
/**
 * The site's one stitched seam: a running stitch drawn just inside its
 * host's edge. This component renders only the SVG. The host adds
 * `.loom-seam` (and may wrap its content in `.loom-seam__body` for the hover
 * lift); every style lives beside the loom-* rules in assets/css/loom.css.
 */
withDefaults(defineProps<{ radius?: number }>(), { radius: 8 });
</script>

<template>
  <svg class="loom-seam__stitch" aria-hidden="true" focusable="false">
    <rect width="100%" height="100%" :rx="radius" />
  </svg>
</template>
