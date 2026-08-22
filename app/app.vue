<template>
  <div class="flex flex-col min-h-screen bg-gray-50">
    <ScrollTracer />
    <AppHeader />
    <main class="grow">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
useHead({
  title: 'Ha-Meem Ching Tai',
  titleTemplate: '%s | Ha-Meem Ching Tai',
  meta: [
    {
      name: 'viewport',
      // `viewport-fit=cover` is what makes env(safe-area-inset-*) resolve to
      // real values on notched iPhones — without it those insets are always 0
      // and the carousel controls / showcase pills sit under the home
      // indicator. No `maximum-scale`: capping zoom blocks pinch-to-zoom,
      // which users with low vision rely on.
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  ],
})
</script>