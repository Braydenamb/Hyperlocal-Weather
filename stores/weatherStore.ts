import { create } from 'zustand'
import { OpenMeteoResponse } from '@/lib/weather/openMeteo'

interface WeatherState {
  weatherData: OpenMeteoResponse | null
  location: { lat: number; lon: number; name: string } | null
  isLoading: boolean
  error: string | null
  setWeatherData: (data: OpenMeteoResponse) => void
  setLocation: (location: { lat: number; lon: number; name: string }) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export const useWeatherStore = create<WeatherState>((set) => ({
  weatherData: null,
  location: { lat: 40.7128, lon: -74.006, name: 'New York City' },
  isLoading: false,
  error: null,
  setWeatherData: (data) => set({ weatherData: data }),
  setLocation: (location) => set({ location }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
