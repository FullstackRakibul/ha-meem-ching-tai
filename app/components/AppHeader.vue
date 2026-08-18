<template>
  <!-- The pill is `rounded-full` only while it is a single row. Once the mobile
       menu expands, the header becomes a tall panel and a full radius would
       bow the sides absurdly — so the radius drops to `rounded-3xl` and the
       shape animates between the two. -->
  <header
    class="fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] sm:w-[calc(100%-2rem)] bg-white/80 backdrop-blur-xl shadow-xl border border-white/30 transition-all duration-500 ease-in-out"
    :class="[
      mobileOpen ? 'rounded-3xl' : 'rounded-full',
      scrolled ? 'max-w-lg px-4 sm:px-6 py-2' : 'max-w-7xl px-3 sm:px-2 py-2',
    ]"
  >
    <div class="flex items-center justify-between w-full gap-2">
      <!-- Left: Logo.
           Desktop: the full legal name, collapsed to zero width when scrolled.
           Mobile: the full name never fits in a pill, so the short logo mark is
           shown instead and it does NOT collapse — otherwise the mobile header
           scrolls down to a bar containing nothing but a hamburger. -->
      <div
        class="flex items-center gap-2 text-primary-900 font-bold tracking-tight shrink-0 min-w-0"
      >
        <!-- Mobile / tablet mark -->
        <span class="lg:hidden text-sm sm:text-base whitespace-nowrap">HCTPAL</span>

        <!-- Desktop full name -->
        <span
          class="hidden lg:inline transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
          :class="scrolled ? 'opacity-0 w-0 ml-0' : 'opacity-100 w-auto ml-2 text-sm'"
        >
          HAMEEM CHING TAI POCKETING &amp; ACCESSORIES LTD.
        </span>
      </div>

      <!-- Center: Nav. `hidden lg:flex` is the fix for the mobile overflow —
           previously this rendered on phones alongside the hamburger and burst
           out of the pill. -->
      <nav
        class="hidden lg:flex items-center justify-center gap-6 lg:gap-8 font-medium tracking-wide uppercase text-primary-900 transition-all duration-500 ease-in-out flex-1"
        :class="scrolled ? 'text-xs' : 'text-sm'"
      >
        <ULink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="text-primary-900 hover:text-secondary transition-colors whitespace-nowrap"
        >
          {{ link.label }}
        </ULink>
      </nav>

      <!-- Right: CTA. Desktop only — on mobile it lives inside the drawer. -->
      <div
        class="hidden lg:flex items-center shrink-0 transition-all duration-500 ease-in-out overflow-hidden whitespace-nowrap"
        :class="scrolled ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
      >
        <UButton
          label="Development milestones"
          trailing-icon="i-heroicons-arrow-right-20-solid"
          class="bg-primary hover:bg-secondary text-white font-medium rounded-full px-6 py-2.5 text-sm transition-colors"
        />
      </div>

      <!-- Hamburger / close toggle -->
      <button
        type="button"
        class="lg:hidden flex items-center justify-center w-10 h-10 rounded-full text-primary-900 shrink-0 hover:bg-primary/5 transition-colors"
        :aria-expanded="mobileOpen"
        aria-controls="mobile-nav"
        :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        @click="mobileOpen = !mobileOpen"
      >
        <UIcon
          :name="
            mobileOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'
          "
          class="text-2xl"
        />
      </button>
    </div>

    <!-- Mobile drawer.
         Animated by max-height rather than v-if so it slides open and closed
         instead of popping. max-h is capped against the viewport (minus the
         header's own offset) and scrolls internally, so a long menu can never
         run off the bottom of a short phone screen. -->
    <div
      id="mobile-nav"
      class="lg:hidden overflow-hidden transition-[max-height,opacity] duration-400 ease-in-out"
      :class="mobileOpen ? 'max-h-[calc(100dvh-6rem)] opacity-100' : 'max-h-0 opacity-0'"
    >
      <nav
        class="mt-3 pt-3 border-t border-gray-200/80 flex flex-col text-sm uppercase font-medium text-primary-900 overflow-y-auto"
      >
        <ULink
          v-for="link in navLinks"
          :key="link.label"
          :to="link.to"
          class="py-3 px-2 rounded-xl hover:bg-primary/5 transition-colors"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </ULink>

        <UButton
          label="Development milestones"
          trailing-icon="i-heroicons-arrow-right-20-solid"
          block
          class="mt-3 mb-1 bg-primary hover:bg-secondary text-white font-medium rounded-full py-2.5 text-sm transition-colors"
          @click="mobileOpen = false"
        />
      </nav>
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

const updateScrolled = useDebounceFn(() => {
  scrolled.value = y.value > 50;
}, 50);

watch(y, updateScrolled);

// Collapsing the header to `max-w-lg` while the drawer is open would yank the
// panel narrower mid-interaction. Scrolling with the menu open closes it
// instead, which is also what a user tapping outside the pill expects.
watch(y, () => {
  if (mobileOpen.value) mobileOpen.value = false;
});

// Returning to desktop width must not strand the drawer open — its container
// is `lg:hidden`, so the state would persist invisibly and the next mobile
// resize would show it already expanded.
onMounted(() => {
  const mq = window.matchMedia("(min-width: 1024px)");
  const onChange = (e) => {
    if (e.matches) mobileOpen.value = false;
  };
  mq.addEventListener("change", onChange);
  onBeforeUnmount(() => mq.removeEventListener("change", onChange));
});
</script>
