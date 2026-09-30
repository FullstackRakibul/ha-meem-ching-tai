<!-- components/landing/posters/WeavePoster.vue -->
<script setup lang="ts">
/**
 * Output as cloth. The grid is 64 × 32 plain-weave cells; the woven rows are
 * exactly the share of today's output in future capacity (500,000 ÷ 2,000,000
 * = 25%, i.e. 8 of 32 rows). The rest is ghosted — capacity still to come.
 */
import { WOVEN_SHARE } from '~/composables/useLoomStage'

const COLS = 64
const ROWS = 32
const wovenRows = Math.round(ROWS * WOVEN_SHARE)
</script>

<template>
  <svg class="loom-poster loom-poster--weave" data-poster="stats" :viewBox="`0 0 ${COLS * 2} ${ROWS * 2}`"
    preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
    <defs>
      <pattern id="loomPlainWeave" width="4" height="4" patternUnits="userSpaceOnUse">
        <rect x="0.1" y="0.55" width="1.8" height="0.9" />
        <rect x="2.55" y="0.1" width="0.9" height="1.8" />
        <rect x="0.55" y="2.1" width="0.9" height="1.8" />
        <rect x="2.1" y="2.55" width="1.8" height="0.9" />
      </pattern>
    </defs>
    <rect :width="COLS * 2" :height="ROWS * 2" fill="url(#loomPlainWeave)" class="loom-poster__weave-ghost" />
    <rect :width="COLS * 2" :height="wovenRows * 2" fill="url(#loomPlainWeave)" class="loom-poster__weave-woven" />
  </svg>
</template>
