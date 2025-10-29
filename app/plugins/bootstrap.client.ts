import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.js'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      bootstrap
    }
  }
})