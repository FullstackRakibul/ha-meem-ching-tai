// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/ui', 'vue3-carousel-nuxt'],
  css: ['~/assets/css/main.css'],
  icon: {
    // bundle heroicons at build time so SSR resolves them locally
    // instead of round-tripping through /api/_nuxt_icon/*
    serverBundle: {
      collections: ['heroicons'],
    },
  },
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: './hameem.png' }
      ]
    }
  }

})