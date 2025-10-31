<script setup lang="ts">
import type { Resource } from '@/types/resource'
import { useGeolocation } from '@/composables/geolocation'

const resources = useState<Resource[]>('resources')
const center = ref<[number, number]>([33.4515, -112.07])
const mapKey = ref(0)
const userLocation = useState<[number, number] | null>('userLocation', () => null)
const searchQuery = ref('')
const selectedCategories = ref<string[]>([])
const maxDistance = ref<number | null>(null)
const config = useRuntimeConfig()

await callOnce(async () => {
  const { data } = await useFetch<Resource[]>('/api/resources')
  resources.value = (data.value || []).map(r => ({ ...r, distanceMi: undefined }))
})

const {
  coords,
  loading: geoLoading,
  error: geoError,
  permission,
  getCurrentLocation
} = useGeolocation()

if (import.meta.client) {
  getCurrentLocation()
}

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

  // Filter by max distance but include any with undefined distance
  if (maxDistance.value != null) {
    filtered = filtered.filter(resource =>
      resource.distanceMi == null || resource.distanceMi <= maxDistance.value!
    )
  }

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

const MAP_ANCHOR_ID = 'map-section'
const centerMap = (coords: Array<number>) => {
  if (coords.length === 2) {
    center.value = coords as [number, number]
    mapKey.value++
  }
  if (import.meta.client) {
    // Smooth scroll to map anchor
    const el = document.getElementById(MAP_ANCHOR_ID)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // Update URL hash without full navigation
      history.replaceState(null, '', `#${MAP_ANCHOR_ID}`)
      // Focus for keyboard accessibility (map wrapper has tabindex="-1")
      el.focus()
    }
  }
}

const toggleCategory = (category: string) => {
  const index = selectedCategories.value.indexOf(category)
  if (index === -1) {
    selectedCategories.value.push(category)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

// Haversine distance (miles)
function haversineMiles(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const toRad = (x: number) => x * Math.PI / 180
  const R = 3958.8
  const dLat = toRad(bLat - aLat)
  const dLng = toRad(bLng - aLng)
  const lat1 = toRad(aLat)
  const lat2 = toRad(bLat)

  const sinDLat = Math.sin(dLat / 2)
  const sinDLng = Math.sin(dLng / 2)

  const a =
    sinDLat * sinDLat +
    sinDLng * sinDLng * Math.cos(lat1) * Math.cos(lat2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return +(R * c).toFixed(2)
}

function recomputeDistancesMiles(userLat: number, userLng: number) {
  resources.value = resources.value.map(r => {
    // Use typed lat/lng or latLng tuple directly
    let latNum = r.lat
    let lngNum = r.lng

    if (latNum === undefined && r.latLng) {
      latNum = r.latLng[0]
      lngNum = r.latLng[1]
    }

    if (latNum !== undefined && lngNum !== undefined && Number.isFinite(latNum) && Number.isFinite(lngNum)) {
      return { ...r, distanceMi: haversineMiles(userLat, userLng, latNum, lngNum) }
    }
    return { ...r, distanceMi: undefined }
  })

  resources.value.sort((a, b) => {
    if (a.distanceMi == null && b.distanceMi == null) return 0
    if (a.distanceMi == null) return 1
    if (b.distanceMi == null) return -1
    return a.distanceMi - b.distanceMi
  })
}

watch(coords, (val) => {
  if (val) {
    userLocation.value = val
    center.value = val
    recomputeDistancesMiles(val[0], val[1])
  }
})
</script>

<template>
  <div>

    <div class="alert alert-info d-flex align-items-center d-none d-lg-flex">
      <Icon size="1.5em" name="lucide-info" class="me-2" />
      <span class="me-2">
        This data is sourced from community volunteers and feedback from
        users. Do you know of a resource that we don't?
      </span>
      <NuxtLink target="_blank" :to="config.public.addResourceUrl" class="btn btn-primary ms-auto">
        Add a Resource
      </NuxtLink>
    </div>
    <p v-if="geoLoading" class="small text-muted">
      Allow location access to see your position and distance to resources.
    </p>
    <p v-else-if="geoError" class="small text-danger">{{ geoError }}</p>
    <p v-else-if="permission === 'denied'" class="small text-danger">
      Location permission denied.
    </p>
    <p v-else-if="coords" class="small text-success">
      Location acquired: Lat: {{ coords[0].toFixed(4) }}, Lng: {{ coords[1].toFixed(4) }}
    </p>

    <MapView :key="mapKey" :items="filteredResources" :center="center" :home="userLocation" class="mb-2" />

    <div class="alert alert-info d-flex align-items-center d-lg-none">
      <Icon size="1.5em" name="lucide-info" class="me-2" />
      <span class="me-2">
        This data is sourced from community volunteers and feedback from
        users. Do you know of a resource that we don't?
      </span>
      <NuxtLink target="_blank" :to="config.public.addResourceUrl" class="btn btn-primary ms-auto">
        Add a Resource
      </NuxtLink>
    </div>

    <div class="mb-3">
      <label for="search-input" class="visually-hidden">Search resources</label>
      <input id="search-input" v-model="searchQuery" type="text" class="form-control" placeholder="Search resources..."
        aria-label="Search resources" role="searchbox">
    </div>

    <div class="mb-3">
      <label for="distance-filter" class="form-label">Distance (miles)</label>
      <select id="distance-filter" v-model="maxDistance" class="form-select">
        <option :value="null">All</option>
        <option :value="0.5">0.5 miles</option>
        <option :value="1">1 mile</option>
        <option :value="5">5 miles</option>
        <option :value="10">10 miles</option>
        <option :value="25">25 miles</option>
        <option :value="50">50 miles</option>
        <option :value="100">100 miles</option>
      </select>
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

    <ResourcesList :items="filteredResources" @pin-click="centerMap" />
  </div>
</template>