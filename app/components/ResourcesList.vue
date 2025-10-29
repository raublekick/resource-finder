<template>
  <section>
    <div class="mb-3">
      <label for="search-input" class="visually-hidden">Search resources</label>
      <input id="search-input" v-model="searchQuery" type="text" class="form-control" placeholder="Search resources..."
        aria-label="Search resources" role="searchbox">
    </div>

    <div v-if="categories.length > 0" class="mb-4">
      <h5 class="mb-3 visually-hidden">Filter by Category</h5>
      <div class="d-flex flex-wrap gap-2">
        <button v-for="category in categories" :key="category" :class="[
          'btn btn-sm',
          selectedCategories.includes(category) ? 'btn-primary' : 'btn-outline-secondary'
        ]" :aria-pressed="selectedCategories.includes(category)" @click="toggleCategory(category)">
          {{ category }}
        </button>
      </div>
    </div>

    <div v-for="(resource, i) in filteredResources" :key="i" class="mt-4">
      <ResourceItem :item="resource" :persistent-tooltip="i === 0" @clicked="clicked" />
    </div>
  </section>
</template>
<script setup lang="ts">
import type { Resource } from '@/types/resource'

const resources = useState<Resource[]>('resources')
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])

// Get unique categories from resources
const categories = computed(() => {
  if (!resources.value) return []
  const uniqueCategories = new Set(
    resources.value
      .map(resource => resource.category)
      .filter(category => category && category.trim() !== '')
  )
  return Array.from(uniqueCategories).sort()
})

const filteredResources = computed(() => {
  let filtered = resources.value || []

  // Filter by selected categories
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(resource =>
      selectedCategories.value.includes(resource.category)
    )
  }

  // Filter by search query
  if (searchQuery.value) {
    filtered = filtered.filter(resource =>
      Object.values(resource).some(val =>
        String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
      )
    )
  }

  return filtered
})

const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

function clicked(resource: Resource) {
  console.log('Resource clicked:', resource)
}
</script>
