import Lenis from 'lenis'

/**
 * Inertial smooth scrolling.
 *
 * Lenis intercepts wheel input and eases `window.scrollY` toward the target
 * instead of jumping, which is what produces the slow, weighted feel. Two
 * things it deliberately does NOT take over:
 *
 *   - The homepage hero stage, which runs its own wheel arbitration to hand
 *     scrolling from the carousel to the page. That element carries
 *     `data-lenis-prevent`, so Lenis ignores wheel events originating inside
 *     it and the existing preventDefault() logic keeps working untouched.
 *
 *   - Anything the user has asked to keep still: with prefers-reduced-motion
 *     we never instantiate, leaving native scrolling in place.
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const lenis = new Lenis({
    // Duration is the half-life of the easing, in seconds. 1.4 is noticeably
    // slower and heavier than the 1.2 default without feeling laggy.
    duration: 1.4,
    // Exponential ease-out: fast initial response, long gentle settle.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    // A touch under 1 so a single wheel notch travels slightly less distance,
    // which reads as more deliberate.
    wheelMultiplier: 0.9,
    // Leave touch alone — native momentum on mobile already feels right, and
    // emulating it tends to feel worse.
    smoothWheel: true,
    syncTouch: false,
  })

  // Drive Lenis from rAF. Lenis does not self-schedule.
  let frame
  const raf = (time) => {
    lenis.raf(time)
    frame = requestAnimationFrame(raf)
  }
  frame = requestAnimationFrame(raf)

  // Route changes should land at the top instantly, not ease through the whole
  // document — and Lenis needs telling, since it owns the scroll position.
  nuxtApp.hook('page:finish', () => {
    lenis.scrollTo(0, { immediate: true })
    // Content height changes between pages; resize() re-reads it.
    lenis.resize()
  })

  nuxtApp.hook('app:unmounted', () => {
    cancelAnimationFrame(frame)
    lenis.destroy()
  })

  // Expose for components that need to drive scrolling themselves.
  return {
    provide: { lenis },
  }
})
