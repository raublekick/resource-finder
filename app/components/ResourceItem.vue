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

          <div v-if="item.donations?.toLowerCase() === 'yes'" class="mb-2">
            <Icon name="lucide:heart" class="me-2 text-success" />
            <small class="text-success">Accepts donations</small>
            <div v-if="item.donationItems && item.donationItems.length" class="mt-1">
              <span v-for="donation in item.donationItems" :key="donation" class="badge bg-info text-dark me-1">
                {{ donation }}
              </span>
            </div>
          </div>
        </div>
        <div class="col-sm text-end">
          <div v-if="item.startDate && item.endDate">
            <div class="mb-2">
              <Icon name="lucide:calendar" class="me-2 text-info" />
              <small class="text-info">
                Available from {{ new Date(item.startDate).toLocaleDateString() }} to
                {{ new Date(item.endDate).toLocaleDateString() }}
              </small>
            </div>
          </div>
          <div v-else-if="item.startDate">
            <div class="mb-2">
              <Icon name="lucide:calendar" class="me-2 text-info" />
              <small class="text-info">
                Available starting {{ new Date(item.startDate).toLocaleDateString() }}
              </small>
            </div>
          </div>
          <div v-else-if="item.endDate">
            <div class="mb-2">
              <Icon name="lucide:calendar" class="me-2 text-info" />
              <small class="text-info">
                Available until {{ new Date(item.endDate).toLocaleDateString() }}
              </small>
            </div>
          </div>


          <small v-if="item.address" class="text-muted">
            {{ item.address }}
          </small>
          <small v-if="item.phone" class="text-muted d-block">
            <Icon name="lucide:phone" class="me-2" /><a :href="`tel:${item.phone}`">{{ item.phone }}</a>
          </small>
          <small v-if="item.email" class="text-muted d-block">
            <Icon name="lucide:mail" class="me-2" /><a :href="`mailto:${item.email}`">{{ item.email }}</a>
          </small>
          <div v-if="item.socialMedia && item.socialMedia.length" class="mt-2">
            <span v-for="social in item.socialMedia" :key="social" class="me-2">
              <a :href="social" target="_blank" rel="noopener noreferrer">
                <Icon :name="`lucide:${getSocialIcon(social)}`" class="text-secondary" />
              </a>
            </span>
          </div>
          <div v-if="item.tags && item.tags.length">
            <div class="mt-2">Tags:
              <span v-for="tag in item.tags" :key="tag" class="badge bg-secondary me-1">
                {{ tag }}
              </span>
            </div>
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

function getSocialIcon(url: string): string {
  const lower = url.toLowerCase()
  if (lower.includes('facebook.com') || lower.includes('fb.com')) return 'facebook'
  if (lower.includes('instagram.com')) return 'instagram'
  if (lower.includes('twitter.com') || lower.includes('x.com')) return 'twitter'
  if (lower.includes('linkedin.com')) return 'linkedin'
  if (lower.includes('youtube.com')) return 'youtube'
  return 'link'
}

function handlePinClick() {
  let lat: number | undefined
  let lng: number | undefined

  if (props.item.lat !== undefined && props.item.lng !== undefined) {
    lat = props.item.lat
    lng = props.item.lng
  } else if (props.item.latLng && props.item.latLng.length === 2) {
    lat = props.item.latLng[0]
    lng = props.item.latLng[1]
  }

  if (lat !== undefined && lng !== undefined && Number.isFinite(lat) && Number.isFinite(lng)) {
    emit('pin-click', [lat, lng])
  }
}
</script>