import tailwind from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: ['@nuxt/ui'],
  runtimeConfig: {
    twitch: {
      clientId: '',
      clientSecret: ''
    }
  },
  nitro: {
    storage: {
      cache: {
        driver: 'cloudflareKVBinding',
      }
    }
  },

  vite: {
    // @ts-expect-error Plugin Types?
    plugins: [tailwind()]
  },
  css: ['~/assets/main.css']
})
