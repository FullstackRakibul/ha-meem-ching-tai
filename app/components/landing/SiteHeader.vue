<!-- components/landing/SiteHeader.vue
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
      <span class="font-bold text-lg text-primary sm:text-md lg:text-2xl  ">Ha-Meem Ching Tai</span>
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
</template> -->

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
    'site-header flex items-center gap-4 w-full', /* Flex added to handle child alignment safely */
    { 'site-header--hidden': headerHidden },
    { 'site-header--open': menuOpen }
  ]">
    <!-- Added 'group' for hover state and 'shrink-0' to prevent the logo from being squeezed -->
    <a href="#top" class="header-logo group shrink-0 outline-none" @click="emit('closeMenu')"
      aria-label="Ha-Meem Ching Tai home">

      <!-- 
        Fixed responsive text classes.
        Added whitespace-nowrap to fix the line-break error.
        Added transition and tracking for a smooth, formal hover effect.
      -->
      <span class="
        block font-bold text-primary
        text-base sm:text-lg md:text-xl lg:text-2xl
        whitespace-nowrap
        origin-left
        transition-all duration-500 ease-out
        group-hover:tracking-wider group-hover:opacity-80
      ">
        Ha-Meem Ching Tai
      </span>
    </a>

    <!-- 'shrink-0' prevents the menu button from compressing on small devices -->
    <button type="button" class="menu-button shrink-0" :aria-expanded="menuOpen" aria-controls="site-menu"
      @click="emit('toggleMenu')">
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? 'Close' : 'Menu' }}</span>
    </button>

    <!-- 'ml-auto' pushes the links to the far right, matching your design layout -->
    <div class="header-links ml-auto flex items-center gap-4 shrink-0">
      <a href="#collections" class="hidden sm:block">Products</a>
      <a href="#contact" class="flex items-center gap-2">
        <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
        <span>Inquire</span>
      </a>
    </div>
  </header>
</template>