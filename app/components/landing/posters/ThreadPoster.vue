<!-- components/landing/posters/ThreadPoster.vue -->
<script setup lang="ts">
/**
 * Boot poster: the spun yarn on its long import loop, with the loose cotton
 * fibres it was spun from. Shown for reduced motion, no WebGL, mobile and
 * lite tiers; hidden by `html.loom-boot` once the 3D hero is drawing.
 */
import { longLoop, POSTER_VIEWBOX, svgPath } from '~/lib/loom/paths'

const d = svgPath(longLoop)

// Deterministic "fibres" so SSR and client markup match.
const fibres = Array.from({ length: 70 }, (_, i) => {
  const t = (i * 0.618034) % 1
  const [x, y] = longLoop(t)
  const jitter = Math.sin(i * 12.9898) * 3.2
  // Zero-length round-capped strokes: with non-scaling-stroke they stay
  // round dots however far preserveAspectRatio="none" stretches the poster.
  return `M${(x * 100 + jitter).toFixed(2)} ${(-y * 56 + Math.cos(i * 4.1) * 3.2).toFixed(2)}h0`
})
</script>

<template>
  <svg class="loom-poster" data-poster="boot" :viewBox="POSTER_VIEWBOX" preserveAspectRatio="none" aria-hidden="true"
    focusable="false">
    <path :d="d" class="loom-poster__thread" vector-effect="non-scaling-stroke" />
    <path v-for="(d, i) in fibres" :key="i" :d="d" class="loom-poster__fibre" vector-effect="non-scaling-stroke" />
  </svg>
</template>
