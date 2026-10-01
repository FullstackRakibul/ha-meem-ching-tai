<!-- components/landing/ProductRail.vue -->
<script setup lang="ts">
/**
 * Scene 07 — Catalogue (day). Deliberately motionless: after the pinned
 * theatre, stillness is the edit. A native scroll-snap rail on small
 * screens (keyboard-scrollable, no drag JS), a plain grid on wide ones.
 */
defineProps<{
  title: string;
  items: Array<[string, string, string]>;
}>();

const { t } = useLocale();
</script>

<template>
  <section class="loom-day loom-catalogue" data-chapter="catalogue" aria-labelledby="catalogue-title">
    <div class="loom-wrap mb-8 flex flex-wrap items-end justify-between gap-4">
      <h2 id="catalogue-title" class="loom-display loom-display--m">{{ title }}</h2>
      <p class="loom-label loom-muted xl:hidden" aria-hidden="true">{{ t("catalogueHint") }} →</p>
    </div>

    <div class="loom-rail" tabindex="0" :aria-label="title">
      <article v-for="([name, meta, image], idx) in items" :key="`${name}-${idx}`">
        <figure>
          <img :src="image" :alt="name" loading="lazy" decoding="async" width="600" height="600" />
        </figure>
        <div class="flex justify-between gap-3 border-b border-(--line) py-3">
          <p class="font-semibold">{{ name }}</p>
          <p class="text-right text-gray-600">{{ meta }}</p>
        </div>
      </article>
    </div>
  </section>
</template>
