<!-- components/landing/Loader.vue -->
<script setup lang="ts">
defineProps<{
  loaded: boolean
  loadingProgress: number
}>()
</script>

<template>
  <div :class="['loader', { 'loader--done': loaded }]" aria-hidden="true">
    <div class="loader__frame">
      <div class="loader__topline">
        <span>Ha-Meem Ching Tai</span>
        <span>Narsingdi · Bangladesh</span>
      </div>
      <div class="loader__center">
        <p class="loader__eyebrow">Pocketing · Interlining · Lining · Waistband</p>
        <p class="loader__percentage">{{ String(loadingProgress).padStart(2, '0') }}%</p>
        <p class="loader__word">HCTPAL</p>
        <div class="loader__progress" :style="{ '--loading-progress': `${loadingProgress}%` }">
          <i />
        </div>
      </div>
      <div class="loader__bottom">
        <span>Dhaka · Bangladesh</span>
        <span>{{ String(loadingProgress).padStart(2, '0') }}%</span>
      </div>
    </div>
  </div>
</template>
