<!-- components/landing/posters/PlyPoster.vue -->
<script setup lang="ts">
/** Two plies — Ha-Meem (navy) and Ching Tai (gold) — twisted into one yarn. */
import { plyStrand, svgPath } from '~/lib/loom/paths'

const navy = svgPath((t) => plyStrand(0, t, true), 600)
const gold = svgPath((t) => plyStrand(1, t, true), 600)
</script>

<template>
  <svg class="loom-poster loom-poster--ply" data-poster="ply" viewBox="-100 -8 200 16" preserveAspectRatio="none"
    aria-hidden="true" focusable="false">
    <path :d="navy" class="loom-poster__ply-navy" vector-effect="non-scaling-stroke" />
    <path :d="gold" class="loom-poster__thread" vector-effect="non-scaling-stroke" />
  </svg>
</template>
