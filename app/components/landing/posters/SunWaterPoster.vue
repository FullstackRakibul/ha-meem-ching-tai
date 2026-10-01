<!-- components/landing/posters/SunWaterPoster.vue -->
<script setup lang="ts">
/**
 * Dusk poster: the risen sun (the 16.9 MW solar plant) over a closed water
 * loop that passes through the caustic recovery node — zero discharge.
 */
import { RECOVERY_NODE, svgPath, waterLoop } from '~/lib/loom/paths'

const loop = svgPath(waterLoop, 120, true)
const node = { cx: (RECOVERY_NODE[0] * 100).toFixed(2), cy: (-RECOVERY_NODE[1] * 56).toFixed(2) }
</script>

<template>
  <svg class="loom-poster loom-poster--dusk" data-poster="dusk" viewBox="-60 -70 120 100"
    preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs>
      <radialGradient id="loomSunGlow">
        <stop offset="0" stop-color="#e8b938" stop-opacity="0.55" />
        <stop offset="0.45" stop-color="#e8b938" stop-opacity="0.16" />
        <stop offset="1" stop-color="#e8b938" stop-opacity="0" />
      </radialGradient>
    </defs>
    <circle cx="0" cy="-34" r="34" fill="url(#loomSunGlow)" stroke="none" />
    <circle cx="0" cy="-34" r="10" class="loom-poster__sun" />
    <path :d="loop" class="loom-poster__water" vector-effect="non-scaling-stroke" />
    <circle :cx="node.cx" :cy="node.cy" r="3.2" class="loom-poster__node" vector-effect="non-scaling-stroke" />
  </svg>
</template>
