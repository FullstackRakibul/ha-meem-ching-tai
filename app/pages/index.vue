<!-- pages/index.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Loader from '~/components/landing/Loader.vue'
import SiteHeader from '~/components/landing/SiteHeader.vue'
import SiteMenu from '~/components/landing/SiteMenu.vue'
import HeroSection from '~/components/landing/HeroSection.vue'
import IntroSection from '~/components/landing/IntroSection.vue'
import WhyMatters from '~/components/landing/WhyMatters.vue'
import VentureStats from '~/components/landing/VentureStats.vue'
import FactoryAbout from '~/components/landing/FactoryAbout.vue'
import ProductRail from '~/components/landing/ProductRail.vue'
import CategoryTheatre from '~/components/landing/CategoryTheatre.vue'
import OriginPanel from '~/components/landing/OriginPanel.vue'
import SustainabilityCTA from '~/components/landing/SustainabilityCTA.vue'
import FooterSection from '~/components/landing/FooterSection.vue'

useHead({
  title: 'Ha-Meem Ching Tai | World-Class Pocketing & Garment Accessories Manufacturing',
  meta: [
    {
      name: 'description',
      content: 'A joint venture between Ha-Meem Group and Ching Tai. We manufacture export-quality pocketing fabrics, interlinings, and trims in Bangladesh to drastically reduce lead times and strengthen the backward linkage industry.',
    },
  ],
})

const loaded = ref(false)
const loadingProgress = ref(0)
const menuOpen = ref(false)
const headerHidden = ref(false)
const sceneIndex = ref('01')

const navItems = [
  { label: 'Home', href: '#top', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600' },
  { label: 'Why It Matters', href: '#why-matters', image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=600' },
  { label: 'Products', href: '#collections', image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600' },
  { label: 'Factory', href: '#factory', image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600' },
  { label: 'Contact', href: '#contact', image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600' },
]

const featuredProducts: Array<[string, string, string]> = [
  ['TC 65/35 Pocketing', 'Pocketing Fabrics', 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=600'],
  ['Woven Fusible Interlining', 'Interlinings', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=600'],
  ['Non-Woven Backing', 'Interlinings', 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=600'],
  ['Shirt Collar Stay', 'Interlinings', 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=600'],
  ['Printed Cotton Pocketing', 'Pocketing Fabrics', 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&q=80&w=600'],
  ['Stretch Trouser Waistband', 'Waistbands', 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=600'],
]

const categoryScenes = [
  {
    id: '01',
    title: 'Pocketing',
    description: 'Crafted to meet international specifications, competing with markets like Japan and China. High-density cotton, TC blended, and twill pocketings engineered for strength.',
    image: 'https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&q=80&w=800',
    type: 'contain',
  },
  {
    id: '02',
    title: 'Interlinings',
    description: 'High-quality shape retention for premium manufacturing. Fusible, non-fusible, woven, and non-woven interlinings tailored for garment stability.',
    image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=800',
    type: 'cover',
  },
  {
    id: '03',
    title: 'Waistbands',
    description: 'Precision-engineered for long-lasting wear and consistent tension. Pre-constructed jacket and trouser waistbands with custom rubberized grip tape.',
    image: 'https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?auto=format&fit=crop&q=80&w=800',
    type: 'cover',
  },
  {
    id: '04',
    title: 'Trims',
    description: 'A comprehensive suite of export-quality trims. Custom brand labels, seam tapes, and accessories meeting international Oeko-Tex standards.',
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&q=80&w=800',
    type: 'contain',
  },
]

const servicePoints = [
  'OEKO-TEX Standard 100 Certified',
  'High-Speed Air-Jet Looms',
  'Custom Color Matching & Dyeing',
  'Strict Tensile & Wash Fastness',
  'Bulk Supply for Global Brands',
  'In-House Testing Facility',
  'Fast Turnaround Times',
  'American Eagle Partner',
]

let animationFrame = 0
let lastY = 0

onMounted(() => {
  document.documentElement.classList.add('js')

  // Loader progress simulation
  const duration = 1100
  const startedAt = window.performance.now()
  const updateProgress = (now: number) => {
    const progress = Math.min(100, Math.round(((now - startedAt) / duration) * 100))
    loadingProgress.value = progress
    if (progress < 100) {
      animationFrame = requestAnimationFrame(updateProgress)
    } else {
      loaded.value = true
    }
  }
  animationFrame = requestAnimationFrame(updateProgress)

  // IntersectionObserver reveal logic
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const elements = document.querySelectorAll('[data-reveal]')
  if (reduced || !('IntersectionObserver' in window)) {
    elements.forEach((el) => el.classList.add('is-visible'))
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -7% 0px' }
    )
    elements.forEach((el) => observer.observe(el))
  }

  // Horizontal Scroll & Parallax logic
  const horizontal = document.querySelector<HTMLElement>('[data-horizontal]')
  const sticky = document.querySelector<HTMLElement>('[data-horizontal-sticky]')
  const track = document.querySelector<HTMLElement>('[data-horizontal-track]')
  const heroImage = document.querySelector<HTMLElement>('[data-hero-image]')
  const heroWord = document.querySelector<HTMLElement>('[data-hero-word]')
  const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))

  const measure = () => {
    if (!horizontal || !sticky || !track) return
    if (window.innerWidth < 840 || reduced) {
      horizontal.style.height = 'auto'
      track.style.transform = ''
      return
    }
    const travel = Math.max(0, track.scrollWidth - sticky.clientWidth)
    horizontal.style.height = `${Math.ceil(travel + sticky.clientHeight)}px`
  }

  const update = () => {
    const y = window.scrollY
    headerHidden.value = y > lastY && y > 180 && !menuOpen.value
    lastY = y

    if (!reduced) {
      if (heroImage) heroImage.style.transform = `scale(1.055) translate3d(0, ${Math.min(y * 0.055, 70)}px, 0)`
      if (heroWord) {
        const wordX = window.innerWidth < 840 ? 0 : -50
        heroWord.style.transform = `translate3d(${wordX}%, ${Math.min(y * 0.095, 120)}px, 0)`
      }
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect()
        const speed = Number(item.dataset.parallax || 0.04)
        const offset = (window.innerHeight * 0.5 - rect.top - rect.height * 0.5) * speed
        item.style.transform = `translate3d(0, ${offset}px, 0)`
      })
    }

    if (horizontal && sticky && track && window.innerWidth >= 840 && !reduced) {
      const rect = horizontal.getBoundingClientRect()
      const travel = Math.max(0, track.scrollWidth - sticky.clientWidth)
      const distance = Math.max(1, horizontal.offsetHeight - sticky.clientHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / distance))
      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`

      const scenes = track.querySelectorAll<HTMLElement>('.category-scene')
      scenes.forEach((scene, index) => {
        const sceneProgress = progress * (categoryScenes.length - 1) - index
        scene.style.setProperty('--scene-shift', `${Math.max(-1, Math.min(1, sceneProgress)) * -18}px`)
        scene.style.setProperty('--scene-scale', `${1 - Math.min(0.035, Math.abs(sceneProgress) * 0.035)}`)
      })
      const active = Math.min(categoryScenes.length, Math.max(1, Math.round(progress * (categoryScenes.length - 1)) + 1))
      sceneIndex.value = String(active).padStart(2, '0')
    }
  }

  const handleScroll = () => {
    cancelAnimationFrame(animationFrame)
    animationFrame = requestAnimationFrame(update)
  }

  measure()
  update()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', measure)
  window.addEventListener('resize', handleScroll)

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', measure)
    window.removeEventListener('resize', handleScroll)
  })
})
</script>

<template>
  <div>
    <a class="skip-link" href="#main-content">Skip to content</a>

    <Loader :loaded="loaded" :loading-progress="loadingProgress" />

    <SiteHeader
      :header-hidden="headerHidden"
      :menu-open="menuOpen"
      @toggle-menu="menuOpen = !menuOpen"
      @close-menu="menuOpen = false"
    />

    <SiteMenu
      :menu-open="menuOpen"
      :nav-items="navItems"
      @close-menu="menuOpen = false"
    />

    <main id="main-content">
      <HeroSection />
      <IntroSection :service-points="servicePoints" />
      <WhyMatters />
      <VentureStats />
      <FactoryAbout />
      <ProductRail title="Featured Accessories" :items="featuredProducts" tone="cream" />
      <CategoryTheatre :category-scenes="categoryScenes" :scene-index="sceneIndex" />
      <OriginPanel />
      <SustainabilityCTA />
      <FooterSection />
    </main>
  </div>
</template>
