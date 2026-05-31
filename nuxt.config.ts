import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxtjs/seo', '@vueuse/nuxt', 'shadcn-nuxt'],
  app: {
    head: {
      script: [
        {
          key: 'ride-theme-init',
          innerHTML: `(function(){try{var k='ride-wrapped-color-mode',s=localStorage.getItem(k),d=s==='dark';if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')}catch(e){}})();`,
          tagPosition: 'head',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  shadcn: {
    prefix: '',
    componentDir: '@/components/ui',
  },
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
    '/about': { prerender: true },
    '/upload': { ssr: false },
    '/map': { ssr: false },
    '/wrapped': { ssr: false },
    // Content Security Policy — locks down external connections to only what the app needs.
    // script-src: 'unsafe-inline' required for the theme-init inline script injected by nuxt.config.
    // connect-src: openfreemap.org for MapLibre tile/style fetches.
    // worker-src blob: required for MapLibre GL's web worker bundle.
    '/**': {
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
          "font-src 'self' https://fonts.gstatic.com",
          "img-src 'self' data: blob: https://tiles.openfreemap.org",
          "connect-src 'self' https://tiles.openfreemap.org",
          "worker-src 'self' blob:",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
    },
  },
  vite: {
    plugins: [tailwindcss()],
    worker: { format: 'es' },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
