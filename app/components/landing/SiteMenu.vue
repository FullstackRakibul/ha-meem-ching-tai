<!-- components/landing/SiteMenu.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import WavyPreview from './WavyPreview.vue'

defineProps<{
  menuOpen: boolean
  navItems: Array<{ label: string; href: string; image: string }>
}>()

const emit = defineEmits<{
  (e: 'closeMenu'): void
}>()

const hoveredItem = ref<string | null>(null)
</script>

<template>
  <div
    id="site-menu"
    :class="[
      'site-menu',
      { 'site-menu--open': menuOpen },
      { 'site-menu--has-hover': hoveredItem !== null }
    ]"
  >
    <div class="site-menu__header">
      <a href="#top" class="site-menu__logo" @click="emit('closeMenu')">HCTPAL</a>
      <button type="button" class="site-menu__close" @click="emit('closeMenu')">
        <span>Close</span>
      </button>
    </div>

    <div class="site-menu__nav">
      <div class="site-menu__nav-inner">
        <div class="site-menu__nav-links">
          <a
            v-for="(item, index) in navItems"
            :key="item.label"
            :href="item.href"
            class="site-menu__nav-link"
            @mouseenter="hoveredItem = item.image"
            @mouseleave="hoveredItem = null"
            @click="emit('closeMenu')"
          >
            <span class="site-menu__nav-index">0{{ index + 1 }}</span>
            <span>{{ item.label }}</span>
          </a>
        </div>

        <div
          :class="[
            'site-menu__preview',
            { 'site-menu__preview--active': hoveredItem !== null }
          ]"
        >
          <ClientOnly>
            <WavyPreview :src="hoveredItem" :is-visible="hoveredItem !== null" />
          </ClientOnly>
        </div>
      </div>
    </div>

    <div class="site-menu__footer">
      <span>Ha-Meem Ching Tai Pocketing & Accessories Ltd.</span>
      <a href="#contact">Contact Support</a>
    </div>
  </div>
</template>
