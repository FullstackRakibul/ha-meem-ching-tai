<!-- components/ScrollTracer.vue -->
<script setup lang="ts">
/**
 * Scroll tracer + back to top.
 *
 * The track is a running stitch down the right edge: a dashed ghost rail, the
 * sewn thread (what has been read) and a needle at its leading edge. All
 * three are driven by one CSS variable, --p (0–1), which a ScrollTrigger
 * writes — transforms only, no transition, no scroll listener or layout read
 * of our own. The track is decorative and hidden from assistive tech.
 *
 * The button is always reachable: fixed bottom-right at every width (only the
 * track hides on phones), outside aria-hidden, labelled through t(), with a
 * two-tone body and focus ring that read on light and dark grounds alike. It
 * shares useScrollToTop() with the footer's "Back to top" link.
 */
import { useScrollToTop } from "~/composables/useScrollToTop";

const { t } = useLocale();
const scrollToTop = useScrollToTop();

const tracer = ref<HTMLElement | null>(null);
const sentinel = ref<HTMLElement | null>(null);
const showTopBtn = ref(false);
const onDark = ref(false);

// Progress: ScrollTrigger already tracks the scroll (with or without Lenis).
useScrollScene(tracer, ({ ScrollTrigger, root }) => {
  const write = (p: number) => root.style.setProperty("--p", p.toFixed(4));
  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => write(self.progress),
    onRefresh: (self) => write(self.progress),
  });
  return () => root.style.removeProperty("--p");
});

/** Relative luminance (0–1) of a computed CSS colour. */
function luminance(css: string) {
  const n = css.match(/[\d.]+/g)?.map(Number) ?? [];
  if (n.length < 3) return 0;
  // oklch()/oklab(): lightness first; L³ approximates relative luminance.
  if (css.startsWith("ok")) return (n[0]! > 1 ? n[0]! / 100 : n[0]!) ** 3;
  const scale = css.startsWith("color(") ? 1 : 255;
  const [r, g, b] = n.slice(0, 3).map((v) => {
    const c = v / scale;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
}

let showIO: IntersectionObserver | null = null;
let groundIO: IntersectionObserver | null = null;

onMounted(() => {
  // The button appears half a viewport down: a sentinel at 50vh has left the
  // top of the viewport. An observer, not a scroll listener.
  if (sentinel.value) {
    showIO = new IntersectionObserver(([entry]) => {
      showTopBtn.value = !!entry && !entry.isIntersecting && entry.boundingClientRect.top < 0;
    });
    showIO.observe(sentinel.value);
  }

  // The ground behind the track: every section is classified once, from its
  // own text colour (light text is only ever set on a dark ground), so this
  // follows every section — not just the hero — and needs no hardcoded list.
  // `data-ground="dark|light"` overrides. A thin band at mid-viewport then
  // says which ground is current; overlaps resolve to the topmost (a sticky
  // footer under its contact card).
  const grounds = Array.from(
    document.querySelectorAll<HTMLElement>(
      "#main-content > section, #main-content > footer > div, [data-ground]"
    )
  );
  const info = new Map(
    grounds.map((el, order) => {
      const cs = getComputedStyle(el);
      const forced = el.dataset.ground;
      const dark = forced ? forced === "dark" : luminance(cs.color) > 0.5;
      return [el, { dark, z: Number.parseInt(cs.zIndex, 10) || 0, order }] as const;
    })
  );
  const hits = new Set<Element>();
  groundIO = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) hits.add(entry.target);
        else hits.delete(entry.target);
      }
      let current: { dark: boolean; z: number; order: number } | undefined;
      for (const el of hits) {
        const g = info.get(el as HTMLElement);
        if (g && (!current || g.z > current.z || (g.z === current.z && g.order > current.order))) {
          current = g;
        }
      }
      onDark.value = !!current?.dark;
    },
    { rootMargin: "-49.5% 0px -49.5% 0px" }
  );
  grounds.forEach((el) => groundIO?.observe(el));
});

onBeforeUnmount(() => {
  showIO?.disconnect();
  groundIO?.disconnect();
});
</script>

<template>
  <div ref="sentinel" class="scroll-tracer__sentinel" aria-hidden="true" />
  <div ref="tracer" class="scroll-tracer" :class="{ 'scroll-tracer--on-dark': onDark }">
    <!-- The sewing track: decorative, so hidden from assistive tech. -->
    <div class="scroll-tracer__track" aria-hidden="true">
      <div class="scroll-tracer__rail" />
      <div class="scroll-tracer__trail" />
      <div class="scroll-tracer__needle-run">
        <div class="scroll-tracer__needle" />
      </div>
    </div>

    <button
      type="button"
      class="back-to-top"
      :class="{ 'is-visible': showTopBtn }"
      :aria-label="t('backToTop')"
      @click="scrollToTop"
    >
      <svg
        class="back-to-top__icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  </div>
</template>

<style scoped>
/* ─────────────── Running-stitch tracer ─────────────── */
.scroll-tracer {
  /* Progress, 0–1, written by ScrollTrigger. */
  --p: 0;
  /* Stitch rhythm: one 7px stitch, one 7px gap. */
  --stitch: 7px;
  --tracer-thread: var(--gold);
  --tracer-ghost: color-mix(in srgb, var(--ink) 22%, transparent);

  position: fixed;
  top: 0;
  right: max(12px, env(safe-area-inset-right, 0px));
  bottom: 0;
  z-index: 60;
  width: 48px;
  /* The column itself never takes clicks; the button opts back in. */
  pointer-events: none;
}

/* Dark ground under the track: the thread turns paper-light. */
.scroll-tracer--on-dark {
  --tracer-thread: var(--paper);
  --tracer-ghost: color-mix(in srgb, var(--paper) 30%, transparent);
}

/* In the document flow at 50vh; observed, never painted. */
.scroll-tracer__sentinel {
  position: absolute;
  top: 50vh;
  left: 0;
  width: 1px;
  height: 1px;
  pointer-events: none;
}

/* ─── The sewing track ─── */
.scroll-tracer__track {
  position: absolute;
  top: 0;
  bottom: calc(24px + 44px + 16px + env(safe-area-inset-bottom, 0px));
  left: 23px;
  width: 2px;
}

.scroll-tracer__rail,
.scroll-tracer__trail,
.scroll-tracer__needle-run {
  position: absolute;
  inset: 0;
}

/* Unread: the faint dashed guideline. */
.scroll-tracer__rail {
  background: repeating-linear-gradient(
    to bottom,
    var(--tracer-ghost) 0 var(--stitch),
    transparent var(--stitch) calc(2 * var(--stitch))
  );
}

/* Read: an outer box slid up by (1 − p) and an inner stitch slid back down,
   so the stitches stay registered with the rail and never stretch. */
.scroll-tracer__trail {
  overflow: hidden;
  transform: translateY(calc((var(--p) - 1) * 100%));
}

.scroll-tracer__trail::before {
  position: absolute;
  inset: 0;
  content: "";
  background: repeating-linear-gradient(
    to bottom,
    var(--tracer-thread) 0 var(--stitch),
    transparent var(--stitch) calc(2 * var(--stitch))
  );
  transform: translateY(calc((1 - var(--p)) * 100%));
}

/* The needle rides the leading edge: its run box moves p of the track. */
.scroll-tracer__needle-run {
  transform: translateY(calc(var(--p) * 100%));
}

.scroll-tracer__needle {
  position: absolute;
  top: 0;
  left: -1px;
  width: 4px;
  height: 18px;
  border-radius: 4px;
  background: var(--tracer-thread);
  transform: translateY(-100%);
}

/* ─── Back to top ─── */
/* Two-tone: a deep core reads on light grounds, the paper ring on dark ones. */
.back-to-top {
  position: absolute;
  bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  left: 2px;
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border: 2px solid var(--paper);
  border-radius: 50%;
  background-color: var(--gold);
  color: var(--paper);
  cursor: pointer;
  pointer-events: auto;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: opacity var(--dur-sm) var(--ease), transform var(--dur-sm) var(--ease),
    visibility 0s linear var(--dur-sm);
}

.back-to-top.is-visible {
  opacity: 1;
  visibility: visible;
  transform: none;
  transition-delay: 0s;
}

.back-to-top__icon {
  width: 20px;
  height: 20px;
}

/* Focus ring: dark band inside a paper band, so it reads on any ground. */
.back-to-top:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 2px;
  box-shadow: 0 0 0 6px var(--paper);
  background-color: var(--gold-soft);
}

@media (hover: hover) {
  .back-to-top:hover {
    background-color: var(--gold-soft);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .back-to-top__icon {
    transition: transform var(--dur-xs) var(--ease);
  }

  .back-to-top:focus-visible .back-to-top__icon {
    transform: translateY(-2px);
  }
}

@media (hover: hover) and (prefers-reduced-motion: no-preference) {
  .back-to-top:hover .back-to-top__icon {
    transform: translateY(-2px);
  }
}

/* Reduced motion: the button simply appears and disappears. */
@media (prefers-reduced-motion: reduce) {
  .back-to-top {
    transform: none;
    transition: none;
  }
}

/* Phones: only the track hides; the button stays, bottom-right. */
@media (max-width: 640px) {
  .scroll-tracer__track {
    display: none;
  }

  .back-to-top {
    bottom: calc(16px + env(safe-area-inset-bottom, 0px));
  }
}
</style>
