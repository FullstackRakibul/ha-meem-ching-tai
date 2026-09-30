<!-- components/landing/FactoryAbout.vue -->
<script setup lang="ts">
/**
 * Scene 05 — Dawn (night → beige). The lights come on in Ghorashal.
 *
 * A gradient band carries the page from night to day; it is static, so the
 * transition reads the same with or without motion. The stage is covered
 * (day sections sit above it) and stops rendering. The one move: the
 * factory photograph opens out of a woven-cloth-sized frame, scrubbed.
 */
import { EASE, SCRUB } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);
const frame = ref<HTMLElement | null>(null);

const points = computed(() => [
  { title: t("factory1Title"), text: t("factory1Text") },
  { title: t("factory2Title"), text: t("factory2Text") },
  { title: t("factory3Title"), text: t("factory3Text") },
]);

useScrollScene(section, (ctx) => {
  const { gsap, mode } = ctx;
  revealBlocks(ctx);
  if (mode === "reduced" || !frame.value) return;
  gsap.fromTo(
    frame.value,
    { clipPath: "inset(18% 22% 18% 22%)" },
    {
      clipPath: "inset(0% 0% 0% 0%)",
      ease: EASE.scrub,
      scrollTrigger: { trigger: frame.value, start: "top 90%", end: "top 30%", scrub: SCRUB },
    }
  );
});
</script>

<template>
  <section id="factory" ref="section" class="loom-day loom-factory" data-chapter="factory">
    <div class="loom-dawn" aria-hidden="true" />

    <div class="loom-wrap">
      <header class="flex flex-col gap-6 pt-16" data-reveal-block>
        <p class="loom-label loom-muted"><span>05</span>{{ t("factoryEyebrow") }}</p>
        <h2 class="loom-display loom-display--xl">{{ t("factoryTitle") }}</h2>
        <p class="loom-body-l loom-muted max-w-[44ch]">{{ t("factorySite") }}</p>
      </header>

      <div class="loom-factory__grid">
        <div ref="frame" class="loom-factory__image">
          <img
            src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai03.jpeg"
            :alt="t('factoryImageAlt')"
            loading="lazy"
            decoding="async"
            width="1200"
            height="900"
          />
        </div>

        <ol class="loom-factory__points">
          <li v-for="(point, i) in points" :key="point.title" data-reveal-block>
            <span class="loom-label">{{ t("factoryPointLabel") }} {{ String(i + 1).padStart(2, "0") }}</span>
            <div class="flex flex-col gap-2">
              <p class="text-lg font-bold">{{ point.title }}</p>
              <p class="loom-body loom-muted">{{ point.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
