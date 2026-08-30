import Lenis from 'lenis'

/**
 * Inertial smooth scrolling via Lenis.
 *
 * Respects prefers-reduced-motion and coarse pointers (mobile).
 * Exposes $lenis for components that need programmatic scrolling.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = window.matchMedia('(pointer: coarse)').matches

  if (reduced || coarse) return

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 0.82,
    touchMultiplier: 1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })

  let rafId = null
  function raf(time) {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }
  rafId = requestAnimationFrame(raf)

  nuxtApp.hook('page:finish', () => {
    lenis.scrollTo(0, { immediate: true })
    lenis.resize()
  })

  nuxtApp.hook('app:unmounted', () => {
    cancelAnimationFrame(rafId)
    lenis.destroy()
  })

  return {
    provide: { lenis },
  }
})
