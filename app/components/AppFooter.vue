<template>
  <footer class="bg-gray-900 text-gray-100 mt-16">
    <div class="max-w-7xl mx-auto px-4 py-12">
      <!-- Footer Grid -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        <!-- Company Info -->
        <div>
          <div class="flex items-center gap-2 mb-4">
            <UIcon name="i-heroicons-cog-16-solid" class="text-[#e8b938] text-xl" />
            <span class="font-bold text-lg uppercase text-white">Ha-Meem Ching Tai</span>
          </div>
          <p class="text-sm text-gray-400">
            Building modern web experiences with cutting-edge design and technology.
          </p>
        </div>

        <!-- Product Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Product</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Features</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Pricing</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Security</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Roadmap</a></li>
          </ul>
        </div>

        <!-- Company Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Company</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">About</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Blog</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Careers</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Contact</a></li>
          </ul>
        </div>

        <!-- Resources Links -->
        <div>
          <h4 class="font-semibold text-white mb-4">Resources</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Documentation</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">API</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Community</a></li>
            <li><a href="#" class="text-gray-400 hover:text-purple-500 transition">Support</a></li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="border-t border-gray-800 pt-8">
        <!-- Footer Bottom -->
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-400">
            &copy; 2026 Ha-Meem Ching Tai. All rights reserved.
          </p>

          <!-- Social Links -->
          <div class="flex items-center gap-4">
            <a href="#" class="text-gray-400 hover:text-purple-500 transition">
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-purple-500 transition">
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-purple-500 transition">
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="w-5 h-5" />
            </a>
          </div>

          <!-- Legal Links -->
          <div class="flex items-center gap-4 text-xs">
            <a href="#" class="text-gray-400 hover:text-purple-500 transition">Privacy Policy</a>
            <a href="#" class="text-gray-400 hover:text-purple-500 transition">Terms of Service</a>
          </div>
        </div>
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