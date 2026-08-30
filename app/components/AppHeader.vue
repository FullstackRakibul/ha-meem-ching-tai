<template>
  <header
    class="fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] md:w-[calc(100%-4rem)] -translate-x-1/2 rounded-full border border-slate-200/60 bg-white/80 backdrop-blur-lg shadow-[0_8px_30px_rgb(0,0,0,0.06)] transition-all duration-500"
    :class="scrolled ? 'max-w-4xl py-1.5' : 'max-w-7xl py-2'" @keydown.esc="closeDesktopMenu">
    <div class="mx-auto flex items-center justify-between gap-6 px-5 md:px-8 transition-all duration-500">
      <ULink to="#" class="flex shrink-0 items-center gap-3 transition-transform hover:scale-105"
        aria-label="Hameem Ching Tai home" @click="closeDesktopMenu">
        <span class="flex items-center">
          <img :src=mainLogo alt="Ha-Meem Ching Tai" class="h-7 sm:h-9 w-auto object-contain drop-shadow-sm">
        </span>
      </ULink>

      <nav class="hidden items-center gap-1.5 lg:flex" aria-label="Main navigation">
        <ULink v-for="link in simpleLinks" :key="link.label" :to="link.to"
          class="rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100/80 hover:text-brand-600"
          @click="closeDesktopMenu">
          {{ link.label }}
        </ULink>
        <div class="relative flex items-center h-full" v-for="menu in menuGroups" :key="menu.label"
          @mouseenter="openDesktopMenu(menu.label)" @mouseleave="scheduleClose">
          <button type="button"
            class="group flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100/80 hover:text-brand-600"
            :aria-expanded="activeMenu === menu.label" @focus="openDesktopMenu(menu.label)"
            @click="toggleDesktopMenu(menu.label)">
            {{ menu.label }}
            <svg class="size-4 text-slate-400 transition-transform duration-300 group-hover:text-brand-500"
              :class="activeMenu === menu.label ? 'rotate-180 text-brand-500' : ''" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </nav>

      <div class="hidden items-center gap-4 lg:flex">
        <UButton to="#" label="Milestones"
          class="group rounded-full bg-slate-900 px-6 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-brand-600 hover:shadow-lg hover:shadow-brand-500/30"
          @click="closeDesktopMenu">
          <template #trailing>
            <svg class="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </template>
        </UButton>
      </div>

      <button type="button"
        class="grid size-10 place-items-center rounded-full text-slate-700 hover:bg-slate-100 lg:hidden transition-colors"
        :aria-expanded="mobileOpen" aria-controls="mobile-nav" :aria-label="mobileOpen ? 'Close menu' : 'Open menu'"
        @click="mobileOpen = !mobileOpen">
        <svg v-if="!mobileOpen" class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <svg v-else class="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <Transition enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0 translate-y-4 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-200" leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95">
      <div v-if="activeMenu"
        class="absolute inset-x-0 top-[calc(100%+1rem)] hidden rounded-[2rem] border border-white/50 bg-white/95 backdrop-blur-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] lg:block overflow-hidden"
        @mouseenter="cancelClose" @mouseleave="scheduleClose">
        <div class="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
          <div class="col-span-8 grid grid-cols-2 gap-x-8 gap-y-8 pl-4 py-2">
            <section v-for="column in activeGroup.columns" :key="column.title">
              <p class="mb-5 text-xs font-bold uppercase tracking-widest text-slate-400">
                {{ column.title }}
              </p>
              <div class="grid gap-3">
                <ULink v-for="item in column.items" :key="item.label" to="#"
                  class="group flex items-start gap-4 rounded-2xl p-3 transition-all duration-300 hover:bg-slate-50 hover:shadow-sm"
                  @click="closeDesktopMenu">
                  <span
                    class="grid size-12 shrink-0 place-items-center rounded-xl transition-transform duration-300 group-hover:scale-110 group-hover:shadow-md"
                    :class="item.iconBg">
                    <div v-html="item.icon" class="size-6 transition-colors duration-300" :class="item.iconColor"></div>
                  </span>
                  <div>
                    <strong
                      class="block text-sm font-bold text-slate-900 transition-colors group-hover:text-brand-600">{{
                        item.label }}</strong>
                    <span class="mt-1 block text-sm leading-relaxed text-slate-500">{{ item.description }}</span>
                  </div>
                </ULink>
              </div>
            </section>
          </div>
          <aside
            class="col-span-4 flex flex-col justify-between overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-slate-50 to-slate-100/50 p-6 border border-slate-100">
            <div>
              <p class="text-xs font-bold uppercase tracking-widest text-brand-600 mb-4">
                What&apos;s new
              </p>
              <div class="overflow-hidden rounded-xl bg-slate-200 shadow-inner group">
                <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai20.jpeg"
                  alt="New dashboard preview"
                  class="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <h3 class="mt-5 text-lg font-bold text-slate-900">
                Development milestones
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-slate-600">
                Follow our progress as we build better pocketing and accessory
                solutions for the global market.
              </p>
            </div>
            <ULink to="#"
              class="group mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700"
              @click="closeDesktopMenu">Explore the project
              <svg class="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </ULink>
          </aside>
        </div>
      </div>
    </Transition>

    <Transition name="mobile">
      <div v-if="mobileOpen" id="mobile-nav"
        class="absolute left-0 right-0 top-[calc(100%+0.5rem)] max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-slate-200/60 bg-white/95 backdrop-blur-xl shadow-2xl px-4 pb-6 pt-4 lg:hidden">
        <nav class="grid gap-2" aria-label="Mobile navigation">
          <ULink v-for="link in allMobileLinks" :key="link.label" :to="link.to"
            class="flex min-h-[3rem] items-center rounded-2xl px-4 text-[15px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-brand-600 active:scale-[0.98]"
            @click="mobileOpen = false">{{ link.label }}</ULink>
          <div class="my-3 h-px w-full bg-slate-100" aria-hidden="true" />
          <UButton to="#" label="Milestones" block
            class="group mt-2 rounded-2xl bg-slate-900 py-3.5 font-semibold text-white shadow-md transition-all hover:bg-brand-600 active:scale-[.98]"
            @click="mobileOpen = false">
            <template #trailing>
              <svg class="size-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </template>
          </UButton>
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
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>`,
            iconColor: "text-blue-600",
            iconBg: "bg-blue-50",
          },
          {
            label: "Accessory components",
            description: "Reliable components made for modern production.",
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6a7.5 7.5 0 107.5 7.5h-7.5V6z" /><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5H21A7.5 7.5 0 0013.5 3v7.5z" /></svg>`,
            iconColor: "text-purple-600",
            iconBg: "bg-purple-50",
          },
        ],
      },
      {
        title: "Explore",
        items: [
          {
            label: "Our approach",
            description: "See how our team turns ideas into products.",
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.967.714-1.756 1.62-1.928 1.46-.277 2.63-1.4 2.898-2.859.167-.91.93-1.63 1.882-1.63H21M8.25 12H2.25m10.5 0a1.5 1.5 0 011.5-1.5h1.5a1.5 1.5 0 011.5 1.5v1.5a1.5 1.5 0 01-1.5 1.5H12a1.5 1.5 0 01-1.5-1.5V12z" /></svg>`,
            iconColor: "text-amber-500",
            iconBg: "bg-amber-50",
          },
          {
            label: "Quality standards",
            description: "Built with care, consistency, and accountability.",
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>`,
            iconColor: "text-emerald-500",
            iconBg: "bg-emerald-50",
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
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>`,
            iconColor: "text-rose-500",
            iconBg: "bg-rose-50",
          },
          {
            label: "Customer stories",
            description: "Discover how our partners work with us.",
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>`,
            iconColor: "text-cyan-500",
            iconBg: "bg-cyan-50",
          },
        ],
      },
      {
        title: "Company",
        items: [
          {
            label: "About us",
            description: "Learn about our mission and roadmap.",
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" /></svg>`,
            iconColor: "text-indigo-500",
            iconBg: "bg-indigo-50",
          },
          {
            label: "Careers",
            description: "Join our growing team.",
            icon: `<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>`,
            iconColor: "text-orange-500",
            iconBg: "bg-orange-50",
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
.menu-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.mobile-enter-active,
.mobile-leave-active {
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.mobile-enter-from,
.mobile-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>