import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'

/**
 * Shared state between the DOM sections and the single WebGL stage.
 *
 * Sections write here from their ScrollTriggers; LoomStage reads it once per
 * ticker frame and only renders when `dirty` is set (or a looping chapter is
 * on screen). It is a plain object on purpose — making it reactive would run
 * Vue's dependency tracking at 60 Hz for values no template reads.
 */
export type Chapter = 'boot' | 'index' | 'why' | 'stats' | 'dusk' | 'ply'
export type Tier = 'full' | 'lite' | 'poster'
export type Uniform = 'spin' | 'morph' | 'woven' | 'sun' | 'twist'

export const loomState = {
  presence: { boot: 0, index: 0, why: 0, stats: 0, dusk: 0, ply: 0 } as Record<Chapter, number>,
  u: { spin: 0, morph: 0, woven: 0, sun: 0, twist: 0 } as Record<Uniform, number>,
  menuOpen: false,
  menuImage: null as string | null,
  dirty: true,
}

/** Woven share of the grid: 500,000 yd today ÷ 2,000,000 yd future capacity. */
export const WOVEN_SHARE = 500_000 / 2_000_000

export function setUniform(key: Uniform, value: number) {
  if (loomState.u[key] === value) return
  loomState.u[key] = value
  loomState.dirty = true
}

export function setPresence(chapter: Chapter, value: number) {
  if (loomState.presence[chapter] === value) return
  loomState.presence[chapter] = value
  loomState.dirty = true
}

export function setMenu(open: boolean, image: string | null) {
  loomState.menuOpen = open
  loomState.menuImage = image
  loomState.dirty = true
}

/** Fade in over the first 18% of a section's pass through the viewport, out over the last. */
const presenceCurve = (p: number) => Math.max(0, Math.min(1, p / 0.18, (1 - p) / 0.18))

/** Report how much of `chapter` is on screen, for the stage's object fades. */
export function trackPresence(ScrollTrigger: typeof ST, trigger: Element, chapter: Chapter) {
  return ScrollTrigger.create({
    trigger,
    start: 'top bottom',
    end: 'bottom top',
    onUpdate: (self) => setPresence(chapter, presenceCurve(self.progress)),
    onToggle: (self) => {
      if (!self.isActive) setPresence(chapter, 0)
    },
  })
}

/**
 * Pick the rendering tier. `poster` means no WebGL at all — the SVG poster
 * frames carry every scene. The check never creates a probe WebGL context
 * (that would count against the one-context budget); a failed renderer
 * construction falls back to posters instead.
 */
export function detectTier(): Tier {
  const mq = (q: string) => window.matchMedia(q).matches
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean }
  }
  if (mq('(prefers-reduced-motion: reduce)')) return 'poster'
  if (!('WebGL2RenderingContext' in window)) return 'poster'
  if (nav.connection?.saveData) return 'poster'
  const memory = nav.deviceMemory ?? 8
  const cores = nav.hardwareConcurrency ?? 8
  if (memory < 4) return 'poster'

  const width = window.innerWidth
  const fine = mq('(pointer: fine)')
  if (width >= 1024 && fine) return 'full'
  if (width >= 768 && (fine || (memory >= 4 && cores >= 6))) return 'lite'
  return 'poster'
}

export const useLoomTier = () => useState<Tier>('loomTier', () => 'poster')
