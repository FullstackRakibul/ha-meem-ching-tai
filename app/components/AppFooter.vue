<template>
  <footer class="relative w-full overflow-hidden bg-[#f5f5f0] pt-16 md:pt-24">
    <UContainer>
      <!-- ================= Dark CTA card ================= -->
      <!-- The one dark surface in a light footer, same treatment as the
           featured card in VentureAtAGlance: photo + gradient + navy ring. -->
      <div
        class="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-primary/20 bg-navy-400"
      >
        <img
          src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai10.jpeg"
          alt=""
          loading="lazy"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          class="absolute inset-0 bg-linear-to-r from-navy-900/5 via-navy-900/85 to-navy-900/90"
        ></div>

        <div
          class="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-10 md:p-12 lg:p-14"
        >
          <h2
            class="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight"
          >
            Tell us what you're<br class="hidden md:block" />
            sourcing.
          </h2>

          <div class="lg:pl-4">
            <p class="text-white/70 leading-relaxed mb-6">
              Send your requirements and an engineer from the mill comes back with fabric
              options, honest lead times, and pricing against your order volume.
            </p>
            <div class="flex flex-wrap items-center gap-4">
              <UButton
                label="Request a quote"
                trailing-icon="i-heroicons-arrow-right-20-solid"
                class="bg-white hover:bg-secondary text-navy-900 hover:text-white font-semibold rounded-full px-6 py-2.5 text-sm transition-colors"
              />
              <a
                href="tel:+12125785758"
                class="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors"
              >
                <UIcon name="i-heroicons-phone-20-solid" class="w-4 h-4" />
                +1 (212) 578-5758
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- ================= Watermark ================= -->
      <!-- Sized with cqw (container width) rather than vw so it scales to the
           UContainer it sits in and stays inside the gutters — vw is measured
           against the viewport, which pushed it past both edges. -->
      <div
        class="relative select-none pointer-events-none -mt-2 md:-mt-6 mb-4 md:mb-8 flex justify-center overflow-hidden"
        style="container-type: inline-size"
      >
        <span
          class="block font-bold uppercase text-navy-500/4 leading-none whitespace-nowrap tracking-tight"
          style="font-size: 9.5cqw"
        >
          Ha-Meem Ching Tai
        </span>
      </div>

      <!-- ================= Link columns ================= -->
      <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-12 gap-x-8 gap-y-10 pb-14">
        <!-- Brand -->
        <div class="col-span-2 sm:col-span-4 lg:col-span-3 lg:pr-8">
          <div class="font-bold text-[#1a1a1a] text-xl tracking-tight uppercase mb-3">
            Ha-Meem Ching Tai
          </div>
          <p class="text-[15px] text-gray-500 leading-relaxed max-w-sm">
            Garment accessories made in Bangladesh — the ones the industry used to wait
            months to import.
          </p>
        </div>

        <!-- 3 columns × 2 + Offices 3 + brand 3 = 12 -->
        <div
          v-for="column in columns"
          :key="column.title"
          class="sm:col-span-1 lg:col-span-2"
        >
          <h4 class="font-semibold text-[#1a1a1a] text-sm mb-4">{{ column.title }}</h4>
          <ul class="space-y-3 text-[15px]">
            <li v-for="link in column.links" :key="link">
              <a
                href="#"
                class="text-gray-500 hover:text-secondary transition-colors duration-300"
                >{{ link }}</a
              >
            </li>
          </ul>
        </div>

        <!-- Offices -->
        <div class="col-span-2 sm:col-span-1 lg:col-span-3">
          <h4 class="font-semibold text-[#1a1a1a] text-sm mb-4">Offices</h4>
          <div class="space-y-4 text-[15px] text-gray-500">
            <p>Factory HQ<br />Ghorashal, Narsingdi</p>
            <p>Head office<br />Gulshan, Dhaka</p>
          </div>
        </div>
      </div>
    </UContainer>

    <!-- ================= Legal bar ================= -->
    <div class="border-t border-gray-200">
      <UContainer>
        <div
          class="py-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400"
        >
          <p>
            &copy; {{ new Date().getFullYear() }} Ha-Meem Ching Tai (HCTPAL). All rights
            reserved.
          </p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-secondary transition-colors duration-300"
              >Privacy Policy</a
            >
            <a href="#" class="hover:text-secondary transition-colors duration-300"
              >Terms of Use</a
            >
          </div>
        </div>
      </UContainer>
    </div>
  </footer>
</template>

<script setup>
const columns = [
  {
    title: "Company",
    links: ["About", "Why It Matters", "The Facility", "Milestones"],
  },
  {
    title: "Products",
    links: ["Pocketing Fabric", "Interlinings", "Labels & Tapes", "Packaging"],
  },
  {
    title: "Connect",
    links: ["Contact", "LinkedIn", "Careers"],
  },
];
</script>
