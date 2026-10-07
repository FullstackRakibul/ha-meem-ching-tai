<!-- components/landing/WhyMatters.vue -->
<script setup lang="ts">
/**
 * Scene 03 — The Short Thread (night). The site's signature move.
 *
 * The yarn's length stands for lead time. Pinned for 120% of a viewport, the
 * long import loop contracts — scrubbed to scroll — into one short straight
 * stitch between "Imported" and "Made in Ghorashal". The words never move;
 * only the thread does. No lead-time number is shown because none is
 * published: the claim is carried by the comparison, not by a statistic.
 *
 * Pinning is the one justified scroll-coupled scene besides the collections
 * theatre. It never intercepts the wheel — ScrollTrigger pins against the
 * real scroll position, so anchors and the scrollbar stay truthful.
 */
import { useElementVisibility } from "@vueuse/core";
import ShortThreadPoster from "~/components/landing/posters/ShortThreadPoster.vue";
import { setUniform, trackPresence } from "~/composables/useLoomStage";
import { EASE, SCRUB } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);

// The scroll hint fades in once the pinned stage is on screen.
const isVisible = useElementVisibility(stage);

const cards = computed(() => [
  { number: "01", title: t("why1Title"), text: t("why1Text") },
  { number: "02", title: t("why2Title"), text: t("why2Text") },
  { number: "03", title: t("why3Title"), text: t("why3Text") },
  { number: "04", title: t("why4Title"), text: t("why4Text") },
]);

useScrollScene(section, (ctx) => {
  const { gsap, ScrollTrigger, mode, root } = ctx;
  revealBlocks(ctx);
  if (mode === "reduced" || !stage.value) return;
  trackPresence(ScrollTrigger, root, "why");

  const thread = { morph: 0 };
  const pinned = mode === "full";
  gsap.to(thread, {
    morph: 1,
    ease: EASE.scrub,
    onUpdate: () => setUniform("morph", thread.morph),
    scrollTrigger: pinned
      ? { trigger: stage.value, start: "top top", end: "+=120%", pin: true, scrub: SCRUB }
      : { trigger: stage.value, start: "top 70%", end: "bottom 40%", scrub: SCRUB },
  });
  return () => setUniform("morph", 0);
});
</script>

<template>
  <section
    id="why-matters"
    ref="section"
    class="loom-night loom-grain"
    data-chapter="why"
  >
    <div ref="stage" class="loom-layer loom-wrap loom-why__stage">
      <header class="flex flex-col gap-6">
        <p class="loom-label loom-muted">
          <span class="loom-gold">03</span>{{ t("whyEyebrow") }}
        </p>
        <h2 class="loom-display loom-display--m max-w-[24ch]">{{ t("whyHeadline") }}</h2>
      </header>

      <div class="loom-why__band">
        <div class="loom-why__word loom-why__word--long">
          <p class="loom-display loom-display--m loom-muted">{{ t("whyLongLabel") }}</p>
          <p class="loom-body loom-muted max-w-[28ch]">{{ t("whyLongNote") }}</p>
        </div>
        <div class="loom-why__track" aria-hidden="true">
          <ShortThreadPoster />
        </div>
        <div class="loom-why__word loom-why__word--short">
          <p class="loom-display loom-display--m loom-gold">{{ t("whyShortLabel") }}</p>
          <p class="loom-body max-w-[28ch]">{{ t("whyShortNote") }}</p>
        </div>
      </div>

      <!--
        Scroll hint (desktop only). Lives inside the pinned stage, in the empty
        third grid row, so it's on screen while scrolling drives the thread.
      -->
      <div
        class="hidden items-center gap-3 self-end transition-opacity delay-800 duration-1000 motion-reduce:transition-none lg:flex"
        :class="isVisible ? 'opacity-100' : 'opacity-0'"
        aria-hidden="true"
      >
        <span class="h-px w-12 bg-(--navy-tint)" />
        <span class="text-[10px] font-medium uppercase tracking-widest text-(--muted)">
          Scroll to explore
        </span>
      </div>
    </div>

    <div class="loom-layer loom-wrap loom-why__cards">
      <article
        v-for="card in cards"
        :key="card.number"
        class="why-card"
        data-reveal-block
      >
        <!-- Seam: a running stitch just inside the edge. It runs on hover. -->
        <svg class="why-card__seam loom-gold" aria-hidden="true" focusable="false">
          <rect width="100%" height="100%" rx="8" />
        </svg>

        <!-- Hover lift lives here: GSAP owns the article's own transform. -->
        <div class="why-card__body">
          <p class="loom-label loom-gold">{{ card.number }}</p>
          <h3 class="text-xl font-bold">{{ card.title }}</h3>
          <p class="loom-body loom-muted">{{ card.text }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<style scoped>
/* Ensures the scrollbar is hidden for webkit browsers */
.scrollbar-none::-webkit-scrollbar {
  display: none;
}

/*
 * Card: a patch sewn onto the section's light ground. The fill IS the
 * section background (--night), so the cards read as stitched outlines on
 * the page rather than darker panels; only the hover state adds a tint.
 * Border and hover tint mix from `currentColor` (the section's text colour);
 * the seam takes its colour from `.loom-gold`.
 */
.why-card {
  position: relative;
  padding: clamp(22px, 2.2vw, 32px);
  border: 1px solid color-mix(in srgb, currentColor 14%, transparent);
  border-radius: 14px;
  background-color: var(--night);
  /* Colour only. The reveal animates this element's transform and opacity. */
  transition: background-color 0.4s var(--ease, ease),
    border-color 0.4s var(--ease, ease);
}

.why-card__seam {
  position: absolute;
  inset: 7px;
  width: calc(100% - 14px);
  height: calc(100% - 14px);
  overflow: visible;
  pointer-events: none;
  opacity: 0.3;
  transition: opacity 0.4s var(--ease, ease);
}

.why-card__seam rect {
  fill: none;
  stroke: currentColor;
  stroke-width: 1;
  stroke-linecap: round;
  stroke-dasharray: 7 6;
}

.why-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: transform 0.4s var(--ease, ease);
}

/* Hover only where a real pointer exists, so touch never leaves it stuck on. */
@media (hover: hover) {
  .why-card:hover {
    border-color: color-mix(in srgb, currentColor 26%, transparent);
    background-color: color-mix(in srgb, currentColor 3%, var(--night));
  }

  .why-card:hover .why-card__seam {
    opacity: 1;
  }

  .why-card:hover .why-card__seam rect {
    animation: why-seam-run 0.9s linear infinite;
  }

  .why-card:hover .why-card__body {
    transform: translateY(-2px);
  }
}

/* One dash plus one gap, so the loop has no visible jump. */
@keyframes why-seam-run {
  to {
    stroke-dashoffset: -13;
  }
}

@media (prefers-reduced-motion: reduce) {
  .why-card,
  .why-card__seam,
  .why-card__body {
    transition: none;
  }

  .why-card:hover .why-card__seam rect {
    animation: none;
  }

  .why-card:hover .why-card__body {
    transform: none;
  }
}
</style>
