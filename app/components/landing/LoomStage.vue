<!-- components/landing/LoomStage.vue -->
<script setup lang="ts">
/**
 * Hosts the page's single WebGL canvas (fixed, behind section content).
 *
 * Nothing here runs on the server or before idle: the tier is detected on
 * mount, Three.js is imported only for the `full`/`lite` tiers, and `lite`
 * additionally waits for the first scroll so an untouched page (and a
 * Lighthouse run) never downloads it. Until the stage is live — and forever
 * in the `poster` tier — the SVG poster frames inside each section carry the
 * scenes. `html.loom-live` hides those posters once WebGL is drawing.
 */
import type { Stage } from '~/lib/loom/stage'
import { detectTier, loomState, useLoomTier } from '~/composables/useLoomStage'

const props = defineProps<{ menuOpen: boolean }>()

const canvasRef = ref<HTMLCanvasElement | null>(null)
const tier = useLoomTier()
const live = ref(false)

let stage: Stage | null = null
let tick: ((time: number, deltaTime: number) => void) | null = null
let removeTick: (() => void) | null = null
let cancelled = false

const root = document.documentElement

function goPoster() {
  tier.value = 'poster'
  live.value = false
  root.classList.remove('loom-live', 'loom-boot')
  removeTick?.()
  stage?.dispose()
  stage = null
}

async function start() {
  const t = tier.value
  if (t === 'poster' || cancelled || !canvasRef.value) return
  const [{ createStage }, motion] = await Promise.all([
    import('~/lib/loom/stage'),
    useNuxtApp().$loadMotion(),
  ])
  if (cancelled || !canvasRef.value) return
  try {
    stage = createStage(canvasRef.value, t, goPoster)
  } catch {
    // No usable WebGL (blocked, blacklisted GPU…) — the posters already cover it.
    goPoster()
    return
  }
  tick = (time, deltaTime) => stage?.frame(time, deltaTime)
  motion.gsap.ticker.add(tick)
  removeTick = () => {
    if (tick) motion.gsap.ticker.remove(tick)
    tick = null
  }
  live.value = true
  root.classList.add('loom-live')
  // The boot scene (hero thread + fibres) is 3D only on the full tier.
  if (t === 'full') root.classList.add('loom-boot')
}

const onResize = () => stage?.resize()
const onVisibility = () => {
  if (!document.hidden) loomState.dirty = true
}
// Anchored objects follow their DOM slots, so any scroll is a reason to redraw.
const onScroll = () => {
  loomState.dirty = true
}

watch(
  () => props.menuOpen,
  (open) => {
    loomState.menuOpen = open
    loomState.dirty = true
  },
)

onMounted(() => {
  tier.value = detectTier()
  window.addEventListener('resize', onResize)
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)

  if (tier.value === 'lite') {
    window.addEventListener('scroll', () => void start(), { once: true, passive: true })
  } else {
    void start()
  }
})

onBeforeUnmount(() => {
  cancelled = true
  window.removeEventListener('resize', onResize)
  window.removeEventListener('scroll', onScroll)
  document.removeEventListener('visibilitychange', onVisibility)
  goPoster()
})
</script>

<template>
  <canvas
    ref="canvasRef"
    :class="['loom-stage', { 'loom-stage--live': live, 'loom-stage--menu': menuOpen }]"
    aria-hidden="true"
  />
</template>
