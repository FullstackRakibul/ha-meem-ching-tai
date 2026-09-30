/**
 * Motion tokens — the only durations, eases and staggers the landing page uses.
 *
 * Contract (read before adding a tween):
 *  - One primary move per scene. A new tween must name its purpose in a comment.
 *  - Only transform, opacity, clip-path, CSS custom properties and shader
 *    uniforms animate. Never width/height/top/left.
 *  - NEVER animated: numbers (no count-ups — a fact must always read
 *    correctly), body copy after it has revealed, the header's position, CTAs,
 *    form fields, focus rings. No per-character text splitting (it breaks
 *    Bengali conjuncts). No idle loops outside the sustainability water loop.
 */
export const DUR = { xs: 0.2, sm: 0.45, md: 0.8, lg: 1.2, xl: 1.6 } as const

export const EASE = {
  out: 'power3.out',
  reveal: 'expo.out',
  inout: 'power2.inOut',
  scrub: 'none',
} as const

export const STAGGER = { list: 0.05, block: 0.06 } as const

/** Seconds of lag on scrubbed timelines — smooths wheel steps without drift. */
export const SCRUB = 0.6

/** Horizontal pins and the Short Thread pin switch off below this width. */
export const PIN_MIN_WIDTH = 840

export const MQ = {
  reduced: '(prefers-reduced-motion: reduce)',
  full: `(prefers-reduced-motion: no-preference) and (min-width: ${PIN_MIN_WIDTH}px)`,
  lite: `(prefers-reduced-motion: no-preference) and (max-width: ${PIN_MIN_WIDTH - 1}px)`,
} as const
