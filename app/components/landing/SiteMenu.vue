<!-- components/landing/SiteMenu.vue -->
<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";
import WavyPreview from "./WavyPreview.vue";

const props = defineProps<{
  menuOpen: boolean;
  navItems: Array<{ label: string; href: string; image: string }>;
}>();

const emit = defineEmits<{
  (e: "closeMenu"): void;
}>();

const hoveredItem = ref<string | null>(null);

// Lenis drives scrolling on desktop and overrides body overflow, so the page is
// frozen by stopping Lenis itself; the overflow lock covers the touch/reduced-
// motion case where the plugin bails out and never provides $lenis.
const { $lenis } = useNuxtApp();

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape") emit("closeMenu");
};

// The menu closes over ~700ms and scrolling is frozen while it is open, so the
// jump is handed to Lenis after the close rather than left to the browser.
const onNavigate = (event: MouseEvent, href: string) => {
  emit("closeMenu");
  if (!href.startsWith("#")) return;

  const target = document.querySelector(href);
  if (!target) return;

  event.preventDefault();
  if ($lenis) {
    $lenis.start();
    $lenis.scrollTo(target as HTMLElement);
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
};

// Escape closes the menu, and the page behind it stays put while it is open.
watch(
  () => props.menuOpen,
  (open) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
    if (open) {
      $lenis?.stop();
      window.addEventListener("keydown", onKeydown);
    } else {
      $lenis?.start();
      window.removeEventListener("keydown", onKeydown);
      hoveredItem.value = null;
    }
  }
);

onBeforeUnmount(() => {
  if (typeof document === "undefined") return;
  document.body.style.overflow = "";
  $lenis?.start();
  window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
  <!-- Closed, the panel is only translated off-screen, so it must also be made
       inert — otherwise it keeps swallowing clicks and holding focusable links. -->
  <div
    id="site-menu"
    :class="[
      'site-menu fixed inset-0 z-50 flex flex-col bg-white text-slate-900 transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none',
      menuOpen ? 'mt-8 translate-y-0' : 'mt-0 -translate-y-full pointer-events-none',
      { 'site-menu--has-hover': hoveredItem !== null },
    ]"
    aria-modal="true"
    role="dialog"
    aria-label="Site menu"
    :aria-hidden="!menuOpen"
    :inert="!menuOpen"
  >
    <!-- Header Area -->
    <div
      class="site-menu__header flex justify-between items-center p-6 lg:px-12 lg:py-8 shrink-0"
    >
      <a
        href="#top"
        class="site-menu__logo font-bold text-2xl tracking-wide outline-none group"
        @click="emit('closeMenu')"
      >
        <span class="group-hover:opacity-70 transition-opacity">HCTPAL</span>
      </a>
      <button
        type="button"
        class="site-menu__close text-sm uppercase tracking-widest font-semibold hover:text-red-600 transition-colors"
        @click="emit('closeMenu')"
      >
        <span>Close</span>
      </button>
    </div>

    <!-- Navigation Area: Overflow-y handles smaller screens, Grid handles desktop -->
    <div
      class="site-menu__nav flex-1 w-full overflow-y-auto overflow-x-hidden flex items-center"
    >
      <div
        class="site-menu__nav-inner w-full max-w-350 mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center"
      >
        <!-- Links Column: Taking up 7 columns on desktop to ensure long names fit perfectly -->
        <div
          class="site-menu__nav-links lg:col-span-7 flex flex-col gap-6 lg:gap-8 py-10"
        >
          <a
            v-for="(item, index) in navItems"
            :key="item.label"
            :href="item.href"
            class="site-menu__nav-link group flex items-start gap-4 md:gap-6 outline-none"
            @mouseenter="hoveredItem = item.image"
            @mouseleave="hoveredItem = null"
            @click="onNavigate($event, item.href)"
          >
            <!-- Index Number -->
            <span
              class="site-menu__nav-index text-sm md:text-base font-medium text-slate-400 mt-2 md:mt-4 transition-colors group-hover:text-primary"
            >
              0{{ index + 1 }}
            </span>

            <!-- Menu Label: Responsive typography, breaks nicely if extremely long -->
            <span
              class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none wrap-break-word group-hover:translate-x-4 transition-transform duration-500 ease-out"
            >
              {{ item.label }}
            </span>
          </a>
        </div>

        <!-- Preview Image Column: Taking up 5 columns, hidden on small devices -->
        <div
          class="site-menu__preview lg:col-span-5 hidden lg:block relative h-[50vh] xl:h-[60vh] w-full rounded-2xl overflow-hidden shadow-2xl transition-opacity duration-500 ease-in-out"
          :class="hoveredItem !== null ? 'opacity-100' : 'opacity-0'"
        >
          <ClientOnly>
            <!-- Assuming WavyPreview handles absolute positioning internally to fill parent -->
            <WavyPreview
              :src="hoveredItem"
              :is-visible="hoveredItem !== null"
              class="w-full h-full object-cover"
            />
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- Footer Area -->
    <div
      class="site-menu__footer flex flex-col sm:flex-row justify-between items-center p-6 lg:px-12 lg:py-8 shrink-0 text-xs sm:text-sm text-slate-500 border-t border-slate-100"
    >
      <span>Ha-Meem Ching Tai Pocketing & Accessories Ltd.</span>
      <a
        href="#contact"
        class="mt-2 sm:mt-0 hover:text-slate-900 transition-colors font-medium"
        @click="onNavigate($event, '#contact')"
        >Contact Support</a
      >
    </div>
  </div>
</template>
