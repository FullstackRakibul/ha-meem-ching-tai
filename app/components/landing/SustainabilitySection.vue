<!-- components/landing/SustainabilitySection.vue -->
<script setup lang="ts">
/**
 * Scene 08 — Dusk (beige → dusk navy). Merges the former SustainabilityCTA:
 * one sustainability scene, one move.
 *
 * The sun is the 16.9 MW solar plant and the rig's key light: it rises,
 * scrubbed to scroll, and brightens the scene as it goes. Beneath it, water
 * particles run a closed loop through the caustic recovery node and never
 * leave — zero discharge by 2030. The loop is the page's only idle motion
 * and runs only while this section is on screen.
 */
import SunWaterPoster from "~/components/landing/posters/SunWaterPoster.vue";
import { setUniform, trackPresence } from "~/composables/useLoomStage";
import { EASE, SCRUB } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);
const scene = ref<HTMLElement | null>(null);

const stats = computed(() => [
  { value: t("sustainStat1Value"), label: t("sustainStat1Label"), desc: t("sustainStat1Desc") },
  { value: t("sustainStat2Value"), label: t("sustainStat2Label"), desc: t("sustainStat2Desc") },
]);

useScrollScene(section, (ctx) => {
  const { gsap, ScrollTrigger, mode } = ctx;
  revealBlocks(ctx);
  if (mode === "reduced" || !scene.value) return;
  trackPresence(ScrollTrigger, scene.value, "dusk");

  const sky = { sun: 0 };
  gsap.to(sky, {
    sun: 1,
    ease: EASE.scrub,
    onUpdate: () => setUniform("sun", sky.sun),
    scrollTrigger: { trigger: scene.value, start: "top 80%", end: "center center", scrub: SCRUB },
  });
});
</script>

<template>
  <section id="sustainability" ref="section" class="loom-night loom-night--dusk" data-chapter="dusk">
    <div class="loom-dusk-in" aria-hidden="true" />

    <div ref="scene" class="loom-grain loom-dusk relative">
      <div class="loom-layer loom-wrap loom-dusk__grid">
        <div class="flex flex-col gap-8">
          <header class="flex flex-col gap-6" data-reveal-block>
            <p class="loom-label loom-muted"><span class="loom-gold">08</span>{{ t("sustainEyebrow") }}</p>
            <h2 class="loom-display loom-display--l loom-measure">{{ t("sustainHeadline") }}</h2>
          </header>

          <div class="loom-dusk__stats">
            <article v-for="stat in stats" :key="stat.label" data-reveal-block>
              <p class="loom-stats__value loom-gold">{{ stat.value }}</p>
              <p class="loom-label">{{ stat.label }}</p>
              <p class="loom-body loom-muted">{{ stat.desc }}</p>
            </article>
          </div>

          <a class="loom-ghost self-start" href="#milestones">
            {{ t("sustainCta") }}
            <UIcon name="i-heroicons-arrow-up-right-20-solid" class="h-4 w-4" />
          </a>
        </div>

        <div class="loom-dusk__figure" data-loom-anchor="dusk">
          <SunWaterPoster />
        </div>
      </div>
    </div>
  </section>
</template>
