<template>
  <div class="space-y-12">
    <!-- Hero Section -->
    <section class="py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 class="text-5xl font-bold text-gray-900 mb-6">
            Welcome to ZEUS UI
          </h1>
          <p class="text-xl text-gray-600 mb-8">
            Build modern web experiences with cutting-edge design patterns and Vue 3 components.
          </p>
          <div class="flex gap-4">
            <UButton size="lg" color="purple">Get Started</UButton>
            <UButton size="lg" color="gray" variant="outline">Learn More</UButton>
          </div>
        </div>
        <div class="bg-linear-to-br from-purple-100 to-purple-200 rounded-lg h-96 flex items-center justify-center">
          <UIcon name="i-heroicons-lightning-bolt-20-solid" class="text-purple-600 text-9xl" />
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-12">
      <h2 class="text-4xl font-bold text-gray-900 mb-12 text-center">Features</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
          <UIcon name="i-heroicons-bolt-solid" class="text-purple-600 text-3xl mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
          <p class="text-gray-600">
            Optimized performance with Nuxt 4 and Tailwind CSS for blazing fast page loads.
          </p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
          <UIcon name="i-heroicons-shield-check-solid" class="text-purple-600 text-3xl mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Secure & Reliable</h3>
          <p class="text-gray-600">
            Built with security best practices and proven technologies from the Vue ecosystem.
          </p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition">
          <UIcon name="i-heroicons-sparkles-solid" class="text-purple-600 text-3xl mb-4" />
          <h3 class="text-xl font-semibold text-gray-900 mb-3">Modern Design</h3>
          <p class="text-gray-600">
            Beautiful components and layouts crafted with Nuxt UI and Tailwind CSS.
          </p>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-12 bg-linear-to-r from-purple-600 to-purple-800 rounded-lg text-white text-center">
      <h2 class="text-4xl font-bold mb-6">Ready to build something amazing?</h2>
      <p class="text-lg mb-8 text-purple-100">Start your project today with ZEUS UI.</p>
      <UButton color="white" size="lg">Start Free Trial</UButton>
    </section>
  </div>
</template>

<script setup>
</script>