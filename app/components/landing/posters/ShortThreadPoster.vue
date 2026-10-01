<!-- components/landing/posters/ShortThreadPoster.vue -->
<script setup lang="ts">
/**
 * The Short Thread, as one still frame: the long import loop ghosted behind,
 * the short local stitch drawn solid between the two words. Before and after
 * are both visible, so the comparison survives with no motion at all.
 */
import { longLoop, POSTER_VIEWBOX, shortStitch, svgPath } from '~/lib/loom/paths'

const long = svgPath(longLoop)
const short = svgPath(shortStitch, 2)
</script>

<template>
  <svg class="loom-poster" data-poster="why" :viewBox="POSTER_VIEWBOX" preserveAspectRatio="none" aria-hidden="true"
    focusable="false">
    <path :d="long" class="loom-poster__ghost" vector-effect="non-scaling-stroke" />
    <path :d="short" class="loom-poster__thread loom-poster__thread--bold" vector-effect="non-scaling-stroke" />
  </svg>
</template>
