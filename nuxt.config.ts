import { fileURLToPath } from 'node:url'

export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  // App achter een login; geen SEO nodig. Data staat voorlopig in localStorage.
  ssr: false,
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  // Iconen meebundelen: werkt offline en zonder externe API (keukentablet).
  icon: {
    clientBundle: { scan: true },
    provider: 'none',
  },
  alias: {
    '#domain': fileURLToPath(new URL('./domain', import.meta.url)),
  },
  ignore: ['legacy/**'],
  typescript: {
    strict: true,
    tsConfig: {
      exclude: ['../legacy'],
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'nl' },
      title: 'Menuggest',
      meta: [
        { name: 'description', content: 'Menukaarten samenstellen op basis van berekende marges' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
})
