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
  <header
    :class="[
      'site-header',
      { 'site-header--hidden': headerHidden },
      { 'site-header--open': menuOpen }
    ]"
  >
    <a href="#top" class="header-logo" @click="emit('closeMenu')" aria-label="Ha-Meem Ching Tai home">
      <span>HCTPAL</span>
    </a>

    <button
      type="button"
      class="menu-button"
      :aria-expanded="menuOpen"
      aria-controls="site-menu"
      @click="emit('toggleMenu')"
    >
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? 'Close' : 'Menu' }}</span>
    </button>

    <div class="header-links">
      <a href="#collections">Products</a>
      <a href="#contact">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M22 7l-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
        </svg>
        <span>Inquire</span>
      </a>
    </div>
  </header>
</template>
