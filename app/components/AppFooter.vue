<!-- AppFooter.vue -->
<template>
  <footer class="relative w-full overflow-hidden bg-[#f5f5f0]">
    <!-- ================= Atmospheric Depth Layer ================= -->
    <!-- Subtle top edge treatment — organic, not geometric -->
    <div class="relative h-24 sm:h-32 md:h-40 overflow-hidden">
      <svg
        class="absolute bottom-0 w-full"
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        style="height: 100%"
      >
        <defs>
          <linearGradient id="ridgeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#14253b" stop-opacity="0.3" />
            <stop offset="100%" stop-color="#0f576a" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 C240,100 480,20 720,60 C960,100 1200,20 1440,60 L1440,120 L0,120 Z"
          fill="url(#ridgeGrad)"
          opacity="0.6"
        />
        <path
          d="M0,80 C360,110 720,40 1080,80 C1260,100 1380,90 1440,85 L1440,120 L0,120 Z"
          fill="#0f172a"
          opacity="0.4"
        />
      </svg>
      <!-- Floating particles — subtle dust motes in light -->
      <div class="absolute inset-0 pointer-events-none">
        <div
          v-for="n in 6"
          :key="n"
          class="absolute w-px h-px bg-white/20 rounded-full animate-float"
          :style="{
            left: `${15 + n * 14}%`,
            top: `${20 + (n % 3) * 25}%`,
            animationDelay: `${n * 0.7}s`,
            animationDuration: `${4 + n * 0.5}s`,
          }"
        />
      </div>
    </div>

    <!-- ================= Main Footer Body ================= -->
    <div class="relative">
      <!-- Large background word — human-scale, not overwhelming -->
      <div
        class="absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none select-none hidden lg:block"
      >
        <span class="font-serif text-[12rem] leading-none tracking-tighter text-black/5">
          CHING TAI
        </span>
      </div>

      <UContainer class="">
        <!-- Top Section: Newsletter + Social Proof -->
        <div
          class="relative grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 py-16 lg:py-20 border-b border-white/6"
        >
          <!-- Left: Brand Statement -->
          <div class="lg:col-span-5 xl:col-span-4">
            <div class="flex items-baseline gap-3 mb-6">
              <span class="text-xs font-bold tracking-[0.25em] uppercase text-black/70">
                Est. 1984
              </span>
              <div class="h-px flex-1 bg-linear-to-r from-amber-400/30 to-transparent" />
            </div>

            <h3
              class="text-2xl sm:text-3xl md:text-5xl font-bold text-primary leading-[1.15] tracking-tight font-serif lg:text-5xl mb-6"
            >
              Garment accessories,<br />
              <em class="text-black/60 not-italic">made where they're worn.</em>
            </h3>

            <p class="text-base leading-relaxed text-black/65 max-w-sm">
              For decades, mills waited on imports. We built the alternative in Bangladesh
              — pocketing, interlinings, labels, and the care that ships with them.
            </p>
          </div>

          <!-- Center: Newsletter -->
          <div class="lg:col-span-4 xl:col-span-4 lg:px-6">
            <div class="lg:border-l lg:border-r border-white/6 lg:px-8">
              <p class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
                Between the Thread
              </p>
              <p class="text-base text-black/65 mb-5 leading-relaxed">
                Mill notes, fabric arrivals, and the occasional honest opinion on lead
                times.
              </p>

              <form class="flex gap-2" @submit.prevent="handleSubscribe">
                <input
                  v-model="email"
                  type="email"
                  placeholder="your@mill.com"
                  class="flex-1 bg-black/4 border border-black/10 rounded-lg px-4 py-2.5 text-sm text-black placeholder:text-black/50 focus:outline-none focus:border-black/40 focus:bg-black/6 transition-all"
                />
                <button
                  type="submit"
                  class="shrink-0 bg-brand-400/90 hover:bg-brand-400 text-black font-semibold text-base px-5 py-2.5 rounded-lg transition-colors"
                >
                  Join
                </button>
              </form>

              <p class="text-xs text-black/55 mt-3">
                No frequency promises. Unsubscribe whenever.
              </p>
            </div>
          </div>

          <!-- Right: Contact Anchor -->
          <div class="lg:col-span-3 xl:col-span-4">
            <p class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
              Start a conversation
            </p>

            <a href="tel:+8801319320527" class="group block mb-4">
              <span
                class="font-serif text-2xl sm:text-3xl md:text-4xl text-black group-hover:text-black/60 transition-colors duration-500"
              >
                +880 131 9320527
              </span>
            </a>

            <a
              href="mailto:info@hameemchingtai.com"
              class="text-base text-black/65 hover:text-black transition-colors block mb-8"
            >
              info@hameemchingtai.com
            </a>

            <ULink
              to="#"
              class="inline-flex items-center gap-2 text-base font-medium text-black/80 hover:text-black transition-colors group/link"
            >
              Request fabric swatches
              <svg
                class="w-4 h-4 transition-transform group-hover/link:translate-x-1"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M5 12h14M12 5l7 7-7 7"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </ULink>
          </div>
        </div>

        <!-- Middle: Navigation Grid -->
        <div
          class="border border-t-0 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-x-8 gap-y-10 py-14 lg:py-16"
        >
          <!-- Column 1: Company -->
          <div class="lg:col-span-2">
            <h4 class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
              Company
            </h4>
            <ul class="space-y-3">
              <li v-for="link in companyLinks" :key="link">
                <a
                  href="#"
                  class="text-base text-black/65 hover:text-black transition-colors duration-300 relative group"
                >
                  {{ link }}
                  <span
                    class="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-400/60 group-hover:w-full transition-all duration-500"
                  />
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 2: Products -->
          <div class="lg:col-span-2">
            <h4 class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
              Products
            </h4>
            <ul class="space-y-3">
              <li v-for="link in productLinks" :key="link">
                <a
                  href="#"
                  class="text-base text-black/65 hover:text-black transition-colors duration-300 relative group"
                >
                  {{ link }}
                  <span
                    class="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-400/60 group-hover:w-full transition-all duration-500"
                  />
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Resources -->
          <div class="lg:col-span-2">
            <h4 class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
              Resources
            </h4>
            <ul class="space-y-3">
              <li v-for="link in resourceLinks" :key="link">
                <a
                  href="#"
                  class="text-base text-black/65 hover:text-black transition-colors duration-300 relative group"
                >
                  {{ link }}
                  <span
                    class="absolute -bottom-0.5 left-0 w-0 h-px bg-amber-400/60 group-hover:w-full transition-all duration-500"
                  />
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Locations -->
          <div class="col-span-2 sm:col-span-3 lg:col-span-3 lg:col-start-7">
            <h4 class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
              Locations
            </h4>
            <div class="space-y-5">
              <div>
                <p class="text-base font-medium text-black mb-1">Factory HQ</p>
                <p class="text-base text-black/55 leading-relaxed">
                  Ghorashal, Narsingdi<br />Bangladesh
                </p>
              </div>
              <div>
                <p class="text-base font-medium text-black mb-1">Head Office</p>
                <p class="text-base text-black/55 leading-relaxed">
                  Times Media Limited Building<br />387, Dhaka 1208
                </p>
              </div>
            </div>
          </div>

          <!-- Column 5: Recognition -->
          <div class="lg:col-span-3">
            <h4 class="text-xs font-bold tracking-[0.2em] uppercase text-black/60 mb-5">
              Trusted by
            </h4>
            <div class="flex flex-wrap gap-4 items-center opacity-40 text-black">
              <!-- Stylized text marks instead of generic logos -->
              <span class="font-serif text-xl text-black">H&M</span>
              <span class="text-[10px] text-black/50">•</span>
              <span class="font-serif text-xl text-black">Zara</span>
              <span class="text-[10px] text-black/50">•</span>
              <span class="font-serif text-xl text-black">Uniqlo</span>
              <span class="text-[10px] text-black/50">•</span>
              <span class="font-serif text-xl text-black">C&A</span>
            </div>
          </div>
        </div>
      </UContainer>

      <!-- ================= Bottom Bar ================= -->
      <div class="border-t border-white/6">
        <UContainer>
          <div class="py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div class="flex items-center gap-4">
              <p class="text-xs text-black/55 tracking-wide">
                &copy; {{ new Date().getFullYear() }} Ha-Meem Ching Tai. All rights
                reserved.
              </p>
            </div>

            <div class="flex items-center gap-6">
              <a
                href="#"
                class="text-xs text-black/60 hover:text-black transition-colors"
              >
                Privacy
              </a>
              <a
                href="#"
                class="text-xs text-black/60 hover:text-black transition-colors"
              >
                Terms
              </a>
              <a
                href="#"
                class="text-xs text-black/60 hover:text-black transition-colors"
              >
                Sitemap
              </a>
            </div>
          </div>
        </UContainer>
      </div>
    </div>
  </footer>
</template>

<script setup>
const email = ref("");

const companyLinks = ["About", "Why It Matters", "The Facility", "Milestones", "Careers"];
const productLinks = ["Pocketing Fabric", "Interlinings", "Labels & Tapes", "Packaging"];
const resourceLinks = ["Contact", "LinkedIn", "FAQ", "Spec Sheets"];

const handleSubscribe = () => {
  // Handle newsletter subscription
  console.log("Subscribe:", email.value);
  email.value = "";
};
</script>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0) scale(1);
    opacity: 0.2;
  }

  50% {
    transform: translateY(-12px) scale(1.5);
    opacity: 0.5;
  }
}

.animate-float {
  animation: float ease-in-out infinite;
}
</style>
