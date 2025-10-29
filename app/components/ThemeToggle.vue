<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Theme {
  name: string
  icon: string
}

const themes = ref<Array<Theme>>([
  { name: 'light', icon: 'lucide:sun' },
  { name: 'dark', icon: 'lucide:moon' },
  { name: 'auto', icon: 'lucide:sun-moon' }
])

const activeTheme = ref<Theme>({ name: 'auto', icon: 'lucide:sun-moon' })

const setTheme = (theme: string) => {
  if (theme === 'auto') {
    document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
  } else {
    document.documentElement.setAttribute('data-bs-theme', theme)
  }
  const themeObject = themes.value.find(t => t.name === theme)
  if (!themeObject) {
    activeTheme.value = { name: 'auto', icon: 'bi-circle-half' }
  } else {
    activeTheme.value = themeObject
  }
}

const getStoredTheme = () => localStorage.getItem('theme')
const setStoredTheme = (theme: string) => localStorage.setItem('theme', theme)

const getPreferredTheme = () => {
  const storedTheme = getStoredTheme()
  if (storedTheme) {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const changeTheme = (theme: string) => {
  setStoredTheme(theme)
  setTheme(theme)
}

onMounted(() => {
  setTheme(getPreferredTheme())

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    const storedTheme = getStoredTheme()
    if (storedTheme !== 'light' && storedTheme !== 'dark') {
      setTheme(getPreferredTheme())
    }
  })

})


</script>
<template>

  <button id="bd-theme" class="btn btn-link nav-link py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center show"
    type="button" aria-expanded="false" data-bs-toggle="dropdown" data-bs-display="static"
    aria-label="Toggle theme (dark)">
    <Icon class="my-1 theme-icon-active" :name="activeTheme.icon" size="1.5em" />
    <span id="bd-theme-text" class="d-lg-none ms-2">Toggle theme</span>
  </button>
  <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="bd-theme-text" data-bs-popper="static">
    <template v-for="theme in themes" :key="theme.name">
      <li>
        <button type="button"
          :class="['dropdown-item d-flex align-items-center', theme.name === activeTheme.name ? 'active' : '']"
          :data-bs-theme-value="theme.name" aria-pressed="false" @click="changeTheme(theme.name)">
          <Icon class="bi me-2 opacity-50" :name="theme.icon" />
          {{ theme.name.charAt(0).toUpperCase() + theme.name.slice(1) }}
          <Icon v-if="theme.name === activeTheme.name" class="ms-auto d-none" name="lucide:check" />
        </button>
      </li>
    </template>
  </ul>


</template>