<!-- pages/index.vue -->
<script setup lang="ts">
/**
 * The Loom OS — landing page.
 *
 * Story order is the argument: boot → product lines → the Short Thread
 * (lead time) → output & jobs → the factory at dawn → collections →
 * catalogue → sun & water at dusk → partnership → contact.
 *
 * This page owns no scroll code. Each section registers its own GSAP work
 * through `useScrollScene`; `LoomStage` is the single WebGL canvas.
 */

import SiteMenu from "~/components/landing/SiteMenu.vue";
import LoomStage from "~/components/landing/LoomStage.vue";
import StatusRail from "~/components/landing/StatusRail.vue";
// import WhatsAppButton from "~/components/landing/WhatsAppButton.vue";
import HeroSection from "~/components/landing/HeroSection.vue";
import IntroSection from "~/components/landing/IntroSection.vue";
import WhyMatters from "~/components/landing/WhyMatters.vue";
import VentureStats from "~/components/landing/VentureStats.vue";
import FactoryAbout from "~/components/landing/FactoryAbout.vue";
import CategoryTheatre from "~/components/landing/CategoryTheatre.vue";
import ProductRail from "~/components/landing/ProductRail.vue";
import SustainabilitySection from "~/components/landing/SustainabilitySection.vue";
import OriginPanel from "~/components/landing/OriginPanel.vue";
import FooterSection from "~/components/landing/FooterSection.vue";
import ScrollTracer from "~/components/ScrollTracer.vue";

useHead({
  title: "Ha-Meem Ching Tai | World-Class Pocketing & Garment Accessories Manufacturing",
  meta: [
    {
      name: "description",
      content:
        "A joint venture between Ha-Meem Group and Ching Tai. We manufacture export-quality pocketing fabrics, interlinings, and trims in Bangladesh to reduce lead times and strengthen the backward linkage industry.",
    },
  ],
});

const { t } = useLocale();
const { $lenis } = useNuxtApp();
const menuOpen = ref(false);

// While the menu is open the page underneath must not scroll.
watch(menuOpen, (open) => {
  document.body.classList.toggle("menu-open", open);
  if (open) $lenis.value?.stop();
  else $lenis.value?.start();
});

const IMG = "https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai";

const navItems = computed(() => [
  { label: t("navHome"), href: "#top", image: `${IMG}31.jpeg` },
  { label: t("navWhyMatters"), href: "#why-matters", image: `${IMG}50.jpeg` },
  { label: t("navMilestones"), href: "#milestones", image: `${IMG}40.jpeg` },
  { label: t("navFactory"), href: "#factory", image: `${IMG}03.jpeg` },
  { label: t("navProducts"), href: "#collections", image: `${IMG}51.jpeg` },
  { label: t("navSustainability"), href: "#sustainability", image: `${IMG}34.jpeg` },
  { label: t("navContact"), href: "#contact", image: `${IMG}12.jpeg` },
]);

const featuredProducts = computed<Array<[string, string, string]>>(() => [
  [t("product1"), t("catPocketing"), `${IMG}5001.jpeg`],
  [t("product1"), t("catPocketing"), `${IMG}5002.jpeg`],
  [t("product2"), t("catInterlinings"), `${IMG}5003.jpeg`],
  [t("product3"), t("catInterlinings"), `${IMG}5004.jpeg`],
  [t("product4"), t("catInterlinings"), `${IMG}5005.jpeg`],
  [t("product5"), t("catPocketing"), `${IMG}5006.jpeg`],
  [t("product6"), t("catWaistbands"), `${IMG}5007.jpeg`],
  [t("product6"), t("catWaistbands"), `${IMG}5008.jpeg`],
  [t("product6"), t("catWaistbands"), `${IMG}5009.jpeg`],
  [t("product6"), t("catWaistbands"), `${IMG}5010.jpeg`],
  [t("product6"), t("catWaistbands"), `${IMG}5011.jpeg`],
  [t("product6"), t("catWaistbands"), `${IMG}5012.jpeg`],
]);

const categoryScenes = computed(() => [
  {
    id: "01",
    title: t("scene1Title"),
    description: t("scene1Desc"),
    image: `${IMG}19.jpeg`,
    type: "contain",
  },
  {
    id: "02",
    title: t("scene2Title"),
    description: t("scene2Desc"),
    image: `${IMG}17.jpeg`,
    type: "cover",
  },
  {
    id: "03",
    title: t("scene3Title"),
    description: t("scene3Desc"),
    image: `${IMG}13.jpeg`,
    type: "cover",
  },
  {
    id: "04",
    title: t("scene4Title"),
    description: t("scene4Desc"),
    image: `${IMG}11.jpeg`,
    type: "contain",
  },
]);

const servicePoints = computed(() => [
  t("service1"),
  t("service2"),
  t("service3"),
  t("service4"),
  t("service5"),
  t("service6"),
  t("service7"),
  t("service8"),
]);
</script>

<template>
  <div>
    <a class="skip-link" href="#main-content">{{ t("skipToContent") }}</a>
    <ScrollTracer :nav-items="navItems" />

    <!-- <SiteHeader
      :menu-open="menuOpen"
      @toggle-menu="menuOpen = !menuOpen"
      @close-menu="menuOpen = false"
    /> -->
    <AppHeader
      :menu-open="menuOpen"
      @toggle-menu="menuOpen = !menuOpen"
      @close-menu="menuOpen = false"
    />
    <SiteMenu
      :menu-open="menuOpen"
      :nav-items="navItems"
      @close-menu="menuOpen = false"
    />

    <ClientOnly>
      <LoomStage :menu-open="menuOpen" />
    </ClientOnly>

    <main id="main-content">
      <MainHeroSectionContainer />
      <HeroSection />
      <IntroSection :service-points="servicePoints" />
      <FabricIndexDirectory />
      <WhyMatters />
      <VentureStats />
      <FactoryAbout />
      <CategoryTheatre :category-scenes="categoryScenes" />
      <ProductRail :title="t('featuredTitle')" :items="featuredProducts" />
      <SustainabilitySection />
      <OriginPanel />
      <FooterSection />
    </main>

    <StatusRail />
    <!-- <WhatsAppButton /> -->
  </div>
</template>
