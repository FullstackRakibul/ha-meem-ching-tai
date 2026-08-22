<template>
  <header
    class="fixed left-1/2 top-4 z-50 w-[calc(100%-8em)] -translate-x-1/2 rounded-full border border-slate-200 bg-white text-brand-900 shadow-lg transition-all duration-300 lg:w-[calc(100%-3rem)]"
    :class="scrolled ? 'max-w-5xl' : 'max-w-7xl'" @keydown.esc="closeDesktopMenu">
    <div class="mx-auto flex items-center justify-between gap-6 px-5 transition-all duration-300 lg:px-4"
      :class="scrolled ? 'py-2' : 'py-2'">
      <ULink to="#" class="flex shrink-0 items-center gap-3" aria-label="Hameem Ching Tai home"
        @click="closeDesktopMenu">
        <span class="grid size-12 place-items-center">
          <img :src=mainLogo alt="Ha-Meem Ching Tai" class="h-12 w-auto object-contain">
        </span>
      </ULink>

      <nav class="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
        <ULink v-for="link in simpleLinks" :key="link.label" :to="link.to"
          class="rounded-lg px-4 py-2 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50 hover:text-brand-700"
          @click="closeDesktopMenu">
          {{ link.label }}
        </ULink>
        <button v-for="menu in menuGroups" :key="menu.label" type="button"
          class="flex items-center gap-1 rounded-lg px-4 py-2 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-50 hover:text-brand-700"
          :aria-expanded="activeMenu === menu.label" @mouseenter="openDesktopMenu(menu.label)"
          @focus="openDesktopMenu(menu.label)" @click="toggleDesktopMenu(menu.label)">
          {{ menu.label }}
          <UIcon name="i-heroicons-chevron-down-20-solid" class="size-4 transition-transform"
            :class="activeMenu === menu.label ? 'rotate-180' : ''" />
        </button>
      </nav>

      <div class="hidden items-center gap-3 lg:flex">
        <UButton to="#" label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid"
          class="rounded-full bg-brand-700 px-5 py-2.5 font-semibold text-white hover:bg-brand-800"
          @click="closeDesktopMenu" />
      </div>

      <button type="button"
        class="grid size-10 place-items-center rounded-lg text-brand-900 hover:bg-brand-50 lg:hidden"
        :aria-expanded="mobileOpen" aria-controls="mobile-nav" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        @click="mobileOpen = !mobileOpen">
        <UIcon :name="mobileOpen
          ? 'i-heroicons-x-mark-20-solid'
          : 'i-heroicons-bars-3-20-solid'
          " class="size-6" />
      </button>
    </div>

    <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0 translate-y-3"
      enter-to-class="opacity-100 translate-y-0" leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-3">
      <div v-if="activeMenu"
        class="absolute inset-x-0 top-full hidden border-b border-slate-400 mt-6 rounded-lg bg-white shadow-xl lg:block"
        @mouseenter="cancelClose" @mouseleave="scheduleClose">
        <div class="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-8 py-8">
          <div class="col-span-8 grid grid-cols-2 gap-x-10 gap-y-8">
            <section v-for="column in activeGroup.columns" :key="column.title">
              <p class="mb-4 text-xs font-bold uppercase tracking-widest text-brand-600">
                {{ column.title }}
              </p>
              <div class="grid gap-2">
                <ULink v-for="item in column.items" :key="item.label" to="#"
                  class="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-brand-50" @click="closeDesktopMenu">
                  <span
                    class="grid size-10 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-brand-700 shadow-sm">
                    <UIcon :name="item.icon" class="size-5" />
                  </span>
                  <span><strong class="block text-sm text-brand-900">{{
                    item.label
                      }}</strong><span class="mt-1 block text-sm leading-5 text-slate-500">{{ item.description
                      }}</span></span>
                </ULink>
              </div>
            </section>
          </div>
          <aside class="col-span-4 rounded-2xl bg-brand-50 p-5">
            <p class="text-xs font-bold uppercase tracking-widest text-brand-600">
              What&apos;s new
            </p>
            <div class="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai20.jpeg"
                alt="New dashboard preview" class="h-36 w-full object-cover" />
            </div>
            <h3 class="mt-5 text-lg font-bold text-brand-900">
              Development milestones
            </h3>
            <p class="mt-2 text-sm leading-6 text-slate-600">
              Follow our progress as we build better pocketing and accessory
              solutions.
            </p>
            <ULink to="#"
              class="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-800"
              @click="closeDesktopMenu">Explore the project
              <UIcon name="i-heroicons-arrow-right-20-solid" class="size-4" />
            </ULink>
          </aside>
        </div>
      </div>
    </Transition>

    <Transition name="mobile">
      <div v-if="mobileOpen" id="mobile-nav"
        class="max-h-[calc(100dvh-6rem)] overflow-y-auto border-t border-slate-100 bg-white px-4 pb-5 pt-3 sm:px-5 lg:hidden">
        <nav class="grid gap-1" aria-label="Mobile navigation">
          <ULink v-for="link in allMobileLinks" :key="link.label" :to="link.to"
            class="flex min-h-12 items-center rounded-xl px-3 text-[15px] font-medium text-brand-900 transition-colors hover:bg-brand-50 active:bg-brand-100"
            @click="mobileOpen = false">{{ link.label }}</ULink>
          <div class="my-2 h-px bg-slate-100" aria-hidden="true" />
          <UButton to="#" label="Development milestones" trailing-icon="i-heroicons-arrow-right-20-solid" block
            class="rounded-xl bg-brand-700 py-3.5 font-semibold text-white shadow-sm transition-transform hover:bg-brand-800 active:scale-[.98]"
            @click="mobileOpen = false" />
        </nav>
      </div>
    </Transition>
  </header>
</template>

<script setup>
import { useWindowScroll, useDebounceFn } from "@vueuse/core";
import mainLogo from "@/assets/img/hctpal.png";
const simpleLinks = [
  { label: "Home", to: "#" },
  { label: "Why it matters", to: "#" },
];
const menuGroups = [
  {
    label: "The Facilities",
    columns: [
      {
        title: "Capabilities",
        items: [
          {
            label: "Pocketing solutions",
            description: "Purpose-built materials for better performance.",
            icon: "i-heroicons-cube-transparent-20-solid",
          },
          {
            label: "Accessory components",
            description: "Reliable components made for modern production.",
            icon: "i-heroicons-squares-2x2-20-solid",
          },
        ],
      },
      {
        title: "Explore",
        items: [
          {
            label: "Our approach",
            description: "See how our team turns ideas into products.",
            icon: "i-heroicons-light-bulb-20-solid",
          },
          {
            label: "Quality standards",
            description: "Built with care, consistency, and accountability.",
            icon: "i-heroicons-shield-check-20-solid",
          },
        ],
      },
    ],
  },
  {
    label: "Resources",
    columns: [
      {
        title: "Learn",
        items: [
          {
            label: "Blog",
            description: "News, updates, and useful industry insights.",
            icon: "i-heroicons-document-text-20-solid",
          },
          {
            label: "Customer stories",
            description: "Discover how our partners work with us.",
            icon: "i-heroicons-chat-bubble-left-right-20-solid",
          },
        ],
      },
      {
        title: "Company",
        items: [
          {
            label: "About us",
            description: "Learn about our mission and roadmap.",
            icon: "i-heroicons-building-office-20-solid",
          },
          {
            label: "Careers",
            description: "Join our growing team.",
            icon: "i-heroicons-briefcase-20-solid",
          },
        ],
      },
    ],
  },
];
const allMobileLinks = [
  ...simpleLinks,
  ...menuGroups.flatMap((group) =>
    group.columns.flatMap((column) =>
      column.items.map(({ label }) => ({ label, to: "#" })),
    ),
  ),
];
const { y } = useWindowScroll();
const scrolled = ref(false);
const mobileOpen = ref(false);
const activeMenu = ref(null);
let closeTimer;
const activeGroup = computed(() =>
  menuGroups.find((group) => group.label === activeMenu.value),
);
const openDesktopMenu = (label) => {
  clearTimeout(closeTimer);
  activeMenu.value = label;
};
const scheduleClose = () => {
  closeTimer = window.setTimeout(() => {
    activeMenu.value = null;
  }, 180);
};
const cancelClose = () => clearTimeout(closeTimer);
const toggleDesktopMenu = (label) => {
  activeMenu.value = activeMenu.value === label ? null : label;
};
const closeDesktopMenu = () => {
  activeMenu.value = null;
  mobileOpen.value = false;
};
watch(
  y,
  useDebounceFn(() => {
    scrolled.value = y.value > 40;
    if (mobileOpen.value) mobileOpen.value = false;
  }, 50),
);
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
.menu-leave-active,
.mobile-enter-active,
.mobile-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>