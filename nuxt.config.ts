// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@vueuse/nuxt',
    '@nuxtjs/leaflet'
  ],
  pages: true, 
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '@/assets/css/print.css'
  ],
  runtimeConfig: {
    gdriveApiKey: '',
    sheetId: '',
    tabName: '',
    public: {
      mapboxKey: ''
    }
  }
})