<script setup>
import denimToolBelt from "~/assets/img/hctpal-section-image-00005.jpg";
import denimPocketWall from "~/assets/img/hctpal-section-image-00006.jpg";

const { t } = useLocale();

const facilitySpecs = computed(() => [
  { label: t('footerSpecLocationLabel'), value: t('footerSpecLocationValue') },
  { label: t('footerSpecLeadLabel'), value: t('footerSpecLeadValue') },
  { label: t('footerSpecFloorsLabel'), value: t('footerSpecFloorsValue') },
]);

const footerBlocks = computed(() => [
  { label: t('footerFactoryHq'), lines: [t('footerFactoryHqValue')] },
  { label: t('footerHeadOffice'), lines: [t('footerHeadOfficeValue')] },
  { label: t('footerContactLabel'), lines: ['+880 131 9320527'], email: 'info@hameemchingtai.com' },
]);

const trustedBrands = ["H&M", "Zara", "Uniqlo", "C&A", "American Eagle"];

/**
 * Asymmetric swap.
 *
 * Both columns occupy fixed grid cells for the whole section — the plate in
 * column 2, the copy in column 1 — and both are pinned to the same grid row,
 * so the row (and the sticky container beneath the plate) is as tall as the
 * copy column's full two-section length. The "swap" is a pure transform:
 * each column translates one column-plus-gutter along X, so they trade
 * sides without ever changing grid placement.
 *
 * That distinction matters twice over. Animating `col-start` cannot tween —
 * the browser relayouts and the element teleports. And `position: sticky`
 * only tracks vertical scroll offset, not which column an element visually
 * occupies, so the plate stays sticky (and pinned on screen) THROUGH the
 * swap — it doesn't need to un-stick to slide sideways. The reader actually
 * sees "image now on the left, second section reading on the right" as a
 * held composition, not a flash mid-scroll. It un-pins on its own, with no
 * manual toggling, once the shared row scrolls past — ordinary sticky
 * release.
 */
const tripwire = ref(null);
const plateRef = ref(null);
const hasSwapped = ref(false);

/** Desktop-only behaviour; below `lg` the layout is a plain vertical stack. */
const isDesktop = ref(false);

/**
 * Travel distance in px: one column plus one gutter. Measured rather than
 * assumed, because the grid is asymmetric (1.05fr / 0.95fr) and the gutter is
 * a clamp() — neither is knowable from a Tailwind class alone.
 */
const travel = ref(0);

const gridRef = ref(null);

const measure = () => {
  if (!plateRef.value) return;
  // `offsetLeft` is a layout-box quantity — it ignores CSS transforms
  // entirely (transforms are paint-time only). That matters here because
  // `measure` re-runs on every Lenis scroll frame: reading
  // `getBoundingClientRect()` instead would, once the swap has applied its
  // own translateX, measure the plate's already-shifted paint position as
  // if it were the untransformed one, corrupting `travel` a little more on
  // every frame until the two columns drift into overlapping. `offsetLeft`
  // (relative to `gridRef`, its offsetParent — `position: relative` on the
  // grid establishes that) always reports the static column-2 position,
  // transform or not.
  travel.value = Math.round(plateRef.value.offsetLeft);
};

let stopLenis;
let observer;
let resizeObserver;
let mq;
let onMqChange;

onMounted(async () => {
  mq = window.matchMedia("(min-width: 1024px)");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  isDesktop.value = mq.matches;
  onMqChange = (e) => {
    isDesktop.value = e.matches;
    measure();
  };
  mq.addEventListener("change", onMqChange);

  await nextTick();
  measure();

  // Reduced motion: land on the final composition immediately, no animation
  // and no scroll subscription at all.
  if (reduced) {
    hasSwapped.value = true;
    return;
  }

  // The plate's width is viewport-relative and its image loads late; both
  // change the travel distance. Re-measure whenever the box actually changes.
  resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(gridRef.value);

  if (!("IntersectionObserver" in window) || !tripwire.value) {
    hasSwapped.value = true;
    return;
  }

  // IntersectionObserver is driven by the compositor, not the scroll thread,
  // so it fires correctly under Lenis without any scroll subscription. Lenis
  // is only consulted below, to keep the measurement in step with its rAF.
  observer = new IntersectionObserver(
    ([entry]) => {
      // Latch: once swapped it stays swapped, so scrolling back up doesn't
      // send the columns sliding past each other repeatedly.
      if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
        hasSwapped.value = true;
        observer?.disconnect();
        observer = null;
      }
    },
    { rootMargin: "0px 0px -45% 0px", threshold: 0 }
  );
  observer.observe(tripwire.value);

  // Lenis transforms scroll position on its own rAF loop. Sampling the box on
  // that same loop keeps `travel` correct across momentum and resize-during-
  // scroll; without it a mid-scroll resize would leave a stale offset.
  const { $lenis } = useNuxtApp();
  if ($lenis) {
    stopLenis = $lenis.on("scroll", measure);
  }
});

onBeforeUnmount(() => {
  stopLenis?.();
  observer?.disconnect();
  resizeObserver?.disconnect();
  mq?.removeEventListener("change", onMqChange);
  stopLenis = observer = resizeObserver = null;
});

/** Copy slides right (+travel); plate slides left (−travel). Desktop only. */
const copyShift = computed(() =>
  isDesktop.value && hasSwapped.value
    ? `translate3d(${travel.value}px,0,0)`
    : "translate3d(0,0,0)"
);
const plateShift = computed(() =>
  isDesktop.value && hasSwapped.value
    ? `translate3d(-${travel.value}px,0,0)`
    : "translate3d(0,0,0)"
);
</script>

<template>
  <footer class="relative flex flex-col">
    <!-- GROUP 1: Standard Document Flow -->
    <!-- Solid background masks the sticky footer sitting underneath -->
    <!--
      No `overflow-hidden` here: it would establish a scroll-container
      context for the sticky plate below and silently degrade its
      `position: sticky` to static. The texture SVG's fill is already
      bounded to its own <rect>, so nothing needs clipping.
    -->
    <div class="relative z-10 bg-(--paper)">
      <!-- Garment-tool line-art texture, tiled behind the editorial column -->
      <svg class="pointer-events-none absolute inset-0 h-full w-full text-(--brown) opacity-[0.055]" aria-hidden="true"
        focusable="false">
        <defs>
          <pattern id="hctpalWorkbook" width="240" height="240" patternUnits="userSpaceOnUse"
            patternTransform="rotate(-8)">
            <!-- sewing needle + trailing thread -->
            <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 20 L74 62" />
              <ellipse cx="27.5" cy="24.5" rx="3.6" ry="2.1" transform="rotate(39 27.5 24.5)" />
              <path d="M74 62 q9 5 4 12 t-11 5 q-7 -1 -5 -8" />
            </g>

            <!-- tailor's scissors -->
            <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round"
              transform="translate(150 26) rotate(24)">
              <path d="M0 0 L34 30" />
              <path d="M14 0 L-20 30" />
              <circle cx="38.5" cy="33.5" r="5" />
              <circle cx="-24.5" cy="33.5" r="5" />
              <circle cx="7" cy="13" r="1.5" />
            </g>

            <!-- knit / purl stitch rows -->
            <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round">
              <path d="M12 132 q11 -19 22 0 q11 19 22 0 q11 -19 22 0 q11 19 22 0" />
              <path d="M12 152 q11 -19 22 0 q11 19 22 0 q11 -19 22 0 q11 19 22 0" />
            </g>

            <!-- ball of yarn with loose strand -->
            <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round">
              <circle cx="176" cy="150" r="22" />
              <path d="M158 138 q18 12 36 24" />
              <path d="M156 152 q20 8 40 -6" />
              <path d="M166 170 q12 -20 26 -30" />
              <path d="M197 158 q16 10 8 26 t-24 10" />
            </g>

            <!-- bobbin of thread -->
            <g fill="none" stroke="currentColor" stroke-width="1.15" stroke-linecap="round" stroke-linejoin="round">
              <path d="M44 196 h34 M44 232 h34" />
              <path d="M52 196 v36 M70 196 v36" />
              <path d="M52 206 h18 M52 214 h18 M52 222 h18" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hctpalWorkbook)" />
      </svg>

      <div ref="gridRef"
        class="relative mx-auto grid max-w-360 grid-cols-1 items-start gap-y-14 px-[max(22px,4vw)] py-[clamp(90px,14vw,220px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-x-[clamp(48px,6vw,120px)] lg:gap-y-0">
        <!-- LEFT (pre-swap): editorial column, flows with the document -->
        <div
          class="order-2 flex flex-col gap-23 border-l border-(--line) pl-6 will-change-transform lg:order-0 lg:col-start-1 lg:row-start-1 lg:gap-[clamp(120px,18vw,300px)] lg:pl-[clamp(24px,3.4vw,60px)] lg:transition-transform lg:duration-900 lg:ease-[cubic-bezier(0.16,1,0.3,1)]"
          :style="{ transform: copyShift }">
          <section id="visit" class="flex max-w-[46ch] flex-col items-start gap-5.5" data-reveal>
            <p
              class="m-0 flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-(--muted)">
              <span class="font-serif text-[13px] tracking-[0.02em] text-(--rust)">01</span>
              {{ t('footerVisitEyebrow') }}
            </p>
            <h2
              class="m-0 font-serif text-[clamp(30px,3.3vw,58px)] font-normal leading-[1.03] tracking-[-0.035em] text-(--ink)">
              {{ t('footerVisitTitle') }}
            </h2>
            <p class="m-0 max-w-[40ch] text-sm leading-[1.65] text-(--brown)">
              {{ t('footerVisitBody') }}
            </p>

            <!-- Ruled docket — reads like a tailor's order sheet -->
            <dl class="mt-1 grid w-full max-w-100 border-t border-(--line)">
              <div v-for="spec in facilitySpecs" :key="spec.label"
                class="flex justify-between gap-5 border-b border-(--line) py-2.75">
                <dt class="text-[10px] font-semibold uppercase tracking-[0.09em] text-(--muted)">
                  {{ spec.label }}
                </dt>
                <dd class="m-0 text-right text-xs text-(--brown)">{{ spec.value }}</dd>
              </div>
            </dl>

            <a class="tiny-link" href="#contact">
              <span>{{ t('footerVisitCta') }}</span>
              <i>
                <svg width="12" height="12" viewBox="0 0 20 20">
                  <path d="M3 10h13M11 5l5 5-5 5" />
                </svg>
              </i>
            </a>
          </section>

          <!-- 50% tripwire: fires the swap once the reader crosses this line -->
          <div ref="tripwire" class="pointer-events-none h-px -my-11.5 lg:-my-[clamp(60px,9vw,150px)]"
            aria-hidden="true"></div>

          <section id="contact" class="flex max-w-[46ch] flex-col items-start gap-5.5" data-reveal>
            <p
              class="m-0 flex items-baseline gap-3 text-[11px] font-semibold uppercase tracking-[0.11em] text-(--muted)">
              <span class="font-serif text-[13px] tracking-[0.02em] text-(--rust)">02</span>
              {{ t('footerContactEyebrow') }}
            </p>
            <h2
              class="m-0 font-serif text-[clamp(42px,5.6vw,96px)] font-normal uppercase leading-[0.94] tracking-[-0.055em] text-(--ink)">
              {{ t('footerContactTitle') }}
            </h2>
            <p class="m-0 max-w-[40ch] text-sm leading-[1.65] text-(--brown)">
              {{ t('footerContactBody') }}
            </p>

            <figure class="mt-1.5 w-full max-w-82.5">
              <img :src="denimPocketWall" alt="Denim pocket wall organiser holding workshop tools" loading="lazy"
                decoding="async"
                class="block aspect-4/5 w-full rounded-[2px_2px_34%_34%/2px_2px_12%_12%] bg-(--panel) object-cover object-center" />
              <figcaption class="mt-2.75 text-[10.5px] leading-normal tracking-[0.03em] text-(--muted)">
                {{ t('footerInsetCaption') }}
              </figcaption>
            </figure>

            <a class="tiny-link" href="mailto:info@hameemchingtai.com">
              <span>{{ t('footerContactCta') }}</span>
              <i>
                <svg width="12" height="12" viewBox="0 0 20 20">
                  <path d="M3 10h13M11 5l5 5-5 5" />
                </svg>
              </i>
            </a>
          </section>
        </div>

        <!--
          RIGHT (pre-swap): sticky plate. `position: sticky` only cares about
          vertical scroll position, not which side of the grid it visually
          sits on — so it stays sticky through the whole swap. The tripwire
          only ever changes the `transform`, gliding it across to the left
          while it remains pinned, so the reader actually sees "image left,
          second section reading on the right" instead of the image un-
          sticking and scrolling away the instant it swaps. It releases
          naturally, with no manual toggling, once the shared grid row (as
          tall as the copy column) scrolls past.
        -->
        <aside ref="plateRef"
          class="order-1 will-change-transform lg:order-0 lg:sticky lg:top-[calc(var(--header)+48px)] lg:col-start-2 lg:row-start-1 lg:transition-transform lg:duration-900 lg:ease-[cubic-bezier(0.16,1,0.3,1)]"
          :style="{ transform: plateShift }">
          <figure class="m-0 border border-(--line) bg-(--paper-soft) p-[clamp(14px,1.5vw,24px)]">
            <img :src="denimToolBelt" alt="Denim tool belt cut from a single jean leg, fitted on a tailor's mannequin"
              loading="lazy" decoding="async"
              class="block h-[min(58vh,460px)] w-full rounded-[180px_180px_4px_4px/120px_120px_4px_4px] bg-(--panel) object-cover object-center lg:h-[min(64vh,620px)]" />
            <figcaption
              class="mt-4 flex flex-col gap-1.25 border-t border-(--line) pt-3.25 text-[10.5px] leading-normal tracking-[0.03em] text-(--muted)">
              <span class="text-[10px] font-semibold uppercase tracking-[0.11em] text-(--rust)">{{ t('footerPlateLabel') }}</span>
              {{ t('footerPlateCaption') }}
            </figcaption>
          </figure>
        </aside>
      </div>
    </div>

    <!-- GROUP 2: Sticky Reveal Footer -->
    <div
      class="sticky bottom-0 z-0 flex h-[max(1020px,70svh)] flex-col justify-between overflow-hidden bg-(--ink) px-[max(12px,1.1vw)] pb-3 pt-4.5 text-(--paper)">
      <div class="absolute inset-0">
        <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg"
          alt="Fabric weave dark background" class="h-full w-full object-cover" />
      </div>

      <!-- FIX: Explicitly closed div prevents DOM hierarchy bugs -->
      <div
        class="absolute inset-0 bg-[linear-gradient(0deg,rgb(15_27_28/0.78),rgb(15_27_28/0.18)_55%,rgb(15_27_28/0.62))]">
      </div>

      <div
        class="relative z-1 grid grid-cols-1 gap-7.5 border-t border-(--light-line) pt-2.25 sm:grid-cols-2 md:grid-cols-[1.2fr_1.3fr_1fr]">
        <div v-for="block in footerBlocks" :key="block.label"
          class="flex flex-col items-start gap-1 text-[11px] uppercase leading-normal">
          <span class="mb-1.75 text-[9px] font-semibold tracking-[0.08em] text-[rgba(245,242,235,0.6)]">
            {{ block.label }}
          </span>
          <p v-for="line in block.lines" :key="line" class="m-0">{{ line }}</p>
          <a v-if="block.email" :href="`mailto:${block.email}`">{{ block.email }}</a>
        </div>
      </div>

      <div
        class="relative z-1 mx-auto max-w-150 text-center text-[13px] italic leading-[1.6] text-[rgba(245,242,235,0.7)]">{{ t('footerMission') }}</div>

      <div class="relative z-1 pt-5 text-center">
        <span class="mb-2.5 block text-[9px] font-semibold uppercase tracking-widest text-[rgba(245,242,235,0.4)]">
          {{ t('footerTrustedBy') }}
        </span>
        <div
          class="flex flex-wrap justify-center gap-x-[clamp(20px,3vw,50px)] gap-y-2 text-xs font-semibold uppercase tracking-[0.06em] text-[rgba(245,242,235,0.5)]">
          <span v-for="brand in trustedBrands" :key="brand">{{ brand }}</span>
        </div>
      </div>

      <div
        class="relative z-1 self-center text-[clamp(92px,17.3vw,330px)] font-light uppercase leading-[0.72] tracking-[-0.09em]">
        HCTPAL
      </div>

      <div
        class="relative z-1 grid grid-cols-1 gap-2 border-t border-(--light-line) pt-2.5 text-center text-[9px] font-semibold uppercase tracking-[0.08em] text-[rgba(245,242,235,0.72)] sm:grid-cols-[1fr_auto_1fr] sm:gap-0 sm:text-left">
        <span>© {{ new Date().getFullYear() }} Ha-Meem Ching Tai Pocketing &amp; Accessories
          Ltd.</span>
        <span class="sm:text-center">{{ t('footerRights') }}</span>
        <a href="#top" class="sm:text-right">{{ t('footerBackToTop') }}</a>
      </div>
    </div>
  </footer>
</template>