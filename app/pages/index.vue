<!-- pages/index.vue -->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import Loader from "~/components/landing/Loader.vue";
import SiteHeader from "~/components/landing/SiteHeader.vue";
import SiteMenu from "~/components/landing/SiteMenu.vue";
import HeroSection from "~/components/landing/HeroSection.vue";
import IntroSection from "~/components/landing/IntroSection.vue";
import WhyMatters from "~/components/landing/WhyMatters.vue";
import VentureStats from "~/components/landing/VentureStats.vue";
import FactoryAbout from "~/components/landing/FactoryAbout.vue";
import ProductRail from "~/components/landing/ProductRail.vue";
import CategoryTheatre from "~/components/landing/CategoryTheatre.vue";
import OriginPanel from "~/components/landing/OriginPanel.vue";
import SustainabilityCTA from "~/components/landing/SustainabilityCTA.vue";
import FooterSection from "~/components/landing/FooterSection.vue";
import SustainabilitySection from "~/components/landing/SustainabilitySection.vue";
useHead({
  title: "Ha-Meem Ching Tai | World-Class Pocketing & Garment Accessories Manufacturing",
  meta: [
    {
      name: "description",
      content:
        "A joint venture between Ha-Meem Group and Ching Tai. We manufacture export-quality pocketing fabrics, interlinings, and trims in Bangladesh to drastically reduce lead times and strengthen the backward linkage industry.",
    },
  ],
});

const loaded = ref(false);
const loadingProgress = ref(0);
const menuOpen = ref(false);
const headerHidden = ref(false);
const sceneIndex = ref("01");

const { t } = useLocale();

const navItems = computed(() => [
  { label: t("navHome"), href: "#top", image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai48.jpeg" },
  { label: t("navWhyMatters"), href: "#why-matters", image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai50.jpeg" },
  { label: t("navProducts"), href: "#collections", image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai51.jpeg" },
  { label: t("navFactory"), href: "#factory", image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai52.jpeg" },
  { label: t("navContact"), href: "#contact", image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai53.jpeg" },
]);

const featuredProducts = computed<Array<[string, string, string]>>(() => [
  [t("product1"), t("catPocketing"), "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg"],
  [t("product2"), t("catInterlinings"), "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai05.jpeg"],
  [t("product3"), t("catInterlinings"), "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai15.jpeg"],
  [t("product4"), t("catInterlinings"), "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg"],
  [t("product5"), t("catPocketing"), "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg"],
  [t("product6"), t("catWaistbands"), "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai18.jpeg"],
]);

const categoryScenes = computed(() => [
  { id: "01", title: t("scene1Title"), description: t("scene1Desc"), image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai19.jpeg", type: "contain" },
  { id: "02", title: t("scene2Title"), description: t("scene2Desc"), image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai17.jpeg", type: "cover" },
  { id: "03", title: t("scene3Title"), description: t("scene3Desc"), image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai13.jpeg", type: "cover" },
  { id: "04", title: t("scene4Title"), description: t("scene4Desc"), image: "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai11.jpeg", type: "contain" },
]);

const servicePoints = computed(() => [
  t("service1"), t("service2"), t("service3"), t("service4"),
  t("service5"), t("service6"), t("service7"), t("service8"),
]);

let animationFrame = 0;
let lastY = 0;

onMounted(() => {
  document.documentElement.classList.add("js");

  // Loader progress simulation
  const duration = 1100;
  const startedAt = window.performance.now();
  const updateProgress = (now: number) => {
    const progress = Math.min(100, Math.round(((now - startedAt) / duration) * 100));
    loadingProgress.value = progress;
    if (progress < 100) {
      animationFrame = requestAnimationFrame(updateProgress);
    } else {
      loaded.value = true;
    }
  };
  animationFrame = requestAnimationFrame(updateProgress);

  // IntersectionObserver reveal logic
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const elements = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
  }

  // Horizontal Scroll & Parallax logic
  const horizontal = document.querySelector<HTMLElement>("[data-horizontal]");
  const sticky = document.querySelector<HTMLElement>("[data-horizontal-sticky]");
  const track = document.querySelector<HTMLElement>("[data-horizontal-track]");
  const heroImage = document.querySelector<HTMLElement>("[data-hero-image]");
  const heroWord = document.querySelector<HTMLElement>("[data-hero-word]");
  const parallaxItems = Array.from(
    document.querySelectorAll<HTMLElement>("[data-parallax]")
  );

  const measure = () => {
    if (!horizontal || !sticky || !track) return;
    if (window.innerWidth < 840 || reduced) {
      horizontal.style.height = "auto";
      track.style.transform = "";
      return;
    }
    const travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
    horizontal.style.height = `${Math.ceil(travel + sticky.clientHeight)}px`;
  };

  const update = () => {
    const y = window.scrollY;
    headerHidden.value = y > lastY && y > 180 && !menuOpen.value;
    lastY = y;

    if (!reduced) {
      if (heroImage)
        heroImage.style.transform = `scale(1.055) translate3d(0, ${Math.min(
          y * 0.055,
          70
        )}px, 0)`;
      if (heroWord) {
        const wordX = window.innerWidth < 840 ? 0 : -50;
        heroWord.style.transform = `translate3d(${wordX}%, ${Math.min(
          y * 0.095,
          120
        )}px, 0)`;
      }
      parallaxItems.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const speed = Number(item.dataset.parallax || 0.04);
        const offset = (window.innerHeight * 0.5 - rect.top - rect.height * 0.5) * speed;
        item.style.transform = `translate3d(0, ${offset}px, 0)`;
      });
    }

    if (horizontal && sticky && track && window.innerWidth >= 840 && !reduced) {
      const rect = horizontal.getBoundingClientRect();
      const travel = Math.max(0, track.scrollWidth - sticky.clientWidth);
      const distance = Math.max(1, horizontal.offsetHeight - sticky.clientHeight);
      const progress = Math.min(1, Math.max(0, -rect.top / distance));
      track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`;

      const scenes = track.querySelectorAll<HTMLElement>(".category-scene");
      scenes.forEach((scene, index) => {
        const sceneProgress = progress * (categoryScenes.value.length - 1) - index;
        scene.style.setProperty(
          "--scene-shift",
          `${Math.max(-1, Math.min(1, sceneProgress)) * -18}px`
        );
        scene.style.setProperty(
          "--scene-scale",
          `${1 - Math.min(0.035, Math.abs(sceneProgress) * 0.035)}`
        );
      });
      const active = Math.min(
        categoryScenes.value.length,
        Math.max(1, Math.round(progress * (categoryScenes.value.length - 1)) + 1)
      );
      sceneIndex.value = String(active).padStart(2, "0");
    }
  };

  const handleScroll = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(update);
  };

  measure();
  update();
  window.addEventListener("scroll", handleScroll, { passive: true });
  window.addEventListener("resize", measure);
  window.addEventListener("resize", handleScroll);

  onBeforeUnmount(() => {
    cancelAnimationFrame(animationFrame);
    window.removeEventListener("scroll", handleScroll);
    window.removeEventListener("resize", measure);
    window.removeEventListener("resize", handleScroll);
  });
});
</script>

<template>
  <div>
    <a class="skip-link" href="#main-content">{{ t('skipToContent') }}</a>

    <!-- <Loader :loaded="loaded" :loading-progress="loadingProgress" /> -->

    <SiteHeader :header-hidden="headerHidden" :menu-open="menuOpen" @toggle-menu="menuOpen = !menuOpen"
      @close-menu="menuOpen = false" />

    <SiteMenu :menu-open="menuOpen" :nav-items="navItems" @close-menu="menuOpen = false" />

    <main id="main-content">
      <HeroSection />
      <IntroSection :service-points="servicePoints" />
      <WhyMatters />
      <VentureStats />
      <FactoryAbout />
      <ProductRail :title="t('featuredTitle')" :items="featuredProducts" tone="cream" />
      <CategoryTheatre :category-scenes="categoryScenes" :scene-index="sceneIndex" />
      <OriginPanel />
      <SustainabilityCTA />
      <SustainabilitySection />
      <FooterSection />
    </main>
  </div>
</template>