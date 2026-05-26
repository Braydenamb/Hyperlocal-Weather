'use client'
import { useEffect } from 'react'
import { useWeatherStore } from '@/stores/weatherStore'
import { fetchWeather } from '@/lib/weather/openMeteo'

export function useWeather() {
  const { weatherData, location, isLoading, error, setWeatherData, setLoading, setError } = useWeatherStore()

  useEffect(() => {
    if (!location) return

    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await fetchWeather(location.lat, location.lon)
        setWeatherData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch weather')
      } finally {
        setLoading(false)
      }
    }

    load()
    const interval = setInterval(load, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [location, setWeatherData, setLoading, setError])

  return { weatherData, location, isLoading, error }
}
