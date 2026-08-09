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
})
</script>