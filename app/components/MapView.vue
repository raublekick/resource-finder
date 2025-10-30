<template>
  <div>


    <ClientOnly>
      <LMap v-show="itemsWithCoords.length" id="map-section" ref="mapRef" :zoom="zoom" :center="center"
        :use-global-leaflet="false" style="height: 500px; width: 100%" :options="leafletOptions">
        <LTileLayer :url="url" :attribution="attribution" layer-type="base" name="OpenStreetMap" />
        <LMarker v-if="props.home" :lat-lng="props.home" :draggable="false" :title="'Your location'">
          <LIcon :icon-url="icons[1]" :icon-size="iconSize" :icon-anchor="iconAnchor" :popup-anchor="popupAnchor" />
          <LPopup>You are here</LPopup>
        </LMarker>
        <template v-for="(item, idx) in itemsWithCoords" :key="idx">
          <LMarker :lat-lng="{ lat: item.lat!, lng: item.lng! }" :draggable="false" :title="item.name"
            :class="['resource-marker', item === selectedItem ? 'selected-marker' : '']"
            @click="handleMarkerClick(item)">
            <LIcon :icon-url="item === selectedItem ? icons[2] : icons[0]" :icon-size="iconSize"
              :icon-anchor="iconAnchor" :popup-anchor="popupAnchor" />
            <LPopup>
              <article class="popup-content" :aria-label="`Resource: ${item.name}`">
                <h6 class="mb-1">
                  <a :href="item.website" target="_blank" rel="noopener noreferrer">{{ item.name }}</a>
                </h6>
                <div v-if="item.address" class="small">{{ item.address }}</div>
                <div v-if="item.category" class="text-muted small">{{ item.category }}</div>
                <div v-if="item.distanceMi != null" class="small">
                  {{ item.distanceMi.toFixed(1) }} mi away
                </div>
              </article>
            </LPopup>
          </LMarker>
        </template>
      </LMap>
    </ClientOnly>
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
const markersRef = ref<any[]>([])
const selectedItem = ref<Resource | null>(null)
const loading = ref(true)

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

const leafletOptions = {
  zoomSnap: 0.5,
  wheelDebounceTime: 50,
  touchZoom: true
}

const itemsWithCoords = computed(() =>
  props.items?.filter(
    item => item.lat && item.lng && !isNaN(parseFloat(item.lat)) && !isNaN(parseFloat(item.lng))
  ) || []
)

function handleMarkerClick(item: Resource) {
  selectedItem.value = item
}

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

watch(itemsWithCoords, (list) => {
  if (!list.length) {
    loading.value = false
    return
  }
  loading.value = false
})

onMounted(() => {
  if (!itemsWithCoords.value.length) {
    loading.value = false
  }
})
</script>
<style scoped>
.map-wrapper {
  position: relative;
}

.map-controls {
  z-index: 1000;
}

.map-controls .btn {
  box-shadow: 0 1px 2px rgba(0, 0, 0, .15);
}

/* .map-loading,
.map-empty {
  position: absolute;
  inset: 0;
  background: #fff;
  z-index: 500;
} */

.resource-marker.selected-marker :deep(img) {
  filter: drop-shadow(0 0 4px #28a745);
}

.popup-content a {
  text-decoration: none;
}

.popup-content a:hover,
.popup-content a:focus {
  text-decoration: underline;
}
</style>