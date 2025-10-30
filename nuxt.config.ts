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
  css: ['bootstrap/dist/css/bootstrap.min.css'],
  runtimeConfig: {
    gdriveApiKey: process.env.NUXT_GDRIVE_API_KEY || '',
    sheetId: process.env.NUXT_SHEET_ID || '',
    tabName: process.env.NUXT_TAB_NAME || '',
    public: {
      mapboxKey: process.env.NUXT_PUBLIC_MAPBOX_KEY || ''
    }
  }
})