<!-- components/landing/IntroSection.vue -->
<script setup lang="ts">
/**
 * Scene 02 — Index (night). The product lines as an OS process table.
 * Deliberately still: the yarn from the boot scene holds in place behind it.
 * Only motion: copy blocks wipe in as they reach the reading area.
 */
import { trackPresence } from "~/composables/useLoomStage";

defineProps<{ servicePoints: string[] }>();

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);

useScrollScene(section, (ctx) => {
  if (ctx.mode !== "reduced") trackPresence(ctx.ScrollTrigger, ctx.root, "index");
  revealBlocks(ctx);
});
</script>

<template>
  <section id="studio" ref="section" class="loom-night loom-grain loom-index" data-chapter="index">
    <div class="loom-layer loom-wrap loom-index__grid">
      <div class="flex flex-col gap-8" data-reveal-block>
        <p class="loom-label loom-muted">
          <span class="loom-gold">02</span>{{ t("navIndex") }}
        </p>
        <h2 class="loom-display loom-display--m">{{ t("introTitle") }}</h2>
        <p class="loom-body loom-muted max-w-[52ch]">{{ t("introBody") }}</p>
        <a class="loom-ghost self-start" href="#why-matters">{{ t("introCta") }}</a>
        <div class="loom-plate mt-4 hidden aspect-4/3 lg:block">
          <img src="../../assets/img/denim-pocket.png" :alt="t('introImageAlt')" loading="lazy" decoding="async"
            width="800" height="600" />
        </div>
      </div>

      <div data-reveal-block>
        <p class="loom-label loom-muted mb-4">{{ t("introTableLabel") }}</p>
        <ol class="loom-table loom-body-l">
          <li v-for="(point, i) in servicePoints" :key="i">
            <span class="loom-label loom-gold">{{ String(i + 1).padStart(2, "0") }}</span>
            <span>{{ point }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>