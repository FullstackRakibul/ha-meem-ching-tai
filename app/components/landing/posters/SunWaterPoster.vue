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
      <!-- Halo: one hue fading to zero alpha, so the edge never greys out -->
      <radialGradient id="loomSunGlow">
        <stop offset="0" style="stop-color: var(--sun-halo)" />
        <stop offset="1" style="stop-color: var(--sun-halo)" stop-opacity="0" />
      </radialGradient>
      <!-- Disc: flat, with a subtle warm centre → edge -->
      <radialGradient id="loomSunDisc">
        <stop offset="0" style="stop-color: var(--sun-hi)" />
        <stop offset="0.6" style="stop-color: var(--sun-core)" />
        <stop offset="1" style="stop-color: var(--sun-edge)" />
      </radialGradient>
    </defs>
    <circle cx="0" cy="-34" r="34" fill="url(#loomSunGlow)" stroke="none"
      class="origin-center transform-fill motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-(--ease) motion-safe:group-hover/sun:scale-108 motion-safe:group-has-[a:focus-visible]/dusk:scale-108" />
    <circle cx="0" cy="-34" r="10" class="loom-poster__sun" />
    <path :d="loop" class="loom-poster__water" vector-effect="non-scaling-stroke" />
    <circle :cx="node.cx" :cy="node.cy" r="3.2" class="loom-poster__node" vector-effect="non-scaling-stroke" />
  </svg>
</template>
