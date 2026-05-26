import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTemperature(temp: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    return `${Math.round(temp * 9/5 + 32)}°F`
  }
  return `${Math.round(temp)}°C`
}

export function formatWindSpeed(speed: number, unit: 'metric' | 'imperial' = 'metric'): string {
  if (unit === 'imperial') {
    return `${Math.round(speed * 0.621371)} mph`
  }
  return `${Math.round(speed)} km/h`
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  const index = Math.round(degrees / 22.5) % 16
  return directions[index]
}

export function getSkyGradient(weatherCode: number, hour: number): string {
  const isNight = hour < 6 || hour >= 20
  if (isNight) return 'from-[#0B1020] via-[#0D1535] to-[#0B1020]'
  if (weatherCode === 0 || weatherCode === 1) {
    if (hour < 9) return 'from-[#FF6B35] via-[#FF8E53] to-[#FFC470]'
    if (hour >= 17) return 'from-[#FF6B35] via-[#C25B8A] to-[#7B5EA7]'
    return 'from-[#1a6bc9] via-[#2d9bde] to-[#87CEEB]'
  }
  if (weatherCode <= 3) return 'from-[#4a6fa5] via-[#6889b7] to-[#8aaad4]'
  return 'from-[#3a4a6a] via-[#4a5a7a] to-[#5a6a8a]'
}
