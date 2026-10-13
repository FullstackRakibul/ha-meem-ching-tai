import type { Ref } from 'vue'
import type { Motion } from '~/plugins/motion.client'
import { EASE, MQ, REVEAL, STAGGER } from '~/utils/motion'

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
 * Block reveal for `[data-reveal-block]` children: a short rise and fade.
 * Purpose: marks the moment a block of copy enters the reading area.
 * Whole blocks only — never characters — so Bengali and Chinese are safe.
 *
 * Same everywhere: REVEAL.y up, REVEAL.dur, EASE.reveal, once. Blocks that
 * reach the reading line together (a card row) arrive STAGGER.block apart,
 * never more than STAGGER.cap in total. The hidden state is set here, in
 * JS, so without JS or with reduced motion every block is simply visible.
 * Opacity, not visibility: a hidden block's links stay focusable, and
 * focusing one scrolls it in, which reveals it.
 */
export function revealBlocks({ gsap, ScrollTrigger, root, mode }: SceneContext) {
  if (mode === 'reduced') return
  // Blocks already above the viewport (a reload mid-page) are left as they are.
  const blocks = gsap.utils
    .toArray<HTMLElement>('[data-reveal-block]', root)
    .filter((block) => block.getBoundingClientRect().bottom > 0)
  if (!blocks.length) return
  gsap.set(blocks, { opacity: 0, y: REVEAL.y })
  ScrollTrigger.batch(blocks, {
    start: 'top 88%',
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        duration: REVEAL.dur,
        ease: EASE.reveal,
        stagger: Math.min(STAGGER.block, STAGGER.cap / Math.max(1, batch.length - 1)),
        clearProps: 'opacity,transform',
        overwrite: true,
      }),
  })
}
