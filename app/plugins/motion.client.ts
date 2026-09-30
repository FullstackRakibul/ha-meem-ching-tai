import { shallowRef } from 'vue'
import type Lenis from 'lenis'
import type { gsap as GSAP } from 'gsap'
import type { ScrollTrigger as ST } from 'gsap/ScrollTrigger'

/**
 * Motion engine — the page's single scroll owner.
 *
 * GSAP, ScrollTrigger and Lenis all load lazily, after hydration, so none of
 * them sit on the LCP path. Until they arrive the page scrolls natively.
 *
 * There is exactly ONE animation loop: GSAP's ticker. Lenis is created with
 * `autoRaf: false` and stepped from that ticker, and ScrollTrigger updates
 * from Lenis' scroll event. The Three.js stage (LoomStage) also renders from
 * the same ticker. Do not add another requestAnimationFrame loop.
 *
 * Lenis is skipped for reduced motion and coarse pointers (touch keeps native
 * momentum scrolling). Components must therefore never depend on `$lenis`
 * being set — Lenis drives the real window scroll, so a plain `scroll`
 * listener or a ScrollTrigger works in every mode.
 */
export type Motion = { gsap: typeof GSAP; ScrollTrigger: typeof ST }

export default defineNuxtPlugin((nuxtApp) => {
  const lenis = shallowRef<Lenis | null>(null)
  let ready: Promise<Motion> | null = null

  const loadMotion = () =>
    (ready ??= (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ])
      gsap.registerPlugin(ScrollTrigger)

      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
      const coarse = matchMedia('(pointer: coarse)').matches

      if (!reduced && !coarse) {
        const { default: LenisCtor } = await import('lenis')
        const header = () =>
          parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 80
        const instance = new LenisCtor({
          autoRaf: false,
          duration: 1.05,
          smoothWheel: true,
          wheelMultiplier: 0.82,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          // In-page anchor clicks go through Lenis so they land under the header.
          anchors: { offset: -header() },
        })
        instance.on('scroll', ScrollTrigger.update)
        gsap.ticker.add((time) => instance.raf(time * 1000))
        gsap.ticker.lagSmoothing(0)
        lenis.value = instance
      }

      // Late fonts and images shift layout; pins must re-measure after them.
      document.fonts?.ready.then(() => ScrollTrigger.refresh())
      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true })

      return { gsap, ScrollTrigger }
    })())

  nuxtApp.hook('app:suspense:resolve', () => {
    const start = () => void loadMotion()
    if ('requestIdleCallback' in window) requestIdleCallback(start, { timeout: 1500 })
    else setTimeout(start, 200)
  })

  nuxtApp.hook('page:finish', () => {
    lenis.value?.scrollTo(0, { immediate: true })
    lenis.value?.resize()
  })

  return { provide: { lenis, loadMotion } }
})
