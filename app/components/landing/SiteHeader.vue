<!-- components/landing/SiteHeader.vue -->
<script setup lang="ts">
// Types are not auto-imported (only values are), so LocaleCode is explicit.
import { useLocale, type LocaleCode } from "~/composables/useLocale";

defineProps<{
  headerHidden: boolean;
  menuOpen: boolean;
}>();

const emit = defineEmits<{
  (e: "toggleMenu"): void;
  (e: "closeMenu"): void;
}>();

const { locale, setLocale, t, locales } = useLocale();

const langOpen = ref(false);
const langRef = ref<HTMLElement | null>(null);

const activeLocale = computed(
  () => locales.find((l) => l.code === locale.value) ?? locales[0]
);

const choose = (code: LocaleCode) => {
  setLocale(code);
  langOpen.value = false;
};

// Dismiss on outside click / Escape, so the popover behaves like a menu
// rather than a toggle the user has to click twice.
const onDocPointer = (e: PointerEvent) => {
  if (langOpen.value && !langRef.value?.contains(e.target as Node)) {
    langOpen.value = false;
  }
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") langOpen.value = false;
};

onMounted(() => {
  // Restore a previously chosen language before paint-sensitive work.
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
  <header :class="[
    /* Fixed overlay positioning ensures header floats above page sections */
    'site-header fixed top-0 inset-x-0 z-50 flex items-center gap-4 w-full transition-transform duration-300 ease-in-out',
    headerHidden ? '-translate-y-full' : 'translate-y-0',
    { 'site-header--hidden': headerHidden },
    { 'site-header--open': menuOpen },
  ]">
    <a href="#top" class="header-logo group shrink-0 outline-none" @click="emit('closeMenu')"
      aria-label="Ha-Meem Ching Tai home">
      <span
        class="block font-bold text-primary text-base sm:text-lg md:text-xl lg:text-2xl whitespace-nowrap origin-left transition-all duration-500 ease-out group-hover:tracking-wider group-hover:opacity-80">
        Ha-Meem Ching Tai
      </span>
    </a>

    <button type="button" class="menu-button shrink-0" :aria-expanded="menuOpen" aria-controls="site-menu"
      @click="emit('toggleMenu')">
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? t("close") : t("menu") }}</span>
    </button>

    <div class="header-links ml-auto flex items-center gap-4 shrink-0">
      <!-- Language switcher — replaces the old Products link -->
      <div ref="langRef" class="lang-switch relative">
        <button type="button" class="lang-switch__trigger flex items-center gap-1.5" :aria-expanded="langOpen"
          aria-haspopup="listbox" :aria-label="t('language')" @click="langOpen = !langOpen">
          <UIcon name="i-heroicons-language" class="w-4 h-4" />
          <span class="hidden sm:inline">{{ activeLocale.native }}</span>
          <UIcon name="i-heroicons-chevron-down-20-solid" class="w-3 h-3 transition-transform"
            :class="langOpen ? 'rotate-180' : ''" />
        </button>

        <ul v-show="langOpen" class="lang-switch__menu" role="listbox" :aria-label="t('language')">
          <li v-for="l in locales" :key="l.code" role="option" :aria-selected="l.code === locale">
            <button type="button" class="lang-switch__option" :class="l.code === locale ? 'is-active' : ''"
              :lang="l.code" @click="choose(l.code)">
              <span>{{ l.native }}</span>
              <UIcon v-if="l.code === locale" name="i-heroicons-check-20-solid" class="w-3.5 h-3.5" />
            </button>
          </li>
        </ul>
      </div>

      <a href="#contact" class="flex items-center gap-2">
        <UIcon name="i-heroicons-envelope" class="w-4 h-4" />
        <span>{{ t("inquire") }}</span>
      </a>
    </div>
  </header>
</template>