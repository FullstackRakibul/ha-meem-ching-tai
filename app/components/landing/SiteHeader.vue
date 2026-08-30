<!-- components/landing/SiteHeader.vue -->
<script setup lang="ts">
defineProps<{
  headerHidden: boolean
  menuOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleMenu'): void
  (e: 'closeMenu'): void
}>()
</script>

<template>
  <header :class="[
    'site-header',
    { 'site-header--hidden': headerHidden },
    { 'site-header--open': menuOpen }
  ]">
    <a href="#top" class="header-logo" @click="emit('closeMenu')" aria-label="Ha-Meem Ching Tai home">
      <span class="font-bold text-lg text-primary  ">Ha-Meem Ching Tai</span>
    </a>

    <button type="button" class="menu-button" :aria-expanded="menuOpen" aria-controls="site-menu"
      @click="emit('toggleMenu')">
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? 'Close' : 'Menu' }}</span>
    </button>

    <div class="header-links">
      <a href="#collections">Products</a>
      <a href="#contact">
        <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
        <span>Inquire</span>
      </a>
    </div>
  </header>
</template>