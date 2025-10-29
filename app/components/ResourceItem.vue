<template>
  <div class="card position-relative">
    <Icon v-if="item.latLng" name="lucide:map-pin" class="position-absolute top-0 start-0 m-2 text-primary"
      size="1.5em" />
    <span v-if="item.lastUpdated" class="position-absolute top-0 end-0 m-2">
      <small class="text-muted">Last updated: {{ new Date(item.lastUpdated).toLocaleDateString() }}</small>
    </span>
    <div class="card-body ps-5 pe-4">
      <h4 class="card-title">{{ item.name }}</h4>
      <p class="card-text text-muted mb-2">
        {{ item.category }}
      </p>


      <div class="row">
        <div class="col">
          <div><a :href="item.website" target="_blank" rel="noopener noreferrer">
              <Icon name="lucide:link" class="me-2" />{{ item.website }}
            </a></div>
          <p v-if="item.description" class="card-text">{{ item.description }}</p>
        </div>
        <div class="col text-end">
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
</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>