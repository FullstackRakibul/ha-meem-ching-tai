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
 */
import { setMenu } from "~/composables/useLoomStage";

const { t } = useLocale();

const props = defineProps<{
  menuOpen: boolean;
  navItems: Array<{ label: string; href: string; image: string }>;
}>();

const emit = defineEmits<{ (e: "closeMenu"): void }>();

const hoveredItem = ref<string | null>(null);

watch(
  () => [props.menuOpen, hoveredItem.value] as const,
  ([open, image]) => setMenu(open, open ? image : null)
);
</script>

<template>
  <div
    id="site-menu"
    :class="[
      'site-menu fixed inset-0 z-50 flex flex-col bg-white pt-(--header) text-(--navy) transition-transform duration-700 ease-[cubic-bezier(0.76,0,0.24,1)]',
      menuOpen ? 'translate-y-0' : '-translate-y-full',
    ]"
    aria-modal="true"
    role="dialog"
    :aria-hidden="!menuOpen"
    :inert="!menuOpen"
  >
    <div
      class="site-menu__nav flex w-full flex-1 items-center overflow-x-hidden overflow-y-auto"
      data-lenis-prevent
    >
      <div
        class="mx-auto grid w-full max-w-350 grid-cols-1 items-center gap-8 px-6 lg:grid-cols-12 lg:gap-16 lg:px-12"
      >
        <nav
          class="flex flex-col gap-4 py-10 lg:col-span-7 lg:gap-6"
          :aria-label="t('menu')"
        >
          <a
            v-for="(item, index) in navItems"
            :key="item.href"
            :href="item.href"
            class="group flex items-start gap-4 md:gap-6"
            @mouseenter="hoveredItem = item.image"
            @mouseleave="hoveredItem = null"
            @focus="hoveredItem = item.image"
            @blur="hoveredItem = null"
            @click="emit('closeMenu')"
          >
            <span
              class="loom-label mt-2 text-gray-600 transition-colors group-hover:text-(--navy) md:mt-4"
            >
              {{ String(index + 1).padStart(2, "0") }}
            </span>
            <span
              class="loom-display text-4xl transition-transform duration-500 ease-out group-hover:translate-x-4 sm:text-5xl md:text-6xl"
            >
              {{ item.label }}
            </span>
          </a>
        </nav>

        <div
          class="site-menu__preview relative hidden h-[50vh] w-full overflow-hidden rounded-2xl lg:col-span-5 lg:block xl:h-[60vh]"
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
      class="flex shrink-0 flex-col items-center justify-between gap-2 border-t border-(--line) p-6 text-sm text-gray-600 sm:flex-row lg:px-12 lg:py-8"
    >
      <span>{{ t("companyName") }}</span>
      <a
        href="#contact"
        class="font-semibold text-(--navy) hover:underline"
        @click="emit('closeMenu')"
      >
        {{ t("contactSupport") }}
      </a>
    </div>
  </div>
</template>
