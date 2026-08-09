<script setup>
// Scroll-driven horizontal slides.
//
// No carousel library here any more: the section owns a tall block of vertical
// scroll distance, pins its contents with `position: sticky`, and maps the
// scroll progress through that block onto a horizontal translate of the track.
// Scrolling down walks the cards forward, scrolling up walks them back.
//
// The per-frame position comes from Lenis (plugins/lenis.client.js) rather than
// a native scroll listener, so the horizontal motion is driven by the same
// eased value as the page — they stay locked together instead of the track
// lagging a frame behind the smooth scroll.

const advantageItems = [
  {
    id: 1,
    title: "Unmatched Quality Control",
    description:
      "We lead the industry with rigorous quality checks at every stage of production, ensuring zero defects for global apparel clients.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg",
  },
  {
    id: 2,
    title: "Eco-Friendly Practices",
    description:
      "Committed to sustainable manufacturing with advanced waste-management, low-emission technology, and ethical local sourcing.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg",
  },
  {
    id: 3,
    title: "Innovative Fabric Solutions",
    description:
      "State-of-the-art machinery allows for creative, complex textile patterns, seamless integration, and rapid scaling capabilities.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg",
  },
  {
    id: 4,
    title: "Skilled Workforce Expertise",
    description:
      "Our team of skilled engineers and technicians bring decades of hands-on experience and proprietary knowledge to every order.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg",
  },
  {
    id: 5,
    title: "Unmatched Quality Control",
    description:
      "We lead the industry with rigorous quality checks at every stage of production, ensuring zero defects for global apparel clients.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg",
  },
  {
    id: 6,
    title: "Eco-Friendly Practices",
    description:
      "Committed to sustainable manufacturing with advanced waste-management, low-emission technology, and ethical local sourcing.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg",
  },
  {
    id: 7,
    title: "Innovative Fabric Solutions",
    description:
      "State-of-the-art machinery allows for creative, complex textile patterns, seamless integration, and rapid scaling capabilities.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg",
  },
  {
    id: 8,
    title: "Innovative Fabric Solutions",
    description:
      "State-of-the-art machinery allows for creative, complex textile patterns, seamless integration, and rapid scaling capabilities.",
    image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg",
  },
];

const sectionRef = ref(null);
const frameRef = ref(null);
const trackRef = ref(null);

// 0 → 1 across the pinned block. Drives both the track offset and the UI.
const progress = ref(0);
// How far the track must travel: its full width minus one viewport.
const scrollDistance = ref(0);

const activeIndex = computed(() => {
  const i = Math.round(progress.value * (advantageItems.length - 1));
  return Math.min(advantageItems.length - 1, Math.max(0, i));
});

const sectionHeight = computed(() =>
  isPinned.value ? `calc(100dvh + ${scrollDistance.value}px)` : "auto"
);

const trackStyle = computed(() => ({
  transform: `translate3d(${-progress.value * scrollDistance.value}px, 0, 0)`,
}));

const measure = () => {
  const track = trackRef.value;
  if (!track) return;

  // Sum the real laid-out card widths rather than trusting scrollWidth: the
  // track has visible overflow (the active card lifts out of the box), and in
  // that case scrollWidth can under-report, which leaves the last cards
  // unreachable because the section reserves too little scroll.
  const cards = Array.from(track.children);
  if (!cards.length) return;

  // offsetLeft/offsetWidth are layout values, unaffected by the track's
  // translate — getBoundingClientRect() would report transformed coordinates
  // and yield a different answer depending on the current scroll position.
  // offsetLeft is measured from the track's padding box, so the leading gutter
  // is already included; only the trailing padding needs adding.
  const lastCard = cards[cards.length - 1];
  const padRight = parseFloat(getComputedStyle(track).paddingInlineEnd) || 0;
  const total = lastCard.offsetLeft + lastCard.offsetWidth + padRight;

  // Travel = how much of the track sits beyond the viewport's right edge.
  scrollDistance.value = Math.max(0, Math.round(total - track.clientWidth));
};

// Only pin when there is something to scroll horizontally. Below that (narrow
// viewports, or few enough cards to fit) the section behaves as a normal block
// and claims no extra scroll — otherwise it would pin over dead space.
const isPinned = computed(() => scrollDistance.value > 0);

const update = () => {
  if (!sectionRef.value) return;

  const rect = sectionRef.value.getBoundingClientRect();
  // Measure against the sticky frame's real height rather than innerHeight:
  // they must be the same number or progress finishes early/late, which is
  // what leaves the track parked mid-travel with blank space beside it.
  const frameHeight = frameRef.value?.offsetHeight ?? window.innerHeight;
  const total = rect.height - frameHeight;

  if (total <= 0) {
    progress.value = 0;
    return;
  }

  // -rect.top is how far into the section we've scrolled.
  const raw = -rect.top / total;
  progress.value = Math.min(1, Math.max(0, raw));
};

let stopLenis;
let observer;

onMounted(async () => {
  measure();
  // Applying `isPinned` swaps the frame to h-dvh, which relays out the cards
  // and changes their width. Re-measure once that has been committed, or the
  // travel distance stays based on the pre-pin layout and the last cards are
  // never reachable.
  await nextTick();
  measure();
  update();

  const { $lenis } = useNuxtApp();

  if ($lenis) {
    // Lenis emits per animation frame with the eased scroll value, so the
    // track moves in lockstep with the smooth scroll.
    stopLenis = $lenis.on("scroll", update);
  } else {
    // Reduced-motion, or Lenis unavailable: fall back to native scroll.
    window.addEventListener("scroll", update, { passive: true });
    stopLenis = () => window.removeEventListener("scroll", update);
  }

  // Card widths are viewport-relative and images load late, both of which
  // change the travel distance. Watch the frame too: its height drives the
  // card height, which (via aspect-driven content) can shift widths.
  observer = new ResizeObserver(() => {
    measure();
    update();
  });
  observer.observe(trackRef.value);
  if (frameRef.value) observer.observe(frameRef.value);
});

onBeforeUnmount(() => {
  stopLenis?.();
  observer?.disconnect();
});
</script>

<template>
  <section
    ref="sectionRef"
    class="advantage-section relative bg-navy-50"
    :class="isPinned ? 'is-pinned' : 'py-16 md:py-20'"
    :style="{ height: sectionHeight }"
  >
    <!-- Sticky frame: stays put for the whole scroll block while the track
         inside it slides horizontally. h-dvh matches the unit used for the
         section height so the two can't disagree. -->
    <div
      ref="frameRef"
      class="advantage-frame relative w-full overflow-hidden flex flex-col justify-center"
      :class="isPinned ? 'sticky top-0 h-dvh' : ''"
    >
      <!-- Ambient glow blobs — same glass/navy/gold language as header & footer -->
      <div
        class="absolute -top-24 -left-24 w-96 h-96 bg-navy-200/50 rounded-full blur-3xl pointer-events-none"
      ></div>
      <div
        class="absolute -bottom-24 -right-24 w-96 h-96 bg-[#e8b938]/20 rounded-full blur-3xl pointer-events-none"
      ></div>

      <UContainer class="relative w-full">
        <div class="mb-10 lg:mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <UBadge
              label="OUR ADVANTAGE"
              color="primary"
              variant="soft"
              class="border border-gray-200 bg-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-5"
            />
            <h2
              class="text-3xl md:text-5xl font-bold text-primary leading-[1.15] tracking-tight"
            >
              Why We Stand Out in the<br class="hidden md:block" />
              Manufacturing Industry
            </h2>
          </div>

          <!-- Progress readout: the only affordance telling the user this
               section consumes scroll, so it earns its place. -->
          <div class="flex items-center gap-4">
            <span class="text-sm font-bold text-primary tabular-nums">
              {{ String(activeIndex + 1).padStart(2, "0") }}
              <span class="text-gray-400"
                >/ {{ String(advantageItems.length).padStart(2, "0") }}</span
              >
            </span>
            <div class="h-px w-24 md:w-40 bg-gray-300 relative overflow-hidden">
              <div
                class="absolute inset-y-0 left-0 bg-[#e8b938]"
                :style="{ width: `${progress * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </UContainer>

      <!-- The moving track. Fills the remaining frame height (grow + min-h-0)
           so the cards are as tall as the pinned viewport allows instead of
           clustering at the top and leaving a band of empty space. -->
      <div
        ref="trackRef"
        class="advantage-track flex gap-6 grow min-h-0 items-stretch will-change-transform"
        :style="trackStyle"
      >
        <article
          v-for="(item, index) in advantageItems"
          :key="item.id"
          class="advantage-card group shrink-0 flex flex-col text-left rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-xs transition-colors duration-500 ease-in-out hover:bg-white/90 hover:border-[#e8b938]/50"
          :class="index === activeIndex ? 'is-active' : ''"
        >
          <div class="px-5 pt-8 pb-6 flex flex-col grow">
            <!-- Title — held to two lines so every column aligns -->
            <h3 class="font-bold text-xl text-primary mb-2 leading-snug min-h-14">
              {{ item.title }}
            </h3>

            <!-- grow: the image absorbs whatever height the taller card has
                 spare, rather than the card ending in dead space. min-h-40
                 stops it collapsing on short viewports. -->
            <div class="overflow-hidden rounded-xl mb-6 relative grow min-h-40">
              <img
                :src="item.image"
                alt="HCTPAL Manufacturing"
                loading="lazy"
                class="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
              />
            </div>

            <p class="text-sm text-gray-500 leading-relaxed shrink-0">
              {{ item.description }}
            </p>
          </div>

          <!-- Footer bar: full-width rule, icon boxed off in its own cell -->
          <div class="flex items-stretch border-t border-gray-200/70 mt-auto">
            <a
              href="#"
              class="grow flex items-center gap-2 px-5 py-5 text-[11px] font-bold uppercase tracking-wider text-primary hover:text-[#e8b938] transition-colors"
            >
              Read More
              <UIcon name="i-heroicons-arrow-right-20-solid" class="text-sm" />
            </a>
            <div
              class="flex items-center justify-center px-6 border-l border-gray-200/70 text-gray-400 group-hover:text-[#e8b938] transition-colors"
            >
              <UIcon name="i-heroicons-square-3-stack-3d" class="text-xl" />
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Leading gutter aligns card 1 with the heading above it.
   The TRAILING gutter is deliberately small: symmetric padding meant the last
   ~336px of travel (at 1920px wide) was spent scrolling empty padding past the
   viewport, so the module finished on blank space instead of the final card. */
.advantage-track {
  padding-inline: max(1rem, calc((100% - 80rem) / 2 + 1rem)) 1rem;
  padding-block: 0.5rem 1.5rem; /* room for the is-active lift + its shadow */
}

.advantage-card {
  /* Card width drives how many are visible at once and, via scrollWidth, how
     much scroll distance the section claims. Kept as a share of the viewport
     so the cards scale up on large screens instead of stranding empty space. */
  width: min(86vw, 26rem);
}

@media (min-width: 768px) {
  .advantage-card {
    width: min(46vw, 30rem);
  }
}

@media (min-width: 1280px) {
  .advantage-card {
    width: min(32vw, 34rem);
  }
}

/* The card at the centre of the viewport lifts slightly — the horizontal
   equivalent of the old hover state, driven by scroll instead of the pointer. */
.advantage-card.is-active {
  box-shadow: 0 20px 40px -12px rgb(20 46 83 / 0.18);
  transform: translateY(-6px);
}

.advantage-card {
  transition: transform 500ms cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 500ms cubic-bezier(0.22, 1, 0.36, 1), background-color 500ms ease,
    border-color 500ms ease;
}

/* Reduced motion: drop the pin entirely and let the cards be a normal
   horizontally-scrollable strip, so no scroll distance is hijacked. */
@media (prefers-reduced-motion: reduce) {
  .advantage-section {
    height: auto !important;
    padding-block: 4rem;
  }

  .advantage-frame {
    position: static;
    height: auto;
  }

  .advantage-track {
    transform: none !important;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    /* Restore a symmetric trailing gutter: without the pin there's no
       translate, so the last card needs real padding to breathe. */
    padding-inline: max(1rem, calc((100% - 80rem) / 2 + 1rem));
  }

  .advantage-card {
    scroll-snap-align: center;
    /* No pinned frame to fill, so let content set the height. */
    height: auto;
  }
}
</style>
