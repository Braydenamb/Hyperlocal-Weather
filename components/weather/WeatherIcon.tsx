'use client'
import { Cloud, CloudRain, CloudSnow, CloudLightning, Sun, CloudSun, Wind, Droplets } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeatherIconProps {
  code: number
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

export function WeatherIcon({ code, className, size = 'md' }: WeatherIconProps) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10', xl: 'w-16 h-16' }
  const cls = cn(sizes[size], className)

  if (code === 0 || code === 1) return <Sun className={cn(cls, 'text-yellow-400')} />
  if (code === 2) return <CloudSun className={cn(cls, 'text-yellow-300')} />
  if (code === 3) return <Cloud className={cn(cls, 'text-slate-400')} />
  if (code === 45 || code === 48) return <Wind className={cn(cls, 'text-slate-300')} />
  if (code >= 51 && code <= 67) return <CloudRain className={cn(cls, 'text-blue-400')} />
  if (code >= 71 && code <= 77) return <CloudSnow className={cn(cls, 'text-blue-200')} />
  if (code >= 80 && code <= 82) return <CloudRain className={cn(cls, 'text-blue-500')} />
  if (code >= 95) return <CloudLightning className={cn(cls, 'text-yellow-500')} />
  return <Cloud className={cn(cls, 'text-slate-400')} />
}
