import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-01-01',
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['shadcn-nuxt'],
  app: {
    head: {
      titleTemplate: '%s - Raya UI',
      title: 'Raya UI',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'charset', content: 'utf-8' },
        { name: 'author', content: 'Iman Mohamadi' },
        { name: 'description', content: 'Beautifully designed Vue & Nuxt components built with Shadcn UI & Tailwind. Copy-paste, accessible, and open source.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Raya UI - Vue & Nuxt Components' },
        { property: 'og:description', content: 'Copy-paste accessible components for your next Vue project.' },
        { property: 'og:image', content: '/og-image.png' },
        { property: 'og:url', content: '/' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Raya UI' },
        { name: 'twitter:description', content: 'Beautifully designed Vue & Nuxt components.' },
        { name: 'twitter:image', content: '/og-image.png' }
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  shadcn: {
    /**
     * Prefix for all the imported component.
     * @default "Ui"
     */
    prefix: 'Ui',
    /**
     * Directory that the component lives in.
     * Will respect the Nuxt aliases.
     * @link https://nuxt.com/docs/api/nuxt-config#alias
     * @default "@/components/ui"
     */
    componentDir: '@/components/ui',
  },
})
