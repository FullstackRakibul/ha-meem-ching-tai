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
 * `#milestones` lives here: the development path built only from dated facts,
 * drawn as a thread timeline. Scroll draws the gold thread over a dashed
 * ghost and each knot turns gold as the thread reaches it. No pinning.
 */
import WeavePoster from "~/components/landing/posters/WeavePoster.vue";
import LoomSeam from "~/components/ui/LoomSeam.vue";
import { setUniform, trackPresence, WOVEN_SHARE } from "~/composables/useLoomStage";
import { DUR, EASE, SCRUB } from "~/utils/motion";

const { t } = useLocale();
const section = ref<HTMLElement | null>(null);
const cloth = ref<HTMLElement | null>(null);
const timeline = ref<HTMLElement | null>(null);

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

/** Horizontal timeline from 1024px; read only when ScrollTrigger refreshes. */
const isRow = () => window.matchMedia("(min-width: 1024px)").matches;

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

  // Milestones: scroll draws the thread; knots turn gold as it reaches them.
  const line = timeline.value;
  if (!line) return;
  const knots = gsap.utils.toArray<HTMLElement>(".loom-timeline__knot", line);
  let marks: number[] = [];
  let draw: ReturnType<typeof gsap.fromTo> | undefined;

  // Layout reads happen here, on refresh only — never per scroll frame.
  const measure = () => {
    const row = isRow();
    const span = row ? line.offsetWidth : line.offsetHeight;
    marks = knots.map((knot) => {
      const item = knot.parentElement as HTMLElement;
      const at = row
        ? item.offsetLeft + knot.offsetLeft + knot.offsetWidth / 2
        : item.offsetTop + knot.offsetTop + knot.offsetHeight / 2;
      return span > 0 ? at / span : 0;
    });
  };
  // Class writes only, and only on change.
  const sync = () => {
    const p = draw?.progress() ?? 0;
    knots.forEach((knot, i) => {
      const reached = p >= (marks[i] ?? 1);
      if (knot.classList.contains("is-reached") !== reached) {
        knot.classList.toggle("is-reached", reached);
      }
    });
  };

  line.classList.add("is-live");
  draw = gsap.fromTo(
    line,
    { "--thread": 0 },
    {
      "--thread": 1,
      ease: EASE.scrub,
      onUpdate: sync,
      scrollTrigger: {
        trigger: line,
        // Vertical: start and end share one viewport line, so the drawn tip
        // rides 70% down the screen. Horizontal: drawn across as it passes.
        start: () => (isRow() ? "top 85%" : "top 70%"),
        end: () => (isRow() ? "top 45%" : "bottom 70%"),
        scrub: SCRUB,
        onRefresh: () => {
          measure();
          sync();
        },
      },
    }
  );
  measure();
  sync();

  return () => {
    line.classList.remove("is-live");
    knots.forEach((knot) => knot.classList.remove("is-reached"));
  };
});
</script>

<template>
  <section
    id="venture"
    ref="section"
    class="loom-night loom-grain loom-stats"
    data-chapter="stats"
  >
    <div class="loom-layer loom-wrap">
      <header class="loom-stats__header flex flex-col gap-6" data-reveal-block>
        <p class="loom-label loom-muted">
          <span class="loom-gold">04</span>{{ t("ventureEyebrow") }}
        </p>
        <h2 class="loom-display loom-display--l loom-measure">
          {{ t("ventureHeadline") }}
        </h2>
      </header>

      <div class="loom-stats__grid">
        <div class="loom-stats__list">
          <!-- Each cell reveals on its own, so the grid arrives in a short stagger. -->
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="loom-stats__cell loom-seam"
            data-reveal-block
          >
            <LoomSeam />
            <!-- Label first for assistive tech; the value is shown first visually. -->
            <dl class="loom-stats__body loom-seam__body">
              <dt class="loom-label">{{ stat.label }}</dt>
              <dd class="loom-stats__value loom-num order-first m-0">{{ stat.value }}</dd>
              <dd class="loom-body loom-muted m-0">{{ stat.desc }}</dd>
            </dl>
          </div>
        </div>

        <figure ref="cloth" class="m-0 flex flex-col gap-4">
          <WeavePoster data-loom-anchor="weave" />
          <figcaption class="loom-body loom-muted max-w-[52ch]">
            {{ t("weaveCaption") }}
          </figcaption>
        </figure>
      </div>

      <div id="milestones">
        <h3 class="loom-milestones__title loom-label loom-muted" data-reveal-block>
          {{ t("milestonesTitle") }}
        </h3>
        <div ref="timeline" class="loom-timeline">
          <span class="loom-timeline__ghost" aria-hidden="true" />
          <span class="loom-timeline__thread" aria-hidden="true" />
          <ol class="loom-milestones">
            <li v-for="m in milestones" :key="m.label">
              <!-- The knot stays outside the card, so the card's reveal never clips it. -->
              <span class="loom-timeline__knot" aria-hidden="true" />
              <div class="loom-milestones__card loom-seam" data-reveal-block>
                <LoomSeam />
                <div class="loom-milestones__body loom-seam__body">
                  <span class="loom-label loom-gold">{{ m.label }}</span>
                  <span class="loom-body-l">{{ m.text }}</span>
                </div>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
