// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
  ],
  css: ['~/assets/css/main.css', '~/assets/css/loom.css'],
  icon: {
    serverBundle: {
      collections: ['heroicons'],
    },
    clientBundle: {
      scan: true,
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
      title: 'Ha-Meem Ching Tai Pocketing & Accessories Ltd.',
      meta: [
        {
          name: 'description',
          content: 'A joint venture between Ha-Meem Group and Ching Tai. We manufacture export-quality pocketing fabrics, interlinings, and trims in Bangladesh to reduce lead times and strengthen the backward linkage industry.',
        },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: './hameem.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,500&family=Hind+Siliguri:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})