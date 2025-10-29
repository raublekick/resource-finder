<template>
  <section>
    <div v-for="(resource, i) in items" :key="i" class="mt-4">
      <ResourceItem :item="resource" :persistent-tooltip="i === 0" @pin-click="clicked" />
    </div>
  </section>
</template>
<script setup lang="ts">
import type { Resource } from '@/types/resource'

const props = defineProps<{
  items?: Resource[]
}>()

const emits = defineEmits<{
  (e: 'pin-click', coords: Array<number>): void
}>()

function clicked(coords: Array<number>) {
  emits('pin-click', coords)
}
</script>
