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
          innerHTML: `(function(){try{var k='rydsta-color-mode',s=localStorage.getItem(k),d=s==='dark';if(d)document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark')}catch(e){}})();`,
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
    url: 'https://rydsta.vercel.app',
    name: 'Rydsta',
    description:
      'Turn your Uber, Ola, and Rapido trip exports into a visual ride story. 100% in your browser.',
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
  },
  vite: {
    plugins: [tailwindcss()],
    worker: { format: 'es' },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
