<template>
  <!-- The footer now floats like the header, matching the width and glass effect -->
  <footer
    class="w-[calc(100%-2rem)] mx-auto mb-6 mt-16 bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/30 p-6 md:p-8 transition-all duration-500 ease-in-out">

    <!-- Top Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-8">

      <!-- Column 1: Brand & Tagline -->
      <div class="flex flex-col gap-4">
        <div class="flex items-center gap-2 text-[#1a1a1a]">
          <UIcon name="i-heroicons-cog-16-solid" class="text-[#e8b938] text-2xl" />
          <span class="font-bold text-white  text-lg tracking-tight uppercase">Ha-Meem Ching Tai</span>
        </div>
        <p class="text-sm text-gray-500 leading-relaxed">
          A manufacturing partner, not a supplier. Strengthening Bangladesh's backward linkage industry through
          world-class precision engineering and strategic partnership.
        </p>
        <!-- Social Links -->
        <div class="flex items-center gap-3 mt-2">
          <a href="#" class="text-gray-400 hover:text-[#e8b938] transition-colors duration-300">
            <UIcon name="i-heroicons-envelope-20-solid" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-400 hover:text-[#e8b938] transition-colors duration-300">
            <UIcon name="i-heroicons-globe-alt-20-solid" class="w-5 h-5" />
          </a>
          <a href="#" class="text-gray-400 hover:text-[#e8b938] transition-colors duration-300">
            <UIcon name="i-heroicons-building-office-2-20-solid" class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Column 2: Products -->
      <div>
        <h4 class="font-semibold text-[#274257] mb-4 uppercase tracking-wider text-sm">Products</h4>
        <ul class="space-y-2.5 text-sm text-gray-500">
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Pocketing Fabrics</a></li>
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Interlinings</a></li>
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Waistbands</a></li>
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Garment Trims</a></li>
        </ul>
      </div>

      <!-- Column 3: Company -->
      <div>
        <h4 class="font-semibold text-[#274257] mb-4 uppercase tracking-wider text-sm">Company</h4>
        <ul class="space-y-2.5 text-sm text-gray-500">
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Why it matters</a></li>
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">The venture at a glance</a></li>
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">The facility</a></li>
          <li><a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Development milestones</a></li>
        </ul>
      </div>

      <!-- Column 4: Get in Touch -->
      <div>
        <h4 class="font-semibold text-[#274257] mb-4 uppercase tracking-wider text-sm">Get in Touch</h4>
        <ul class="space-y-3 text-sm text-gray-500">
          <li class="flex items-start gap-3">
            <UIcon name="i-heroicons-map-pin-solid" class="text-[#e8b938] mt-1 shrink-0 w-4 h-4" />
            <span>Factory HQ, Ghorashal, Bangladesh</span>
          </li>
          <li class="flex items-start gap-3">
            <UIcon name="i-heroicons-phone-solid" class="text-[#e8b938] mt-1 shrink-0 w-4 h-4" />
            <div>
              <div>+1 (212) 578-5758</div>
              <div class="text-xs text-gray-400 mt-0.5">Call Center 24/7</div>
            </div>
          </li>
          <li class="flex items-start gap-3">
            <UIcon name="i-heroicons-envelope-solid" class="text-[#e8b938] mt-1 shrink-0 w-4 h-4" />
            <span>info@hctpal.com</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom Section: Divider + Copyright -->
    <div class="border-t border-gray-200/50 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
      <p class="text-xs text-gray-400">
        &copy; {{ new Date().getFullYear() }} Ha-Meem Ching Tai (HCTPAL). All rights reserved.
      </p>
      <div class="flex gap-6 text-xs text-gray-400 font-medium">
        <a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Privacy Policy</a>
        <a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Terms of Service</a>
        <a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Sitemap</a>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
footer {
  background: linear-gradient(135deg, #111827 0%, #1f2937 100%);
}
</style>