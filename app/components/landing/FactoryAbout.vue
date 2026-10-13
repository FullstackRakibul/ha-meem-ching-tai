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

/** The opening window, as a share of the frame: 56% wide, 64% tall. */
const WINDOW = { x: 0.56, y: 0.64 };

useScrollScene(section, (ctx) => {
  const { gsap, mode } = ctx;
  revealBlocks(ctx);
  const el = frame.value;
  const img = el?.querySelector("img");
  const grid = el?.parentElement;
  if (mode === "reduced" || !el || !img || !grid) return;

  // The one move: the photograph opens out of a centred window, scrubbed.
  // [motion] Transforms only (was a clip-path inset): the frame scales up
  // from the window while the photo counter-scales by the exact inverse, so
  // the picture never distorts and the crop matches the old inset(18% 22%).
  // The grid is the trigger — its top is the frame's top and it is never
  // transformed, so start/end measure the same as before.
  const open = { p: 0 };
  const render = () => {
    const sx = WINDOW.x + (1 - WINDOW.x) * open.p;
    const sy = WINDOW.y + (1 - WINDOW.y) * open.p;
    gsap.set(el, { scaleX: sx, scaleY: sy });
    gsap.set(img, { scaleX: 1 / sx, scaleY: 1 / sy });
  };
  render();
  gsap.to(open, {
    p: 1,
    ease: EASE.scrub,
    onUpdate: render,
    scrollTrigger: { trigger: grid, start: "top 90%", end: "top 30%", scrub: SCRUB },
  });
  return () => gsap.set([el, img], { clearProps: "transform" });
});
</script>

<template>
  <section
    id="factory"
    ref="section"
    class="loom-day loom-factory"
    data-chapter="factory"
  >
    <div class="loom-dawn" aria-hidden="true" />

    <div class="loom-wrap">
      <!-- [spacing] No pt: the dawn band above is this section's top space.
           [type] Chapter title: --xl → --l, the one class for full-row h2s. -->
      <header class="loom-head" data-reveal-block>
        <p class="loom-label loom-muted"><span>05</span>{{ t("factoryEyebrow") }}</p>
        <h2 class="loom-display loom-display--l">{{ t("factoryTitle") }}</h2>
        <p class="loom-body-l loom-muted max-w-[52ch]">{{ t("factorySite") }}</p>
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
            <span class="loom-label"
              >{{ t("factoryPointLabel") }} {{ String(i + 1).padStart(2, "0") }}</span
            >
            <div class="flex flex-col gap-2">
              <p class="loom-card-title">{{ point.title }}</p>
              <p class="loom-body loom-muted">{{ point.text }}</p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>
