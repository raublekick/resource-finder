interface GeolocationState {
  coords: Ref<[number, number] | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  permission: Ref<PermissionState | 'unsupported' | 'prompt'>
  getCurrentLocation: () => Promise<void>
  watchLocation: () => void
  stopWatching: () => void
}

let watchId: number | null = null

export function useGeolocation(): GeolocationState {
  const coords = ref<[number, number] | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const permission = ref<PermissionState | 'unsupported' | 'prompt'>('prompt')

  const updatePermission = async () => {
    if (!('permissions' in navigator)) {
      permission.value = 'unsupported'
      return
    }
    try {
      const status = await (navigator as any).permissions.query({ name: 'geolocation' })
      permission.value = status.state
      status.onchange = () => {
        permission.value = status.state
      }
    } catch {
      // Some browsers throw
      permission.value = 'unsupported'
    }
  }

  const getCurrentLocation = async () => {
    console.log('Permission state:', permission.value) // Add this
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }
    loading.value = true
    error.value = null
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          coords.value = [pos.coords.latitude, pos.coords.longitude]
          loading.value = false
          resolve()
        },
        (err) => {
          loading.value = false
          error.value = err.message
          resolve()
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  const watchLocation = () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      error.value = 'Geolocation not supported'
      return
    }
    if (watchId !== null) return
    watchId = navigator.geolocation.watchPosition(
      (pos) => {
        coords.value = [pos.coords.latitude, pos.coords.longitude]
      },
      (err) => {
        error.value = err.message
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000
      }
    )
  }

  const stopWatching = () => {
    if (watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId)
      watchId = null
    }
  }

  if (process.client) {
    updatePermission()
  }

  return {
    coords,
    loading,
    error,
    permission,
    getCurrentLocation,
    watchLocation,
    stopWatching
  }
}