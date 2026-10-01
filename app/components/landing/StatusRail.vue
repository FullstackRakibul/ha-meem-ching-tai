<!-- components/landing/StatusRail.vue -->
<script setup lang="ts">
/**
 * The OS status bar, as navigation. Shows the current chapter and page
 * progress; opens a list of every chapter. Solid white — chrome never blurs.
 * Desktop only (≥ 1024px); on smaller screens the menu does this job.
 *
 * Chapter tracking uses IntersectionObserver rather than GSAP, so it works
 * identically with reduced motion and before the motion engine loads.
 */
const { t } = useLocale();

const chapters = computed(() => [
  { id: "top", label: t("navHome") },
  { id: "studio", label: t("navIndex") },
  { id: "why-matters", label: t("navWhyMatters") },
  { id: "venture", label: t("navMilestones"), href: "#milestones" },
  { id: "factory", label: t("navFactory") },
  { id: "collections", label: t("navProducts") },
  { id: "sustainability", label: t("navSustainability") },
  { id: "partnership", label: t("navPartnership") },
  { id: "contact", label: t("navContact") },
]);

const active = ref("top");
const open = ref(false);
const bar = ref<HTMLElement | null>(null);
const wrap = ref<HTMLElement | null>(null);

const current = computed(() => {
  const index = chapters.value.findIndex((c) => c.id === active.value);
  return { index: Math.max(0, index), label: chapters.value[Math.max(0, index)]?.label ?? "" };
});

let observer: IntersectionObserver | null = null;

// Progress is a transform on one element; written straight to the style,
// with no reactive state, from the native scroll event Lenis also fires.
const onScroll = () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  bar.value?.style.setProperty("--progress", String(max > 0 ? window.scrollY / max : 0));
};

const onPointer = (e: PointerEvent) => {
  if (open.value && !wrap.value?.contains(e.target as Node)) open.value = false;
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape") open.value = false;
};

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.value = entry.target.id;
      }
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  for (const c of chapters.value) {
    const el = document.getElementById(c.id);
    if (el) observer.observe(el);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  document.addEventListener("pointerdown", onPointer);
  document.addEventListener("keydown", onKey);
  onScroll();
});

onBeforeUnmount(() => {
  observer?.disconnect();
  window.removeEventListener("scroll", onScroll);
  document.removeEventListener("pointerdown", onPointer);
  document.removeEventListener("keydown", onKey);
});
</script>

<template>
  <nav ref="wrap" class="loom-rail-status hidden lg:block" :aria-label="t('railLabel')">
    <ul v-show="open" id="loom-rail-list" class="loom-rail-status__list">
      <li v-for="(c, i) in chapters" :key="c.id">
        <a :href="c.href ?? `#${c.id}`" :aria-current="c.id === active ? 'true' : undefined" @click="open = false">
          <span class="loom-label text-gray-600">{{ String(i + 1).padStart(2, "0") }}</span>
          <span class="font-semibold">{{ c.label }}</span>
        </a>
      </li>
    </ul>

    <button
      type="button"
      class="loom-rail-status__button"
      :aria-expanded="open"
      aria-controls="loom-rail-list"
      :aria-label="`${t('railOpen')} — ${current.label}`"
      @click="open = !open"
    >
      <span class="loom-label">
        <span>SYS·{{ String(current.index + 1).padStart(2, "0") }}</span>
        <span class="font-bold">{{ current.label }}</span>
      </span>
      <span ref="bar" class="loom-rail-status__bar" aria-hidden="true"><i /></span>
      <UIcon name="i-heroicons-chevron-up-20-solid" class="h-4 w-4" :class="open ? '' : 'rotate-180'" />
    </button>
  </nav>
</template>
