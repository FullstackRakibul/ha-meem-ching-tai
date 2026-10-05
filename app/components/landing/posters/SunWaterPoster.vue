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
        <stop offset="0" stop-color="#FFF7CC" stop-opacity="0.7" />
        <stop offset="0.25" stop-color="#FFD54F" stop-opacity="0.5" />
        <stop offset="0.55" stop-color="#FF9800" stop-opacity="0.18" />
        <stop offset="1" stop-color="#FF6D00" stop-opacity="0" />
      </radialGradient>
      <!-- Disc fill: bright gold centre → deep orange rim (like the real sun) -->
      <radialGradient id="loomSunDisc">
        <stop offset="0"    stop-color="#FFE082" />
        <stop offset="0.35" stop-color="#FFB74D" />
        <stop offset="0.7"  stop-color="#F57C00" />
        <stop offset="1"    stop-color="#E65100" />
      </radialGradient>
    </defs>
    <circle cx="0" cy="-34" r="34" fill="url(#loomSunGlow)" stroke="none" />
    <circle cx="0" cy="-34" r="10" class="loom-poster__sun" />
    <path :d="loop" class="loom-poster__water" vector-effect="non-scaling-stroke" />
    <circle :cx="node.cx" :cy="node.cy" r="3.2" class="loom-poster__node" vector-effect="non-scaling-stroke" />
  </svg>
</template>
