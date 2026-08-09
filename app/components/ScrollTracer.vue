<template>
  <!-- Scroll progress tracer: replaces the native scrollbar (hidden globally
       in main.css). A faint full-height rail, a brighter trail showing how far
       you've read, and a glowing dot at the head. Purely decorative —
       pointer-events:none so it never intercepts clicks or the custom cursor. -->
  <div class="scroll-tracer" :class="{ 'scroll-tracer--on-dark': onDark }" aria-hidden="true">
    <div class="scroll-tracer__rail"></div>
    <div class="scroll-tracer__trail" :style="{ height: `${progress}%` }"></div>
    <div class="scroll-tracer__dot" :style="{ top: `${progress}%` }"></div>
  </div>
</template>

<script setup>
import { useWindowScroll, useWindowSize, useDebounceFn } from '@vueuse/core'

const { y } = useWindowScroll()
const { height: viewportHeight } = useWindowSize()

// Full document height changes as images load and sections mount, so it can't
// be captured once — recompute it on resize and on a debounced scroll tick.
const docHeight = ref(0)

const measure = () => {
  docHeight.value = document.documentElement.scrollHeight
}

const debouncedMeasure = useDebounceFn(measure, 100)

onMounted(() => {
  measure()
  // Late-loading imagery changes the page height after mount; observing the
  // body keeps the tracer honest without polling.
  const observer = new ResizeObserver(debouncedMeasure)
  observer.observe(document.body)
  onBeforeUnmount(() => observer.disconnect())
})

watch(viewportHeight, measure)

// The only dark backdrop is the homepage's sticky hero carousel, which owns
// roughly the first viewport. `fullBleed` is the same flag the layout uses to
// decide a page runs edge-to-edge, so it identifies hero pages without this
// component needing to know about routes.
const route = useRoute()

const onDark = computed(
  () => route.meta.fullBleed === true && y.value < viewportHeight.value * 0.85,
)

const progress = computed(() => {
  const scrollable = docHeight.value - viewportHeight.value
  if (scrollable <= 0) return 0
  return Math.min(100, Math.max(0, (y.value / scrollable) * 100))
})
</script>

<style scoped>
.scroll-tracer {
  position: fixed;
  top: 0;
  right: 14px;
  bottom: 0;
  width: 2px;
  z-index: 60;
  pointer-events: none;
}

/* The unread track — barely there, just enough to imply a path. */
.scroll-tracer__rail {
  position: absolute;
  inset: 0;
  width: 1px;
  margin: 0 auto;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(20, 46, 83, 0.18) 12%,
    rgba(20, 46, 83, 0.18) 88%,
    transparent 100%
  );
}

/* The read portion, in brand navy, fading in from the top. */
.scroll-tracer__trail {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 1.5px;
  margin: 0 auto;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    var(--color-navy-400) 40%,
    var(--color-navy-500) 100%
  );
}

/* The head of the trail. Two shadows: a tight ring and a wide glow. */
.scroll-tracer__dot {
  position: absolute;
  left: 50%;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #fff;
  transform: translate(-50%, -50%);
  box-shadow:
    0 0 0 2px var(--color-navy-500),
    0 0 12px 2px rgba(20, 46, 83, 0.5),
    0 0 24px 6px rgba(20, 46, 83, 0.25);
}

/* Over the dark hero carousel the navy rail is invisible, so lift the whole
   tracer to white while the page is still on the hero. */
.scroll-tracer--on-dark .scroll-tracer__rail {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.22) 12%,
    rgba(255, 255, 255, 0.22) 88%,
    transparent 100%
  );
}

.scroll-tracer--on-dark .scroll-tracer__trail {
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(255, 255, 255, 0.7) 40%,
    #fff 100%
  );
}

.scroll-tracer--on-dark .scroll-tracer__dot {
  box-shadow:
    0 0 0 2px rgba(255, 255, 255, 0.9),
    0 0 12px 2px rgba(255, 255, 255, 0.6),
    0 0 24px 6px rgba(255, 255, 255, 0.3);
}

/* Colour swap shouldn't snap when the hero scrolls away. */
.scroll-tracer__rail,
.scroll-tracer__trail,
.scroll-tracer__dot {
  transition-property: height, top, background, box-shadow;
  transition-duration: 120ms, 120ms, 400ms, 400ms;
  transition-timing-function: linear, linear, ease, ease;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-tracer__trail,
  .scroll-tracer__dot {
    transition: none;
  }
}

/* Touch devices scroll without a visible scrollbar anyway — the tracer is
   desktop chrome, and on narrow screens it just crowds the edge. */
@media (max-width: 640px) {
  .scroll-tracer {
    display: none;
  }
}
</style>
