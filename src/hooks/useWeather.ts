'use client';

import { useEffect } from 'react';
import { useWeatherStore } from '@/stores/weatherStore';
import { useLocationStore } from '@/stores/locationStore';

export function useWeather() {
  const { currentWeather, hourlyForecast, dailyForecast, airQuality, isLoading, error, fetchWeather } =
    useWeatherStore();
  const currentLocation = useLocationStore((s) => s.currentLocation);

  useEffect(() => {
    if (currentLocation) {
      fetchWeather(currentLocation.latitude, currentLocation.longitude);
    }
  }, [currentLocation, fetchWeather]);

  return { currentWeather, hourlyForecast, dailyForecast, airQuality, isLoading, error };
}
