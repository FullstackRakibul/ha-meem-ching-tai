<template>
  <section class="py-20 bg-[#f5f5f0] overflow-hidden">
    <UContainer>
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

        <!-- Left Content Column (Spans 7 of 12 columns) -->
        <div class="lg:col-span-7 space-y-8">
          <!-- Badge -->
          <UBadge label="ABOUT US" color="neutral" variant="soft"
            class="border text-primary border-gray-200 bg-transparent px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide" />

          <!-- Main Title & Subtitle -->
          <div>
            <h2 class="text-4xl md:text-5xl font-bold text-[#1a1a1a] leading-tight mb-4 uppercase tracking-tight">
              A new era in garment accessories manufacturing
            </h2>
            <p class="text-gray-600 text-lg leading-relaxed">
              Strengthening Bangladesh's backward linkage industry through world-class manufacturing and strategic
              partnership — a joint venture between Ha-Meem Group and Ching Tai.
            </p>
          </div>

          <!-- Stat Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            <div class="bg-white rounded-xl p-5 shadow-sm text-center">
              <div class="text-2xl font-bold text-[#1a1a1a]">Tk 100 cr</div>
              <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Initial investment</div>
              <div class="text-[10px] text-gray-400 mt-1">Phase one, expanding to all accessory categories</div>
            </div>
            <div class="bg-white rounded-xl p-5 shadow-sm text-center">
              <div class="text-2xl font-bold text-[#1a1a1a]">700K yd</div>
              <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Monthly output</div>
              <div class="text-[10px] text-gray-400 mt-1">Fabric and accessories in the initial phase</div>
            </div>
            <div class="bg-white rounded-xl p-5 shadow-sm text-center">
              <div class="text-2xl font-bold text-[#1a1a1a]">2M yd</div>
              <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Future capacity</div>
              <div class="text-[10px] text-gray-400 mt-1">Per month at full-scale operations</div>
            </div>
            <div class="bg-white rounded-xl p-5 shadow-sm text-center">
              <div class="text-2xl font-bold text-[#1a1a1a]">15,000</div>
              <div class="text-xs text-gray-500 mt-1 font-medium uppercase tracking-wider">Employment</div>
              <div class="text-[10px] text-gray-400 mt-1">Jobs generated across the venture</div>
            </div>
          </div>

          <!-- Factory Points (No. 01, No. 02, No. 03) -->
          <div>
            <h3 class="text-lg font-semibold text-[#1a1a1a] mb-4">About the factory</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="bg-white/60 p-4 rounded-xl border border-gray-200/50">
                <div class="text-secondary font-bold text-sm mb-1">No. 01</div>
                <h4 class="font-semibold text-[#1a1a1a] text-sm">Made locally</h4>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">Accessories that once had to be imported are now
                  produced locally — cutting delays.</p>
              </div>
              <div class="bg-white/60 p-4 rounded-xl border border-gray-200/50">
                <div class="text-secondary font-bold text-sm mb-1">No. 02</div>
                <h4 class="font-semibold text-[#1a1a1a] text-sm">Advanced technology</h4>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">Advanced Chinese technology and modern machinery
                  manufacture accessories at scale.</p>
              </div>
              <div class="bg-white/60 p-4 rounded-xl border border-gray-200/50">
                <div class="text-secondary font-bold text-sm mb-1">No. 03</div>
                <h4 class="font-semibold text-[#1a1a1a] text-sm">Built for export</h4>
                <p class="text-xs text-gray-500 mt-1 leading-relaxed">Output meets Ha-Meem Group's own factories and
                  ships to international markets.</p>
              </div>
            </div>
          </div>

          <!-- CTA & Contact Row -->
          <div class="flex flex-wrap items-center gap-6 pt-2">
            <UButton size="xl" label="EXPLORE MORE" trailing-icon="i-heroicons-arrow-right-20-solid"
              class="bg-secondary hover:bg-clay-600 text-white font-bold rounded-full px-8 transition-colors" />
            <div class="flex items-center gap-3">
              <div
                class="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-[#1a1a1a]">
                <UIcon name="i-heroicons-phone-20-solid" />
              </div>
              <div>
                <div class="text-xs text-gray-400">Call Center 24/7</div>
                <div class="font-bold text-[#1a1a1a]">+1 (212) 578-5758</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Image Column (Spans 5 of 12 columns) -->
        <div class="lg:col-span-5 relative mt-8 lg:mt-0">
          <div class="relative z-10">
            <!-- Main Big Image -->
            <img src="https://api.hameemgroup.com:9012/Resources/HCTPAL/HameemChingTai01.jpeg"
              alt="Manufacturing Team" class="w-full h-auto rounded-3xl shadow-xl object-cover aspect-4/5" />

            <!-- Rating Bubble (Floating over the main image) -->
            <div
              class="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg flex flex-col items-start min-w-35">
              <div class="flex items-center gap-2">
                <span class="text-2xl font-bold text-[#1a1a1a]">4.9</span>
                <div class="flex text-[#e8b938]">
                  <UIcon name="i-heroicons-star-solid" />
                  <UIcon name="i-heroicons-star-solid" />
                  <UIcon name="i-heroicons-star-solid" />
                  <UIcon name="i-heroicons-star-solid" />
                  <UIcon name="i-heroicons-star-solid" class="text-gray-300" />
                </div>
              </div>
              <p class="text-[10px] text-gray-500 font-medium leading-tight mt-1">Real Stories, Real Satisfaction:</p>
              <p class="text-[10px] font-bold text-[#1a1a1a] leading-tight">Hear From Our Customers</p>
            </div>
          </div>

          <!-- Smaller overlapping image (underneath and to the left) -->
          <!-- <div class="absolute -bottom-10 -left-10 z-0 hidden lg:block">
            <img src="https://images.unsplash.com/photo-1533831542222-c2bc73bb3301?q=80&w=1974&auto=format&fit=crop"
              alt="Fabric Process" class="w-44 h-44 rounded-2xl shadow-lg object-cover border-4 border-[#f5f5f0]" />
          </div> -->

          <!-- Vertical side text -->
          <div
            class="absolute -right-16 top-1/2 -translate-y-1/2 hidden xl:block text-[#1a1a1a] font-bold tracking-[0.3em] text-sm uppercase"
            style="writing-mode: vertical-rl;">
            HCTPAL INDUSTRY
          </div>
        </div>

      </div>
    </UContainer>
  </section>
</template>