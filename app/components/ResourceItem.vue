<template>
  <div class="card position-relative">
    <Icon v-if="item.latLng" name="lucide:map-pin" class="position-absolute top-0 start-0 m-2 text-primary"
      size="1.5em" />
    <div class="card-body" :class="{ 'ps-5': item.latLng }">
      <h4 class="card-title">{{ item.name }}</h4>
      <p class="card-text text-muted mb-2">
        {{ item.category }}
      </p>
      <p v-if="item.description" class="card-text">{{ item.description }}</p>
      <small v-if="item.address" class="text-muted">
        {{ item.address }}
      </small>
      <div><a :href="item.website" target="_blank" rel="noopener noreferrer">
          <Icon name="lucide:link" class="me-2" />{{ item.website }}
        </a></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Resource } from '@/types/resource'

defineProps<{
  item: Resource
}>()
</script>

<style scoped>
/* Custom styles can be added here if needed */
</style>