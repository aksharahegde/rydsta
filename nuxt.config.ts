import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxtjs/seo', '@vueuse/nuxt'],
  css: ['~/assets/css/main.css'],
  site: {
    url: 'https://ride-wrapped.example',
    name: 'Ride Wrapped',
    description:
      'Turn your Uber, Ola, and Rapido trip exports into a shareable year-in-rides story. 100% in your browser.',
    defaultLocale: 'en',
  },
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
    plugins: [tailwindcss()],
    worker: { format: 'es' },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
