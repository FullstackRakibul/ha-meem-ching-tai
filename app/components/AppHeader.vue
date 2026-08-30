<!-- AppHeader.vue -->
<template>
  <header
    class="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] bg-white/80 backdrop-blur-xl shadow-xl border border-white/30 transition-all duration-500 ease-in-out"
    :class="[
      mobileOpen ? 'rounded-3xl' : 'rounded-full',
      scrolled ? 'max-w-lg px-4 sm:px-6 py-2' : 'max-w-7xl px-3 sm:px-2 py-2',
    ]">
    <div class="flex items-center justify-between w-full gap-2">
      <!-- Left: Logo -->
      <div class="flex items-center gap-2 text-primary-900 font-bold tracking-tight shrink-0 min-w-0">
        <span class="lg:hidden text-sm sm:text-base whitespace-nowrap">HCTPAL</span>
        <span class="hidden lg:inline transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :class="scrolled ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-2 text-sm'">
          HAMEEM CHING TAI
        </span>
      </div>

      <!-- Center: Nav with Mega Menu -->
      <nav
        class="hidden lg:flex items-center justify-center gap-6 lg:gap-8 font-medium tracking-wide uppercase text-primary-900 transition-all duration-500 ease-in-out flex-1"
        :class="scrolled ? 'text-xs' : 'text-sm'">
        <div v-for="link in navLinks" :key="link.label" class="relative group" @mouseenter="activeMegaMenu = link.label"
          @mouseleave="activeMegaMenu = null">
          <!-- Nav Link -->
          <ULink :to="link.to"
            class="flex items-center gap-1.5 text-primary-900 hover:text-secondary transition-colors whitespace-nowrap py-2">
            {{ link.label }}
            <UIcon v-if="link.megaMenu" name="i-heroicons-chevron-down-20-solid"
              class="w-3.5 h-3.5 transition-transform duration-300"
              :class="activeMegaMenu === link.label ? 'rotate-180' : ''" />
          </ULink>

          <!-- Mega Menu Dropdown -->
          <Transition enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-3 scale-[0.98]" enter-to-class="opacity-100 translate-y-0 scale-100"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0 scale-100"
            leave-to-class="opacity-0 translate-y-3 scale-[0.98]">
            <div v-if="link.megaMenu && activeMegaMenu === link.label"
              class="absolute top-full left-1/2 -translate-x-1/2 pt-4 w-170 md:min-w-6xl">
              <div class="bg-white rounded-2xl shadow-2xl border border-gray-100/80 overflow-hidden">
                <!-- Mega Menu Content -->
                <div class="flex">
                  <!-- Left: Featured Panel -->
                  <div class="w-65 relative overflow-hidden shrink-0" :style="{
                    background: link.megaMenu.featured.gradient,
                  }">
                    <!-- Abstract Pattern SVG -->
                    <svg class="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 260 400" fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <circle cx="200" cy="50" r="120" stroke="currentColor" stroke-width="0.5" />
                      <circle cx="180" cy="80" r="90" stroke="currentColor" stroke-width="0.5" />
                      <circle cx="220" cy="40" r="140" stroke="currentColor" stroke-width="0.5" />
                      <path d="M0 200 Q 130 150, 260 200" stroke="currentColor" stroke-width="0.5" fill="none" />
                      <path d="M0 240 Q 130 190, 260 240" stroke="currentColor" stroke-width="0.5" fill="none" />
                      <path d="M0 280 Q 130 230, 260 280" stroke="currentColor" stroke-width="0.5" fill="none" />
                    </svg>

                    <div class="relative p-6 h-full flex flex-col justify-between text-white">
                      <div>
                        <div
                          class="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4">
                          <!-- Custom Icon -->
                          <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5" stroke-linecap="round"
                              stroke-linejoin="round" />
                            <path d="M2 12l10 5 10-5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>
                        <h3 class="text-lg font-semibold leading-tight mb-2">
                          {{ link.megaMenu.featured.title }}
                        </h3>
                        <p class="text-sm text-white/80 leading-relaxed">
                          {{ link.megaMenu.featured.description }}
                        </p>
                      </div>

                      <ULink :to="link.megaMenu.featured.ctaLink"
                        class="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/80 transition-colors mt-4 group/link">
                        {{ link.megaMenu.featured.ctaLabel }}
                        <svg class="w-4 h-4 transition-transform group-hover/link:translate-x-1" viewBox="0 0 24 24"
                          fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M5 12h14M12 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </ULink>
                    </div>
                  </div>

                  <!-- Right: Menu Grid -->
                  <div class="flex-1 p-6">
                    <!-- Section Title -->
                    <div class="flex items-center gap-3 mb-5">
                      <div class="h-px flex-1 bg-linear-to-r from-gray-200 to-transparent" />
                      <span class="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
                        {{ link.megaMenu.sectionTitle }}
                      </span>
                      <div class="h-px flex-1 bg-linear-to-l from-gray-200 to-transparent" />
                    </div>

                    <!-- Items Grid -->
                    <div class="grid grid-cols-2 gap-2">
                      <ULink v-for="item in link.megaMenu.items" :key="item.label" :to="item.to"
                        class="group/item flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-200">
                        <!-- Icon Container -->
                        <div
                          class="w-10 h-10 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0 transition-transform duration-200 group-hover/item:scale-110"
                          :class="item.iconBg">
                          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="1.5">
                            <path :d="item.iconPath" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </div>

                        <!-- Text -->
                        <div class="min-w-0">
                          <div class="flex items-center gap-1.5">
                            <span
                              class="text-sm font-semibold text-gray-900 group-hover/item:text-primary-900 transition-colors">
                              {{ item.label }}
                            </span>
                            <span v-if="item.badge"
                              class="px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded-full"
                              :class="item.badgeClass">
                              {{ item.badge }}
                            </span>
                          </div>
                          <p class="text-xs text-gray-500 mt-0.5 leading-relaxed line-clamp-2">
                            {{ item.description }}
                          </p>
                        </div>
                      </ULink>
                    </div>

                    <!-- Bottom CTA -->
                    <div class="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <p class="text-xs text-gray-400">
                        {{ link.megaMenu.footerText }}
                      </p>
                      <ULink :to="link.megaMenu.footerLink"
                        class="text-xs font-semibold text-primary-900 hover:text-secondary transition-colors flex items-center gap-1">
                        View all
                        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                          <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </ULink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </nav>

      <!-- Right: CTA -->
      <div
        class="hidden lg:flex items-center shrink-0 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
        :class="scrolled ? 'opacity-0 w-0' : 'opacity-100 w-auto'">
        <UButton label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid"
          class="bg-primary hover:bg-secondary text-white font-medium rounded-full px-6 py-2.5 text-sm transition-colors" />
      </div>

      <!-- Hamburger -->
      <button type="button"
        class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-primary-900 shrink-0 hover:bg-primary/5 transition-colors"
        :aria-expanded="mobileOpen" aria-controls="mobile-nav" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        @click="mobileOpen = !mobileOpen">
        <UIcon :name="mobileOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'
          " class="text-2xl" />
      </button>
    </div>

    <!-- Mobile drawer -->
    <div id="mobile-nav" class="lg:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out"
      :class="mobileOpen ? 'max-h-[calc(100dvh-6rem)] opacity-100' : 'max-h-0 opacity-0'">
      <nav
        class="mt-3 pt-3 border-t border-gray-200/80 flex flex-col text-sm uppercase font-medium text-primary-900 overflow-y-auto">
        <ULink v-for="link in allMobileLinks" :key="link.label" :to="link.to"
          class="py-3 px-2 rounded-xl hover:bg-primary/5 transition-colors" @click="mobileOpen = false">
          {{ link.label }}
        </ULink>

        <UButton label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid" block
          class="mt-3 mb-1 bg-primary hover:bg-secondary text-white font-medium rounded-full py-2.5 text-sm transition-colors"
          @click="mobileOpen = false" />
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useWindowScroll, useDebounceFn } from "@vueuse/core";

const activeMegaMenu = ref(null);

const navLinks = [
  {
    label: "Home",
    to: "#",
  },
  {
    label: "Why it matters",
    to: "#",
    megaMenu: {
      featured: {
        gradient: "linear-gradient(145deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        title: "Exceptional Care for Aging with Dignity",
        description: "High-quality caregiving designed around comfort and respect.",
        ctaLabel: "Explore our approach",
        ctaLink: "#",
      },
      sectionTitle: "Special Services",
      items: [
        {
          label: "TPD Claims",
          description: "Provide a lump sum payment for total permanent disability.",
          to: "#",
          iconBg: "from-emerald-400 to-teal-500",
          iconPath:
            "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z",
        },
        {
          label: "Companionship & Support",
          description: "Encourage social interaction and emotional wellbeing.",
          to: "#",
          iconBg: "from-rose-400 to-pink-500",
          iconPath:
            "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
        },
        {
          label: "IP & Salary Claims",
          description: "Replace part of your income during recovery periods.",
          to: "#",
          iconBg: "from-amber-400 to-orange-500",
          iconPath: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
        },
        {
          label: "Terminal Illness Claims",
          description: "Early access to insurance benefits when needed most.",
          to: "#",
          iconBg: "from-violet-400 to-purple-500",
          iconPath: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
          badge: "Soon",
          badgeClass: "bg-violet-100 text-violet-700",
        },
        {
          label: "Trauma Claims",
          description: "Pays a lump sum for serious medical conditions.",
          to: "#",
          iconBg: "from-sky-400 to-blue-500",
          iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
        },
        {
          label: "Property Damage",
          description: "Coverage for events causing property loss.",
          to: "#",
          iconBg: "from-slate-400 to-gray-500",
          iconPath: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
        },
      ],
      footerText: "Need assistance choosing a service?",
      footerLink: "#",
    },
  },
  {
    label: "The venture",
    to: "#",
    megaMenu: {
      featured: {
        gradient: "linear-gradient(145deg, #134e4a 0%, #115e59 50%, #0f766e 100%)",
        title: "Building Tomorrow's Care Infrastructure",
        description: "A venture designed to transform how we support aging populations.",
        ctaLabel: "Discover the vision",
        ctaLink: "#",
      },
      sectionTitle: "At a Glance",
      items: [
        {
          label: "Our Facility",
          description: "State-of-the-art care environment with modern amenities.",
          to: "#",
          iconBg: "from-teal-400 to-emerald-500",
          iconPath: "M3 21h18M5 21V7l8-4 8 4v14M8 21v-9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v9",
        },
        {
          label: "Leadership Team",
          description: "Experienced professionals dedicated to excellence.",
          to: "#",
          iconBg: "from-indigo-400 to-blue-500",
          iconPath:
            "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
        },
        {
          label: "Development Timeline",
          description: "Track our progress and upcoming milestones.",
          to: "#",
          iconBg: "from-amber-400 to-yellow-500",
          iconPath: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
        },
        {
          label: "Investment Overview",
          description: "Financial structure and growth projections.",
          to: "#",
          iconBg: "from-emerald-400 to-green-500",
          iconPath: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
        },
      ],
      footerText: "Interested in partnership opportunities?",
      footerLink: "#",
    },
  },
  {
    label: "The facility",
    to: "#",
    megaMenu: {
      featured: {
        gradient: "linear-gradient(145deg, #7c2d12 0%, #9a3412 50%, #c2410c 100%)",
        title: "Designed for Dignity, Built for Comfort",
        description: "Every detail crafted to enhance quality of life.",
        ctaLabel: "Take a virtual tour",
        ctaLink: "#",
      },
      sectionTitle: "Spaces & Amenities",
      items: [
        {
          label: "Resident Rooms",
          description: "Private suites with personalized climate and lighting.",
          to: "#",
          iconBg: "from-orange-400 to-red-500",
          iconPath:
            "M2 20h20M5 20v-8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8M9 10V6a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v4",
        },
        {
          label: "Common Areas",
          description: "Social spaces designed for connection and activity.",
          to: "#",
          iconBg: "from-rose-400 to-pink-500",
          iconPath:
            "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
        },
        {
          label: "Wellness Center",
          description: "On-site rehabilitation and therapy services.",
          to: "#",
          iconBg: "from-teal-400 to-cyan-500",
          iconPath: "M22 12h-4l-3 9L9 3l-3 9H2",
        },
        {
          label: "Gardens & Grounds",
          description: "Therapeutic outdoor spaces for relaxation.",
          to: "#",
          iconBg: "from-green-400 to-emerald-500",
          iconPath:
            "M12 22c4.97 0 9-4.03 9-9-4.5 0-9 4.5-9 9zM12 22c-4.97 0-9-4.03-9-9 4.5 0 9 4.5 9 9zM12 13c-4.97 0-9-4.03-9-9 4.5 0 9 4.5 9 9zM12 13c4.97 0 9-4.03 9-9-4.5 0-9 4.5-9 9z",
        },
      ],
      footerText: "Schedule an in-person visit?",
      footerLink: "#",
    },
  },
];
const simpleLinks = navLinks.map(({ label, to }) => ({ label, to }));
simpleLinks.push({ label: "Contact us", to: "#" });

const allMobileLinks = [
  ...simpleLinks,
  ...navLinks.flatMap((link) =>
    link.megaMenu
      ? link.megaMenu.items.map(({ label }) => ({ label, to: "#" }))
      : []
  ),
];
const { y } = useWindowScroll();
const scrolled = ref(false);
const mobileOpen = ref(false);

const updateScrolled = useDebounceFn(() => {
  scrolled.value = y.value > 50;
}, 50);

watch(y, updateScrolled);

watch(y, () => {
  if (mobileOpen.value) mobileOpen.value = false;
});

onMounted(() => {
  const mq = window.matchMedia("(min-width: 1024px)");
  const onChange = (event) => {
    if (event.matches) mobileOpen.value = false;
  };
  mq.addEventListener("change", onChange);
  onBeforeUnmount(() => mq.removeEventListener("change", onChange));
});
</script>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.mobile-enter-active,
.mobile-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>