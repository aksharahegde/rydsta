import { fileURLToPath } from 'node:url'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxtjs/seo', '@vueuse/nuxt'],
  alias: {
    '#shared': fileURLToPath(new URL('./shared', import.meta.url)),
  },
  routeRules: {
    '/': { prerender: true },
    '/upload': { ssr: false },
    '/map': { ssr: false },
    '/wrapped': { ssr: false },
  },
  vite: {
    worker: { format: 'es' },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
