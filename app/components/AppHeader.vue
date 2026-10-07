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
      'loom-header fixed top-3 left-1/2 z-1500 flex w-[calc(100%-24px)] -translate-x-1/2 items-center  gap-3 rounded-full bg-white text-(--navy) shadow-lg transition-all duration-500 ease-in-out sm:gap-5',
      scrolled ? 'max-w-225 px-4 py-2 sm:px-6' : 'max-w-325 px-5 py-1 sm:px-10 sm:py-4',
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
        class="text-[8px] sm:text-[6px] md:text-[9px] text-gray-500 group-hover:text-primary uppercase tracking-[0.2em] sm:tracking-[0.3em] group-hover:tracking-[0.25em] sm:group-hover:tracking-[0.35em] whitespace-nowrap transition-all duration-700 delay-100 motion-reduce:transition-none"
      >
        Pocketing &amp; Accessories Ltd.
      </span>
    </a>

    <!-- <button
      type="button"
      :class="['menu-button', { 'is-open': menuOpen }, scrolled ? 'text-xs' : 'text-sm']"
      :aria-expanded="menuOpen"
      aria-controls="site-menu"
      @click="emit('toggleMenu')"
    >
      <i aria-hidden="true"><span /><span /></i>
      <span>{{ menuOpen ? t("close") : t("menu") }}</span>
    </button> -->

    <div class="ml-auto flex items-center gap-2 sm:gap-4">
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
      <!-- 'shrink-0' prevents the menu button from compressing on small devices -->
      <button
        type="button"
        :class="[
          'menu-button',
          { 'is-open': menuOpen },
          scrolled ? 'text-xs' : 'text-sm',
        ]"
        :aria-expanded="menuOpen"
        aria-controls="site-menu"
        @click="emit('toggleMenu')"
      >
        <i aria-hidden="true"><span /><span /></i>
        <span>{{ menuOpen ? t("close") : t("menu") }}</span>
      </button>
    </div>
  </header>
</template>
