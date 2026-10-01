<!-- components/landing/SiteHeader.vue -->
<script setup lang="ts">
/**
 * Solid white floating pill. It never hides and never blurs — blur and glow
 * belong to the scenes, not the chrome. Past 50px of scroll it shrinks
 * (width, padding, type) through Tailwind classes only, so one CSS
 * transition animates the whole change. The scroll flag is debounced (50ms)
 * so the transition isn't restarted on every scroll tick.
 */
import { useDebounceFn, useWindowScroll } from "@vueuse/core";
import { useLocale, type LocaleCode } from "~/composables/useLocale";

defineProps<{ menuOpen: boolean }>();

const emit = defineEmits<{
  (e: "toggleMenu"): void;
  (e: "closeMenu"): void;
}>();

const { locale, setLocale, t, locales } = useLocale();

const { y } = useWindowScroll();
const scrolled = ref(false);
const syncScrolled = useDebounceFn((value: number) => {
  scrolled.value = value > 50;
}, 50);
watch(y, (value) => syncScrolled(value));

const langOpen = ref(false);
const langRef = ref<HTMLElement | null>(null);

const activeLocale = computed(
  () => locales.find((l) => l.code === locale.value) ?? locales[0]
);

const choose = (code: LocaleCode) => {
  setLocale(code);
  langOpen.value = false;
};

// Dismiss on outside click / Escape, so the popover behaves like a menu.
const onDocPointer = (e: PointerEvent) => {
  if (langOpen.value && !langRef.value?.contains(e.target as Node)) {
    langOpen.value = false;
  }
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") langOpen.value = false;
};

onMounted(() => {
  scrolled.value = window.scrollY > 50;
  try {
    const saved = localStorage.getItem("hctpal-locale") as LocaleCode | null;
    if (saved && locales.some((l) => l.code === saved)) setLocale(saved);
  } catch {
    // Storage unavailable — fall back to the default locale.
  }
  document.addEventListener("pointerdown", onDocPointer);
  document.addEventListener("keydown", onKey);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", onDocPointer);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <header
    :class="[
      'loom-header fixed top-3 left-1/2 z-1500 flex w-[calc(100%-24px)] -translate-x-1/2 items-center gap-3 rounded-full bg-white text-(--navy) shadow-lg transition-all duration-500 ease-in-out sm:gap-5',
      scrolled ? 'max-w-225 px-4 py-2 sm:px-6' : 'max-w-325 px-5 py-3 sm:px-10 sm:py-4',
    ]"
  >
    <a
      href="#top"
      class="shrink-0 font-extrabold tracking-tight transition-all duration-500 ease-in-out"
      :class="scrolled ? 'text-lg' : 'text-xl'"
      aria-label="Ha-Meem Ching Tai — home"
      @click="emit('closeMenu')"
    >
      <span class="lg:hidden">HCTPAL</span>
      <span class="hidden lg:inline">Ha-Meem Ching Tai</span>
    </a>

    <button
      type="button"
      :class="['menu-button', { 'is-open': menuOpen }, scrolled ? 'text-xs' : 'text-sm']"
      :aria-expanded="menuOpen"
      aria-controls="site-menu"
      @click="emit('toggleMenu')"
    >
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? t("close") : t("menu") }}</span>
    </button>

    <div class="ml-auto flex items-center gap-2 sm:gap-4">
      <div ref="langRef" class="lang-switch relative">
        <button
          type="button"
          class="lang-switch__trigger flex min-h-10 items-center gap-1.5 px-2 font-semibold uppercase tracking-wider transition-all duration-500"
          :class="scrolled ? 'text-xs' : 'text-sm'"
          :aria-expanded="langOpen"
          aria-haspopup="listbox"
          :aria-label="t('language')"
          @click="langOpen = !langOpen"
        >
          <UIcon name="i-heroicons-language" class="h-4 w-4" />
          <span class="hidden sm:inline">{{ activeLocale.native }}</span>
          <UIcon
            name="i-heroicons-chevron-down-20-solid"
            class="h-3 w-3 transition-transform"
            :class="langOpen ? 'rotate-180' : ''"
          />
        </button>

        <ul v-show="langOpen" class="lang-switch__menu" role="listbox" :aria-label="t('language')">
          <li v-for="l in locales" :key="l.code" role="option" :aria-selected="l.code === locale">
            <button
              type="button"
              class="lang-switch__option"
              :class="l.code === locale ? 'is-active' : ''"
              :lang="l.code"
              @click="choose(l.code)"
            >
              <span>{{ l.native }}</span>
              <UIcon v-if="l.code === locale" name="i-heroicons-check-20-solid" class="h-3.5 w-3.5" />
            </button>
          </li>
        </ul>
      </div>

      <!-- Gold CTA with navy text: 5.7:1. Gold is never used as text on light grounds. -->
      <a
        href="#contact"
        class="loom-cta inline-flex min-h-10 items-center gap-2 rounded-full font-bold transition-all duration-500 ease-in-out"
        :class="scrolled ? 'px-4 text-xs' : 'px-5 text-sm'"
        @click="emit('closeMenu')"
      >
        <UIcon name="i-heroicons-envelope" class="h-4 w-4" />
        <span class="hidden sm:inline">{{ t("contactCta") }}</span>
        <span class="sm:hidden">{{ t("inquire") }}</span>
      </a>
    </div>
  </header>
</template>
