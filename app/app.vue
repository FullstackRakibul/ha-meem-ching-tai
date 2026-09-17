<template>
  <NuxtPage />
  <CustomCursor />
</template>

<script setup>
// Title and description live once, in nuxt.config.ts.
useHead({
  meta: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    },
  ],
})
</script>