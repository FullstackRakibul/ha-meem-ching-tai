<!-- components/AppHeader.vue -->
<script setup lang="ts">
defineProps<{
  headerHidden: boolean;
  menuOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleMenu"): void;
  (e: "closeMenu"): void;
}>();
</script>

<template>
  <header
    :class="[
      'site-header flex items-center gap-4 w-full' /* Flex added to handle child alignment safely */,
      { 'site-header--hidden': headerHidden },
      { 'site-header--open': menuOpen },
    ]"
  >
    <!-- Added 'group' for hover state and 'shrink-0' to prevent the logo from being squeezed -->
    <a
      href="#top"
      class="header-logo px-2 group flex flex-col shrink-0 outline-none"
      @click="emit('closeMenu')"
      aria-label="Ha-Meem Ching Tai Pocketing & Accessories Ltd. — home"
    >
      <span
        class="block font-serif font-bold text-primary text-md sm:text-xl md:text-xl lg:text-xl tracking-tight transition-all duration-700 ease-out group-hover:tracking-normal motion-reduce:transition-none uppercase"
      >
        Ha-Meem Ching Tai
      </span>

      <!-- Always visible: a hover-gated subtitle is unreachable on touch. -->
      <span
        class="text-[6px] sm:text-[8px] md:text-[8.3px] text-gray-500 group-hover:text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] group-hover:tracking-[0.25em] sm:group-hover:tracking-[0.35em] whitespace-nowrap transition-all duration-700 delay-100 motion-reduce:transition-none"
      >
        Pocketing &amp; Accessories Ltd.
      </span>
    </a>

    <!-- 'shrink-0' prevents the menu button from compressing on small devices -->
    <button
      type="button"
      class="menu-button shrink-0"
      :aria-expanded="menuOpen"
      aria-controls="site-menu"
      @click="emit('toggleMenu')"
    >
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? "Close" : "Menu" }}</span>
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
