<template>
  <NuxtPage />
  <CustomCursor />
</template>

<script setup>
const { locale } = useLocale();

useHead({
  title: "Ha-Meem Ching Tai",
  titleTemplate: "%s",
  // `lang` drives the per-script typography (:lang(bn) / :lang(zh)) and
  // screen-reader pronunciation; it is rendered at SSR, not patched later.
  htmlAttrs: { lang: locale },
  meta: [
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
  ],
});
</script>
