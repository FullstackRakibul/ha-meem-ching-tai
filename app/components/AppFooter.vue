<template>
  <footer class="relative w-full overflow-hidden">
    <!-- Background photo + navy overlay, shared by the CTA panel above the fold line -->
    <div class="absolute inset-0 z-0">
      <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai10.jpeg" alt=""
        class="w-full h-full object-cover" />
      <div class="absolute inset-0 bg-navy-900/90"></div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
      <!-- CTA + Contact Form -->
      <div class="pt-20 md:pt-28 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <!-- Left: Copy -->
        <div>
          <UBadge label="START TODAY" color="secondary" variant="soft"
            class="border border-white/20 bg-white/5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-5 text-white" />
          <h2 class="text-3xl md:text-5xl font-bold text-white leading-[1.15] tracking-tight mb-4">
            Let's Build Your Next<br class="hidden md:block" />
            Collection Together
          </h2>
          <p class="text-white/70 text-base leading-relaxed max-w-md">
            Share your sourcing requirements and one of our engineers will reach out with fabric options, lead
            times, and pricing tailored to your order.
          </p>
        </div>

        <!-- Right: Form Card -->
        <form class="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl p-6 md:p-8"
          @submit.prevent>
          <h3 class="text-white font-semibold text-lg mb-5">Leave a message!</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="text-xs text-white/60 uppercase tracking-wide">First Name</label>
              <input type="text" placeholder="Add Here"
                class="mt-1.5 w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e8b938] transition-colors" />
            </div>
            <div>
              <label class="text-xs text-white/60 uppercase tracking-wide">Last Name</label>
              <input type="text" placeholder="Add Here"
                class="mt-1.5 w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e8b938] transition-colors" />
            </div>
          </div>

          <div class="mb-4">
            <label class="text-xs text-white/60 uppercase tracking-wide">Email</label>
            <input type="email" placeholder="you@company.com"
              class="mt-1.5 w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e8b938] transition-colors" />
          </div>

          <div class="mb-4">
            <label class="text-xs text-white/60 uppercase tracking-wide">Phone Number</label>
            <input type="tel" placeholder="(000) 000 0000"
              class="mt-1.5 w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e8b938] transition-colors" />
          </div>

          <div class="mb-6">
            <label class="text-xs text-white/60 uppercase tracking-wide">Message</label>
            <textarea rows="3" placeholder="Add your lines here..."
              class="mt-1.5 w-full bg-white/10 border border-white/20 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[#e8b938] transition-colors resize-none"></textarea>
          </div>

          <UButton type="submit" label="Submit Inquiry" trailing-icon="i-heroicons-arrow-up-right-20-solid"
            class="bg-[#e8b938] hover:bg-white text-navy-900 font-semibold rounded-full px-6 py-2.5 text-sm transition-colors" />
        </form>
      </div>

      <!-- Link columns -->
      <div class="border-t border-white/10 pt-12 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <!-- Brand -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-2">
            <UIcon name="i-heroicons-cog-16-solid" class="text-[#e8b938] text-2xl" />
            <span class="font-bold text-white text-lg tracking-tight uppercase">Ha-Meem Ching Tai</span>
          </div>
          <p class="text-sm text-white/60 leading-relaxed">
            A manufacturing partner, not a supplier. Strengthening Bangladesh's backward linkage industry through
            world-class precision engineering.
          </p>
          <div class="flex items-center gap-3 mt-1">
            <a href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-navy-900 hover:bg-[#e8b938] hover:border-[#e8b938] transition-colors duration-300">
              <UIcon name="i-heroicons-envelope-20-solid" class="w-3.5 h-3.5" />
            </a>
            <a href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-navy-900 hover:bg-[#e8b938] hover:border-[#e8b938] transition-colors duration-300">
              <UIcon name="i-heroicons-globe-alt-20-solid" class="w-3.5 h-3.5" />
            </a>
            <a href="#"
              class="w-8 h-8 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:text-navy-900 hover:bg-[#e8b938] hover:border-[#e8b938] transition-colors duration-300">
              <UIcon name="i-heroicons-building-office-2-20-solid" class="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <!-- Explore -->
        <div>
          <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Explore</h4>
          <ul class="space-y-2.5 text-sm text-white/60">
            <li>
              <a href="#" class="hover:text-[#e8b938] transition-colors duration-300 inline-flex items-center gap-1.5">
                <UIcon name="i-heroicons-chevron-right-20-solid" class="w-3.5 h-3.5 text-[#e8b938]" />
                Why It Matters
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-[#e8b938] transition-colors duration-300 inline-flex items-center gap-1.5">
                <UIcon name="i-heroicons-chevron-right-20-solid" class="w-3.5 h-3.5 text-[#e8b938]" />
                The Venture at a Glance
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-[#e8b938] transition-colors duration-300 inline-flex items-center gap-1.5">
                <UIcon name="i-heroicons-chevron-right-20-solid" class="w-3.5 h-3.5 text-[#e8b938]" />
                Our Products
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-[#e8b938] transition-colors duration-300 inline-flex items-center gap-1.5">
                <UIcon name="i-heroicons-chevron-right-20-solid" class="w-3.5 h-3.5 text-[#e8b938]" />
                The Facility
              </a>
            </li>
            <li>
              <a href="#" class="hover:text-[#e8b938] transition-colors duration-300 inline-flex items-center gap-1.5">
                <UIcon name="i-heroicons-chevron-right-20-solid" class="w-3.5 h-3.5 text-[#e8b938]" />
                Development Milestones
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Contact Us</h4>
          <ul class="space-y-3 text-sm text-white/60">
            <li class="flex items-center gap-2.5">
              <UIcon name="i-heroicons-phone-solid" class="text-[#e8b938] w-4 h-4 shrink-0" />
              <span>+1 (212) 578-5758</span>
            </li>
            <li class="flex items-center gap-2.5">
              <UIcon name="i-heroicons-envelope-solid" class="text-[#e8b938] w-4 h-4 shrink-0" />
              <span>info@hctpal.com</span>
            </li>
          </ul>
        </div>

        <!-- Offices -->
        <div>
          <h4 class="font-semibold text-white mb-4 uppercase tracking-wider text-sm">Our Offices</h4>
          <div class="space-y-4 text-sm text-white/60">
            <div>
              <div class="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">Factory HQ</div>
              <div class="flex items-start gap-2.5">
                <UIcon name="i-heroicons-map-pin-solid" class="text-[#e8b938] w-4 h-4 shrink-0 mt-0.5" />
                <span>Ghorashal, Narsingdi, Bangladesh</span>
              </div>
            </div>
            <div>
              <div class="text-xs font-semibold text-white/80 uppercase tracking-wide mb-1">Head Office</div>
              <div class="flex items-start gap-2.5">
                <UIcon name="i-heroicons-map-pin-solid" class="text-[#e8b938] w-4 h-4 shrink-0 mt-0.5" />
                <span>Gulshan, Dhaka, Bangladesh</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Giant watermark wordmark -->
    <div class="relative z-10 border-t border-white/10 overflow-hidden select-none pointer-events-none">
      <span
        class="block text-center font-extrabold uppercase text-white/5 leading-none whitespace-nowrap"
        style="font-size: clamp(3.5rem, 14vw, 11rem); margin-bottom: -0.12em;">
        Ha-Meem Ching Tai
      </span>
    </div>

    <!-- Legal bar -->
    <div class="relative z-10 border-t border-white/10">
      <div
        class="max-w-7xl mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/50">
        <p>&copy; {{ new Date().getFullYear() }} Ha-Meem Ching Tai (HCTPAL). All rights reserved.</p>
        <div class="flex gap-6 font-medium">
          <a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Privacy Policy</a>
          <a href="#" class="hover:text-[#e8b938] transition-colors duration-300">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>
