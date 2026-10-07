<!-- components/landing/SiteMenu.vue -->
<script setup lang="ts">
/**
 * The launcher. Hovering a chapter previews it on the right.
 *
 * The wavy WebGL preview is drawn by LoomStage into this box's rectangle
 * (`data-menu-preview`) — the page keeps a single WebGL context. The stacked
 * <img>s below are the designed fallback (reduced motion, no WebGL, lite
 * tier before WebGL starts): a plain crossfade, hidden by `html.loom-live`.
 * They also warm the cache for the stage's textures.
 *
 * Layout: the scroll area centres its list with `margin-block: auto`, not
 * `align-items: center`, so a list taller than the viewport starts at the
 * top and scrolls fully instead of overflowing upwards out of reach.
 */
import { setMenu } from "~/composables/useLoomStage";

const { t } = useLocale();

const props = defineProps<{
  menuOpen: boolean;
  navItems: Array<{ label: string; href: string; image: string }>;
}>();

const emit = defineEmits<{ (e: "closeMenu"): void }>();

const hoveredItem = ref<string | null>(null);
const navRef = ref<HTMLElement | null>(null);

watch(
  () => [props.menuOpen, hoveredItem.value] as const,
  ([open, image]) => setMenu(open, open ? image : null)
);

const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.menuOpen) emit("closeMenu");
};

// Focus follows the dialog: first link on open, the menu button on close.
watch(
  () => props.menuOpen,
  async (open, was) => {
    if (open) {
      document.addEventListener("keydown", onKey);
      await nextTick();
      navRef.value?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      document.removeEventListener("keydown", onKey);
      if (was) {
        document.querySelector<HTMLElement>('[aria-controls="site-menu"]')?.focus({ preventScroll: true });
      }
    }
  }
);

onBeforeUnmount(() => document.removeEventListener("keydown", onKey));
</script>

<template>
  <div
    id="site-menu"
    :class="[
      'site-menu fixed inset-0 z-70 flex h-dvh flex-col bg-white pt-(--header) text-(--navy) transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none',
      menuOpen ? 'translate-y-0' : '-translate-y-full',
    ]"
    aria-modal="true"
    role="dialog"
    :aria-label="t('menu')"
    :aria-hidden="!menuOpen"
    :inert="!menuOpen"
  >
    <div
      class="site-menu__nav flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto"
      data-lenis-prevent
    >
      <div
        class="mx-auto my-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-5 sm:px-6 lg:grid-cols-12 lg:gap-16 lg:px-12"
      >
        <nav
          ref="navRef"
          class="site-menu__list flex min-w-0 flex-col py-4 lg:col-span-7 lg:py-6"
          :aria-label="t('menu')"
        >
          <a
            v-for="(item, index) in navItems"
            :key="item.href"
            :href="item.href"
            class="group flex min-h-11 items-start gap-3 rounded-lg md:gap-6"
            @mouseenter="hoveredItem = item.image"
            @mouseleave="hoveredItem = null"
            @focus="hoveredItem = item.image"
            @blur="hoveredItem = null"
            @click="emit('closeMenu')"
          >
            <span
              class="loom-label mt-[0.6em] shrink-0 text-gray-600 transition-colors group-hover:text-(--navy)"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <span
              class="site-menu__label loom-display min-w-0 transition-transform duration-500 ease-out group-hover:translate-x-4 motion-reduce:transition-none"
            >
              {{ item.label }}
            </span>
          </a>
        </nav>

        <div
          class="site-menu__preview relative hidden h-[50svh] w-full overflow-hidden rounded-2xl lg:col-span-5 lg:block xl:h-[60svh]"
          data-menu-preview
        >
          <img
            v-for="item in navItems"
            :key="item.href"
            :src="item.image"
            alt=""
            loading="lazy"
            decoding="async"
            :class="[
              'absolute inset-0 h-full w-full object-cover transition-opacity duration-500',
              hoveredItem === item.image ? 'opacity-100' : 'opacity-0',
            ]"
          />
        </div>
      </div>
    </div>

    <div
      class="flex shrink-0 flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t border-(--line) px-5 py-3 text-sm text-gray-600 sm:px-6 lg:px-12 lg:py-5"
    >
      <span>{{ t("companyName") }}</span>
      <a
        href="#contact"
        class="inline-flex min-h-11 items-center font-semibold text-(--navy) hover:underline"
        @click="emit('closeMenu')"
      >
        {{ t("contactSupport") }}
      </a>
    </div>
  </div>
</template>

<style>
/* Sized from both axes so all seven fit a 1280×720 laptop without scrolling. */
.site-menu__label {
  font-size: clamp(26px, min(7vw, 8svh), 64px);
  overflow-wrap: anywhere;
}

.site-menu__list {
  gap: clamp(2px, 1.2svh, 14px);
}

.site-menu__nav {
  scrollbar-width: thin;
  scrollbar-color: var(--line) transparent;
}
</style>
