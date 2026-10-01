<!-- components/landing/OriginPanel.vue -->
<script setup lang="ts">
/**
 * Scene 09 — Ply (night). The argument's conclusion: partnership.
 *
 * Two plies — Ha-Meem Group in navy, Ching Tai in gold — twist into one yarn,
 * once, when the scene arrives, then hold still. The positioning line is the
 * only place the word "supplier" appears on the site.
 */
import PlyPoster from "~/components/landing/posters/PlyPoster.vue";
import { setUniform, trackPresence } from "~/composables/useLoomStage";
import { DUR, EASE } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);
const yarn = ref<HTMLElement | null>(null);

const trustedBrands = ["H&M", "Zara", "Uniqlo", "C&A", "American Eagle"];

useScrollScene(section, (ctx) => {
  const { gsap, ScrollTrigger, mode, root } = ctx;
  revealBlocks(ctx);
  if (mode === "reduced" || !yarn.value) return;
  trackPresence(ScrollTrigger, root, "ply");

  const plies = { twist: 0 };
  gsap.to(plies, {
    twist: 1,
    duration: DUR.lg,
    ease: EASE.inout,
    onUpdate: () => setUniform("twist", plies.twist),
    scrollTrigger: { trigger: yarn.value, start: "top 80%", once: true },
  });
});
</script>

<template>
  <section
    id="partnership"
    ref="section"
    class="loom-night loom-grain loom-ply"
    data-chapter="ply"
  >
    <div class="loom-layer loom-wrap">
      <p class="loom-label loom-muted mb-8" data-reveal-block>
        <span class="loom-gold">09</span>{{ t("originEyebrow") }}
      </p>
      <h2 class="loom-display loom-display--xl" data-reveal-block>
        <span class="block">{{ t("originLineA") }}</span>
        <em class="loom-serif loom-gold block">{{ t("originLineB") }}</em>
      </h2>

      <figure ref="yarn" class="loom-ply__yarn m-0">
        <div class="relative h-full" data-loom-anchor="ply"><PlyPoster /></div>
        <figcaption class="loom-body loom-muted mt-4">
          {{ t("originPlyCaption") }}
        </figcaption>
      </figure>

      <ul class="loom-ply__facts loom-body-l">
        <li data-reveal-block>{{ t("originJv") }}</li>
        <li data-reveal-block>{{ t("originJobs") }}</li>
        <li data-reveal-block>{{ t("originStandards") }}</li>
      </ul>

      <div class="mt-16 flex flex-col gap-4" data-reveal-block>
        <p class="loom-label loom-muted">{{ t("footerTrustedBy") }}</p>
        <p class="loom-trusted text-xl font-bold">
          <span v-for="brand in trustedBrands" :key="brand">{{ brand }}</span>
        </p>
      </div>

      <div class="mt-16 flex flex-wrap gap-3">
        <a class="loom-cta" href="#contact">{{ t("originCta") }}</a>
        <a
          class="loom-ghost"
          href="https://wa.me/8801319320527"
          target="_blank"
          rel="noopener"
        >
          {{ t("footerWhatsapp") }}
        </a>
      </div>
    </div>
  </section>
</template>
