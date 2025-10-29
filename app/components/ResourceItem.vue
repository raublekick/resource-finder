<template>
  <div class="card position-relative">
    <button v-if="item.latLng || (item.lat && item.lng)" class="btn btn-link position-absolute top-0 start-0 m-2 p-0"
      aria-label="Center map on this location" title="Center map on this location" @click="handlePinClick">
      <Icon name="lucide:map-pin" class="text-primary" size="1.5em" />
    </button>
    <span v-if="item.lastUpdated" class="position-absolute top-0 end-0 m-2">
      <small class="text-muted">Last updated: {{ new Date(item.lastUpdated).toLocaleDateString() }}</small>
    </span>
    <div class="card-body ps-5 pe-4">
      <h4 class="card-title">{{ item.name }}</h4>
      <p class="card-text text-muted mb-2">
        {{ item.category }}
      </p>


      <div class="row">
        <div class="col-sm">
          <div><a :href="item.website" target="_blank" rel="noopener noreferrer">
              <Icon name="lucide:link" class="me-2" />{{ item.website }}
            </a></div>
          <p v-if="item.description" class="card-text">{{ item.description }}</p>
        </div>
        <div class="col-sm text-end">
          <small v-if="item.address" class="text-muted">
            {{ item.address }}
          </small>
          <small v-if="item.phone" class="text-muted d-block">
            <Icon name="lucide:phone" class="me-2" /><a :href="`tel:${item.phone}`">{{ item.phone }}</a>
          </small>
          <small v-if="item.email" class="text-muted d-block">
            <Icon name="lucide:mail" class="me-2" /><a :href="`mailto:${item.email}`">{{ item.email }}</a>
          </small>
          <div v-if="socialMedia.length" class="mt-2">
            <span v-for="social in socialMedia" :key="social.url" class="me-2">
              <a :href="social.url" target="_blank" rel="noopener noreferrer">
                <Icon :name="`lucide:${social.service}`" class="text-secondary" />
              </a>
            </span>
          </div>
        </div>



        <div v-if="item.donations" class="mb-2">
          <Icon name="lucide:heart" class="me-2 text-success" />
          <small class="text-success">Accepts donations</small>
          <div v-if="donations.length" class="mt-1">
            <span v-for="donation in donations" :key="donation" class="badge bg-info text-dark me-1">
              {{ donation }}
            </span>
          </div>
        </div>

        <div v-if="item.tags">
          <div class="mt-2">
            <span v-for="tag in tags" :key="tag" class="badge bg-secondary me-1">
              {{ tag }}
            </span>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import type { Resource } from '@/types/resource'

const props = defineProps<{
  item: Resource
}>()

const emit = defineEmits<{
  (e: 'pin-click', coords: [number, number]): void
}>()

const tags = computed(() => {
  return props.item.tags ? props.item.tags.split(',').map((tag: string) => tag.trim()) : []
})

const donations = computed(() => {
  if (props.item.donations && props.item.donations.toLowerCase() !== 'yes' && props.item.donations.toLowerCase() !== 'null') {
    return props.item.donations.split(',').map((donation: string) => donation.trim())
  }
  return []
})

const socialMedia = computed(() => {
  if (props.item.socialMedia) {
    return props.item.socialMedia.split(',').map((social: string) => {
      const trimmed = social.trim()
      const url = trimmed.toLowerCase()

      let service = 'other'
      if (url.includes('facebook.com') || url.includes('fb.com')) {
        service = 'facebook'
      } else if (url.includes('instagram.com')) {
        service = 'instagram'
      } else if (url.includes('twitter.com') || url.includes('x.com')) {
        service = 'twitter'
      } else if (url.includes('linkedin.com')) {
        service = 'linkedin'
      } else if (url.includes('youtube.com')) {
        service = 'youtube'
      }

      return { service, url: trimmed }
    })
  }
  return []
})

function handlePinClick() {
  // Extract coordinates
  let lat: number | undefined
  let lng: number | undefined

  if (props.item.lat && props.item.lng) {
    lat = Number(props.item.lat)
    lng = Number(props.item.lng)
  } else if (props.item.latLng) {
    const parts = props.item.latLng.split(',').map(p => p.trim())
    if (parts.length === 2) {
      lat = Number(parts[0])
      lng = Number(parts[1])
    }
  }

  if (lat !== undefined && lng !== undefined && Number.isFinite(lat) && Number.isFinite(lng)) {
    emit('pin-click', [lat, lng])
  }
}
</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>