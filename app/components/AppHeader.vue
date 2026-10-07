<!-- components/AppHeader.vue -->
<script setup lang="ts">
/**
 * Solid white floating pill. It never hides and never blurs — blur and glow
 * belong to the scenes, not the chrome. Past 50px of scroll it shrinks
 * (width, height) through Tailwind classes only, so one CSS transition
 * animates the whole change. The scroll flag is debounced (50ms) so the
 * transition isn't restarted on every scroll tick.
 *
 * Heights are fixed, not padding-derived: 56/64px at rest, 48/52px scrolled
 * (below / from 640px). `--header` in main.css = rest height + 12px offset.
 */
import { useDebounceFn, useWindowScroll } from "@vueuse/core";
import { useLocale, type LocaleCode } from "~/composables/useLocale";

defineProps<{ menuOpen: boolean }>();

const emit = defineEmits<{
  (e: "toggleMenu"): void;
  (e: "closeMenu"): void;
}>();

const { setLocale, t, locales } = useLocale();

// Expected at public/brochure/hctpal-brochure.pdf.
const BROCHURE_PATH = "./hctpal-brochure.pdf";
const brochureHref = `${useRuntimeConfig().app.baseURL.replace(/\/$/, "")}/${BROCHURE_PATH}`;

const { y } = useWindowScroll();
const scrolled = ref(false);
const syncScrolled = useDebounceFn((value: number) => {
  scrolled.value = value > 50;
}, 50);
watch(y, (value) => syncScrolled(value));

onMounted(() => {
  scrolled.value = window.scrollY > 50;
  try {
    const saved = localStorage.getItem("hctpal-locale") as LocaleCode | null;
    if (saved && locales.some((l) => l.code === saved)) setLocale(saved);
  } catch {
    // Storage unavailable — fall back to the default locale.
  }
});
</script>

<template>
  <header :class="[
    'loom-header fixed top-3 left-1/2 z-1500 flex w-[calc(100%-24px)] -translate-x-1/2 items-center gap-2 rounded-full bg-white text-(--navy) shadow-lg transition-[max-width,height,padding] duration-500 ease-in-out motion-reduce:transition-none sm:gap-3',
    scrolled
      ? 'h-12 max-w-225 px-3 sm:h-13 sm:px-5'
      : 'h-14 max-w-325 px-3 sm:h-16 sm:px-6',
  ]">
    <a href="#top" class="header-logo group flex min-h-11 min-w-0 flex-col justify-center rounded-lg"
      @click="emit('closeMenu')" aria-label="Ha-Meem Ching Tai Pocketing & Accessories Ltd. — home">
      <span
        class="block whitespace-nowrap font-serif text-[15px] leading-[1.15] font-bold tracking-tight text-(--navy) uppercase transition-colors duration-300 group-hover:text-(--navy-tint) sm:text-[19px]">
        Ha-Meem Ching Tai
      </span>
      <!-- Always visible: a hover-gated subtitle is unreachable on touch. -->
      <span
        class="block whitespace-nowrap text-[9px] leading-[1.4] tracking-[0.08em] text-(--muted) uppercase sm:text-[10px]">
        Pocketing &amp; Accessories Ltd.
      </span>
    </a>

    <a :href="brochureHref" download="HCTPAL-Brochure.pdf" type="application/pdf" target="_blank" rel="noopener"
      class="loom-cta ml-auto shrink-0" :aria-label="t('brochureDownload')">
      <UIcon name="i-heroicons-arrow-down-tray" class="h-4 w-4 shrink-0" aria-hidden="true" />
      <span class="hidden sm:inline">{{ t("brochure") }}</span>
      <span class="loom-cta__tag hidden sm:inline" aria-hidden="true">{{
        t("brochureTag")
      }}</span>
    </a>

    <button type="button" :class="['menu-button shrink-0', { 'is-open': menuOpen }]" :aria-expanded="menuOpen"
      aria-controls="site-menu" @click="emit('toggleMenu')">
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? t("close") : t("menu") }}</span>
    </button>
  </header>
</template>