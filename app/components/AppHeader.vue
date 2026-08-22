<template>
  <!-- Floating glassmorphism pill header.
       Border-radius transitions smoothly between `rounded-full` (closed pill)
       and `rounded-2xl` (open panel) via `transition-all` on the container.
       The radius change is driven by `panelShape` which leads the menu open
       and trails the menu close — so the shape settles before content appears
       and lingers after content leaves. -->
  <header ref="headerRef"
    class="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] bg-white/80 backdrop-blur-xl shadow-xl border border-white/30 overflow-hidden transition-all duration-500 ease-in-out"
    :class="[
      panelShape ? 'rounded-2xl' : 'rounded-full',
      scrolled ? 'max-w-lg px-4 sm:px-6 py-2' : 'max-w-7xl px-3 sm:px-2 py-2',
    ]">
    <div class="flex items-center justify-between w-full gap-2">
      <!-- Left: Logo.
           Desktop: the full legal name, collapsed to zero width when scrolled.
           Mobile: the full name never fits in a pill, so the short logo mark is
           shown instead and it does NOT collapse — otherwise the mobile header
           scrolls down to a bar containing nothing but a hamburger. -->
      <div class="flex items-center gap-2 text-primary-700 font-bold tracking-tight shrink-0 min-w-0">
        <!-- Mobile / tablet mark -->
        <span class="lg:hidden text-sm sm:text-base whitespace-nowrap">HCTPAL</span>

        <!-- Desktop full name -->
        <span class="hidden lg:inline transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :class="scrolled ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-2 text-sm'">
          HAMEEM CHING TAI POCKETING &amp; ACCESSORIES LTD.
        </span>
      </div>

      <!-- Center: Nav. `hidden lg:flex` is the fix for the mobile overflow —
           previously this rendered on phones alongside the hamburger and burst
           out of the pill. -->
      <nav
        class="hidden lg:flex items-center justify-center gap-6 lg:gap-8 font-medium tracking-wide uppercase text-brand-700 transition-all duration-500 ease-in-out flex-1"
        :class="scrolled ? 'text-xs' : 'text-sm'">
        <ULink v-for="link in navLinks" :key="link.label" :to="link.to"
          class="text-brand-700 hover:text-secondary transition-colors whitespace-nowrap">
          {{ link.label }}
        </ULink>
      </nav>

      <!-- Right: CTA. Desktop only — on mobile it lives inside the drawer. -->
      <div
        class="hidden lg:flex items-center shrink-0 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
        :class="scrolled ? 'opacity-0 w-0' : 'opacity-100 w-auto'">
        <UButton label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid"
          class="bg-primary hover:bg-secondary text-white font-medium rounded-full px-6 py-2.5 text-sm transition-colors" />
      </div>

      <!-- Hamburger / close toggle.
           The button rotates 180° when the menu opens, creating a smooth spin
           morph between the bars ☰ and the × icons. -->
      <button type="button"
        class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-brand-700 shrink-0 hover:bg-brand-600 transition-all duration-300 ease-in-out"
        :class="mobileOpen ? 'rotate-180' : 'rotate-0'" :aria-expanded="mobileOpen" aria-controls="mobile-nav"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'" @click="toggleMenu">
        <UIcon :name="mobileOpen
          ? 'i-heroicons-x-mark-20-solid'
          : 'i-heroicons-bars-3-20-solid'
          " class="text-2xl" />
      </button>
    </div>

    <!-- Mobile drawer.
         Animated with Vue <Transition> for a clean fade + slide-up entrance
         and a faster fade + slide-down exit.
         @before-enter / @after-leave toggle `panelShape` so the border-radius
         leads the open and trails the close — the pill reshapes before content
         appears and lingers after content leaves.
         overflow-hidden on the <header> clips the menu to the rounded edges
         throughout the animation. -->
    <!-- <Transition enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3 scale-[0.98]" enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-3 scale-[0.98]" @before-enter="panelShape = true"
      @after-leave="panelShape = false">
      <div v-if="mobileOpen" id="mobile-nav" class="lg:hidden">
        <nav
          class="mt-3 pt-3 border-t border-gray-200/80 flex flex-col text-sm uppercase font-medium text-brand-600 overflow-y-auto">
          <ULink v-for="(link, index) in navLinks" :key="link.label" :to="link.to"
            class="py-3 px-3 rounded-xl hover:bg-brand-600 hover:text-white transition-all duration-300 ease-out"
            :style="{ transitionDelay: `${(index + 1) * 40}ms` }" @click="closeMenu">
            {{ link.label }}
          </ULink>

          <UButton label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid" block
            class="mt-3 mb-1 bg-primary hover:bg-secondary text-white font-medium rounded-full py-2.5 text-sm transition-all duration-300 ease-out"
            :style="{ transitionDelay: `${(navLinks.length + 1) * 40}ms` }" @click="closeMenu" />
        </nav>
      </div>
    </Transition> -->
    <!-- Mobile drawer. -->
    <div class="grid transition-all duration-500 ease-in-out lg:hidden"
      :class="mobileOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'"
      @transitionstart="mobileOpen && (panelShape = true)" @transitionend="!mobileOpen && (panelShape = false)">
      <div class="overflow-hidden">
        <nav
          class="mt-3 pt-3 border-t border-gray-200/80 flex flex-col text-sm uppercase font-medium text-brand-600 overflow-y-auto">

          <ULink v-for="(link, index) in navLinks" :key="link.label" :to="link.to"
            class="py-3 px-3 rounded-xl hover:bg-brand-600 hover:text-white transition-all duration-300 ease-out"
            :style="{ transitionDelay: mobileOpen ? `${(index + 1) * 40}ms` : '0ms' }" @click="closeMenu">
            {{ link.label }}
          </ULink>

          <UButton label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid" block
            class="mt-3 mb-1 bg-primary hover:bg-secondary text-white font-medium rounded-full py-2.5 text-sm transition-all duration-300 ease-out"
            :style="{ transitionDelay: mobileOpen ? `${(navLinks.length + 1) * 40}ms` : '0ms' }" @click="closeMenu" />

        </nav>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useWindowScroll, useDebounceFn } from "@vueuse/core";

// Single source of truth: the desktop bar and the mobile drawer render from
// the same list, so they can no longer drift apart (the old markup had "The
// facility" in the mobile menu only).
const navLinks = [
  { label: "Home", to: "#" },
  { label: "Why it matters", to: "#" },
  { label: "The venture at a glance", to: "#" },
  { label: "The facility", to: "#" },
];

const { y } = useWindowScroll();
const scrolled = ref(false);
const mobileOpen = ref(false);

// Controls the border-radius independently from the menu visibility.
// Leads the open (set before content enters) and trails the close (cleared
// after content leaves) so the pill → panel shape change never fights the
// menu animation.
const panelShape = ref(false);

const toggleMenu = () => {
  mobileOpen.value = !mobileOpen.value;
};

const closeMenu = () => {
  mobileOpen.value = false;
};

const updateScrolled = useDebounceFn(() => {
  scrolled.value = y.value > 50;
}, 50);

watch(y, updateScrolled);

// Collapsing the header to `max-w-lg` while the drawer is open would yank the
// panel narrower mid-interaction. Scrolling with the menu open closes it
// instead, which is also what a user tapping outside the pill expects.
watch(y, () => {
  if (mobileOpen.value) closeMenu();
});

// Returning to desktop width must not strand the drawer open — its container
// is `lg:hidden`, so the state would persist invisibly and the next mobile
// resize would show it already expanded.
onMounted(() => {
  const mq = window.matchMedia("(min-width: 1024px)");
  const onChange = (e) => {
    if (e.matches) closeMenu();
  };
  mq.addEventListener("change", onChange);
  onBeforeUnmount(() => mq.removeEventListener("change", onChange));
});
</script>