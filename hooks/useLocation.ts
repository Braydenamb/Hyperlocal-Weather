'use client'
import { useState, useEffect } from 'react'
import { useWeatherStore } from '@/stores/weatherStore'

export function useLocation() {
  const { setLocation } = useWeatherStore()
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown')

  const requestLocation = () => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          name: 'Your Location',
        })
        setPermissionState('granted')
      },
      () => {
        setPermissionState('denied')
      }
    )
  }

  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        setPermissionState(result.state as 'granted' | 'denied' | 'prompt')
      })
    }
  }, [])

  return { permissionState, requestLocation }
}
