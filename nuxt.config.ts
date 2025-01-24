import tailwind from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  future: {
    compatibilityVersion: 4
  },
  runtimeConfig: {
    twitch: {
      clientId: '',
      clientSecret: ''
    }
  },
  vite: {
    plugins: [tailwind()]
  },
  css: ['~/assets/main.css']
})
