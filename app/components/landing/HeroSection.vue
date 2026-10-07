<!-- components/landing/HeroSection.vue -->
<script setup lang="ts">
/**
 * Scene 01 — Boot (night).
 *
 * The headline is static HTML at first paint: it is the LCP element, never
 * the canvas. The one move: loose cotton fibres spin into a single yarn,
 * once (1.6s), then the scene holds still. The yarn follows the long import
 * loop — the status quo the next scene shortens.
 */
import ThreadPoster from "~/components/landing/posters/ThreadPoster.vue";
import { setUniform, trackPresence } from "~/composables/useLoomStage";
import { DUR, EASE } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);

useScrollScene(section, ({ gsap, ScrollTrigger, mode, root }) => {
  if (mode === "reduced") return;
  trackPresence(ScrollTrigger, root, "boot");
  const yarn = { spin: 0 };
  gsap.to(yarn, {
    spin: 1,
    duration: DUR.xl,
    ease: EASE.inout,
    delay: 0.2,
    onUpdate: () => setUniform("spin", yarn.spin),
  });
});
</script>

<template>
  <section id="top" ref="section" class="loom-night loom-grain loom-hero" data-chapter="boot">
    <div class="loom-glow" aria-hidden="true" />
    <ThreadPoster />

    <div class="loom-layer loom-wrap loom-hero__inner">
      <div class="loom-hero__copy">
        <!-- <p class="loom-label loom-muted">
          <span class="loom-gold">01</span>{{ t("heroEyebrow") }}
        </p> -->
        <h1 class="loom-display loom-display--xl">
          <span class="block">{{ t("heroTitleA") }}</span>
          <em class="loom-serif loom-gold block">{{ t("heroTitleB") }}</em>
        </h1>
        <p class="loom-body-l loom-muted max-w-[52ch]">{{ t("heroLede") }}</p>
        <div class="flex flex-wrap gap-3">
          <a class="loom-cta" href="#collections">
            {{ t("heroCta") }}
            <UIcon name="i-heroicons-arrow-down-right-20-solid" class="h-4 w-4" />
          </a>
          <a class="loom-ghost" href="#why-matters">{{ t("heroSecondaryCta") }}</a>
        </div>
      </div>

      <!-- <div class="loom-hero__foot loom-label loom-muted">
        <span>{{ t("heroLocation") }}</span>
        <span>{{ t("heroDivision") }}</span>
      </div> -->
    </div>
  </section>
</template>