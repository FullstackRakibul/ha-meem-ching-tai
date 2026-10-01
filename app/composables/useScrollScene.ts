import type { Ref } from 'vue'
import type { Motion } from '~/plugins/motion.client'
import { DUR, EASE, MQ, STAGGER } from '~/utils/motion'

export type MotionMode = 'full' | 'lite' | 'reduced'

export type SceneContext = Motion & { mode: MotionMode; root: HTMLElement }

/**
 * Registers a section's GSAP work once the (lazy) motion engine is ready.
 *
 * Everything created inside `setup` is scoped to `root` through
 * `gsap.matchMedia`, so it is reverted automatically on unmount and when the
 * user crosses a breakpoint or toggles reduced motion — the setup simply runs
 * again with the new `mode`. Return a function for any extra cleanup.
 */
export function useScrollScene(
  root: Ref<HTMLElement | null>,
  setup: (ctx: SceneContext) => void | (() => void),
) {
  let mm: ReturnType<Motion['gsap']['matchMedia']> | null = null
  let disposed = false

  onMounted(async () => {
    const motion = await useNuxtApp().$loadMotion()
    if (disposed || !root.value) return
    const el = root.value
    mm = motion.gsap.matchMedia(el)
    mm.add({ full: MQ.full, lite: MQ.lite, reduced: MQ.reduced }, (ctx) => {
      const c = ctx.conditions ?? {}
      const mode: MotionMode = c.reduced ? 'reduced' : c.full ? 'full' : 'lite'
      return setup({ ...motion, mode, root: el })
    })
  })

  onBeforeUnmount(() => {
    disposed = true
    mm?.revert()
    mm = null
  })
}

/**
 * Block reveal for `[data-reveal-block]` children: a clip-path wipe upward.
 * Purpose: marks the moment a block of copy enters the reading area.
 * Whole blocks only — never characters — so Bengali and Chinese are safe.
 */
export function revealBlocks({ gsap, root, mode }: SceneContext) {
  if (mode === 'reduced') return
  const blocks = gsap.utils.toArray<HTMLElement>('[data-reveal-block]', root)
  blocks.forEach((block, i) => {
    gsap.from(block, {
      clipPath: 'inset(0% 0% 100% 0%)',
      y: 24,
      duration: DUR.md,
      ease: EASE.reveal,
      delay: (i % 4) * STAGGER.block,
      clearProps: 'clipPath,transform',
      scrollTrigger: { trigger: block, start: 'top 88%', once: true },
    })
  })
}
