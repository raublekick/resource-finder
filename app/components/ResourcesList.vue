<template>
  <section>
    <div class="mb-3">
      <label for="search-input" class="visually-hidden">Search resources</label>
      <input id="search-input" v-model="searchQuery" type="text" class="form-control" placeholder="Search resources..."
        aria-label="Search resources" role="searchbox">
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

const filteredResources = computed(() => {
  if (!searchQuery.value) {
    return resources.value
  }
  return resources.value.filter(resource =>
    Object.values(resource).some(val =>
      String(val).toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  )
})

function clicked(resource: Resource) {
  console.log('Resource clicked:', resource)
}
</script>
