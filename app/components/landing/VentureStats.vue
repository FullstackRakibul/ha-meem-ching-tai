<!-- components/landing/VentureStats.vue -->
<script setup lang="ts">
/**
 * Scene 04 — Telemetry (night). The yarn becomes cloth.
 *
 * A 64 × 32 plain-weave grid fills pick by pick, row by row, to exactly 25%:
 * 500,000 yd of monthly output against 2M yd of future capacity. The rest
 * stays ghosted — capacity still to come. A caption states the scale, so
 * the picture is never read as more than it is. Numbers are plain text and
 * never count up.
 *
 * `#milestones` lives here: the development path built only from dated facts.
 */
import WeavePoster from "~/components/landing/posters/WeavePoster.vue";
import { setUniform, trackPresence, WOVEN_SHARE } from "~/composables/useLoomStage";
import { DUR, EASE } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);
const cloth = ref<HTMLElement | null>(null);

const stats = computed(() => [
  { value: "Tk 100 crore", label: t("stat1Label"), desc: t("stat1Desc") },
  { value: "500,000", label: t("stat2Label"), desc: t("stat2Desc") },
  { value: "2M", label: t("stat3Label"), desc: t("stat3Desc") },
  { value: "12,000", label: t("stat4Label"), desc: t("stat4Desc") },
  { value: "$9M", label: t("stat5Label"), desc: t("stat5Desc") },
  { value: "Zero", label: t("stat6Label"), desc: t("stat6Desc") },
  { value: "25%", label: t("stat7Label"), desc: t("stat7Desc") },
]);

const milestones = computed(() => [
  { label: t("milestone1Label"), text: t("milestone1Text") },
  { label: t("milestone2Label"), text: t("milestone2Text") },
  { label: t("milestone3Label"), text: t("milestone3Text") },
]);

useScrollScene(section, (ctx) => {
  const { gsap, ScrollTrigger, mode, root } = ctx;
  revealBlocks(ctx);
  if (mode === "reduced" || !cloth.value) return;
  trackPresence(ScrollTrigger, root, "stats");

  // The one move: the woven share fills, once, when the cloth comes into view.
  const loom = { woven: 0 };
  gsap.to(loom, {
    woven: WOVEN_SHARE,
    duration: DUR.lg,
    ease: EASE.out,
    onUpdate: () => setUniform("woven", loom.woven),
    scrollTrigger: { trigger: cloth.value, start: "top 75%", once: true },
  });
});
</script>

<template>
  <section id="venture" ref="section" class="loom-night loom-grain loom-stats" data-chapter="stats">
    <div class="loom-layer loom-wrap">
      <header class="mb-12 flex flex-col gap-6" data-reveal-block>
        <p class="loom-label loom-muted"><span class="loom-gold">04</span>{{ t("ventureEyebrow") }}</p>
        <h2 class="loom-display loom-display--l loom-measure">{{ t("ventureHeadline") }}</h2>
      </header>

      <div class="loom-stats__grid">
        <dl class="loom-stats__list" data-reveal-block>
          <div v-for="stat in stats" :key="stat.label">
            <!-- Label first for assistive tech; the value is shown first visually. -->
            <dt class="loom-label">{{ stat.label }}</dt>
            <dd class="loom-stats__value loom-num order-first m-0">{{ stat.value }}</dd>
            <dd class="loom-body loom-muted m-0">{{ stat.desc }}</dd>
          </div>
        </dl>

        <figure ref="cloth" class="m-0 flex flex-col gap-4">
          <WeavePoster data-loom-anchor="weave" />
          <figcaption class="loom-body loom-muted max-w-[52ch]">{{ t("weaveCaption") }}</figcaption>
        </figure>
      </div>

      <div id="milestones">
        <h3 class="loom-label loom-muted mt-24" data-reveal-block>{{ t("milestonesTitle") }}</h3>
        <ol class="loom-milestones mt-6">
          <li v-for="m in milestones" :key="m.label" data-reveal-block>
            <span class="loom-label loom-gold">{{ m.label }}</span>
            <span class="loom-body-l">{{ m.text }}</span>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
