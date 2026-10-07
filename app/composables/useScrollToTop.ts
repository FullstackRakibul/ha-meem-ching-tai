import { DUR } from '~/utils/motion'

/**
 * The site's one "back to top" — ScrollTracer's button and the footer link
 * both call this, so they behave the same everywhere.
 *
 * `$lenis` is a ref (null on touch, under reduced motion, and before the
 * motion engine loads). Lenis scrolls when it drives the page; otherwise the
 * native smooth scroll. Under reduced motion the jump is instant. Focus moves
 * to the top of the page without a second scroll, so keyboard users carry on
 * from there instead of from the footer.
 */
export function useScrollToTop() {
  const { $lenis } = useNuxtApp()

  return () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = $lenis.value

    if (lenis) lenis.scrollTo(0, reduced ? { immediate: true } : { duration: DUR.lg })
    else window.scrollTo({ top: 0, behavior: reduced ? 'instant' : 'smooth' })

    const top = document.getElementById('top')
    if (top) {
      if (!top.hasAttribute('tabindex')) top.setAttribute('tabindex', '-1')
      top.setAttribute('data-focus-target', '')
      top.focus({ preventScroll: true })
    }
  }
}
