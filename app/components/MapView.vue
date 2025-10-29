<template>
  <div>
    <LMap ref="map" :zoom="zoom" :center="center" :use-global-leaflet="false" style="height: 500px; width: 100%">
      <LTileLayer :url="url" :attribution="attribution" layer-type="base" name="OpenStreetMap" />
      <LMarker v-if="props.home" :draggable="false" :lat-lng="props.home">
        <LIcon :icon-url="icons[1]" :icon-size="iconSize" :icon-anchor="iconAnchor" :popup-anchor="popupAnchor" />
      </LMarker>
      <LMarker v-for="(item, index) in itemsWithCoords" :key="index" ref="markersRef" :draggable="false"
        :lat-lng="{ lat: parseFloat(item.lat || '0'), lng: parseFloat(item.lng || '0') }">
        <LIcon :icon-url="icons[0]" :icon-size="iconSize" :icon-anchor="iconAnchor" :popup-anchor="popupAnchor" />
        <LPopup>
          <h5>
            <a :href="item.website" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
          </h5>
          <div>{{ item.address }}</div>
          <div class="text-muted">{{ item.category }}</div>
        </LPopup>
      </LMarker>
    </LMap>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Resource } from '@/types/resource'
const config = useRuntimeConfig()

interface Props {
  items?: Resource[]
  center?: [number, number]
  home?: [number, number] | null
}

const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  center: () => [33.4515, -112.07],
  home: null
})

const url = ref(
  "https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=" +
  config.public.mapboxKey
)
const attribution = ref(
  'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
)

const mapRef = ref()
const homeMarkerRef = ref()
const markersRef = ref<any[]>([])

const icons = [
  '/pin-blue.png',
  '/pin-red.png',
  '/pin-green.png',
  '/pin-yellow.png',
]

const iconSize: [number, number] = [45, 37]
const iconAnchor: [number, number] = [11, 36]
const popupAnchor: [number, number] = [0, -26]
const defaultZoom = 12
const zoom = ref(defaultZoom)

const itemsWithCoords = computed(() =>
  props.items?.filter(
    item => item.lat && item.lng && !isNaN(parseFloat(item.lat)) && !isNaN(parseFloat(item.lng))
  ) || []
)

// Watch for center changes
watch(() => props.center, (newCenter) => {
  if (mapRef.value?.mapObject) {
    mapRef.value.mapObject.setView(newCenter, defaultZoom)

    // Open popup for marker at the new center
    nextTick(() => {
      if (markersRef.value) {
        const markerObjects = markersRef.value.map((ref: any) => ref.mapObject)
        markerObjects.forEach((marker: any) => {
          if (marker && marker._latlng.lat === newCenter[0] && marker._latlng.lng === newCenter[1]) {
            marker.openPopup()
          }
        })
      }
    })
  }
})
</script>