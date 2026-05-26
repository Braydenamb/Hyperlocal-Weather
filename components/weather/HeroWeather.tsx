'use client'
import { motion } from 'framer-motion'
import { Wind, Droplets, Eye, Gauge, Sun } from 'lucide-react'
import { useWeather } from '@/hooks/useWeather'
import { WeatherIcon } from './WeatherIcon'
import { getWeatherDescription, getWeatherIcon } from '@/lib/weather/openMeteo'
import { getSkyGradient, getWindDirection, formatTemperature } from '@/lib/utils'

export function HeroWeather() {
  const { weatherData, location, isLoading } = useWeather()

  const now = new Date()
  const hour = now.getHours()
  const currentWeather = weatherData?.current_weather
  const hourly = weatherData?.hourly
  const currentIndex = hourly?.time.findIndex(t => new Date(t).getHours() === hour) ?? 0
  const idx = currentIndex >= 0 ? currentIndex : 0

  const humidity = hourly?.relativehumidity_2m[idx] ?? 65
  const feelsLike = hourly?.apparent_temperature[idx] ?? (currentWeather?.temperature ?? 22)
  const uvIndex = hourly?.uv_index[idx] ?? 4
  const pressure = hourly?.surface_pressure[idx] ?? 1013

  const skyGradient = getSkyGradient(currentWeather?.weathercode ?? 0, hour)

  if (isLoading && !weatherData) {
    return (
      <div className="h-64 rounded-3xl bg-white/[0.04] border border-white/[0.06] animate-pulse flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading weather data...</div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-3xl overflow-hidden border border-white/[0.08]"
    >
      {/* Sky gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${skyGradient} opacity-60`} />
      
      {/* Animated cloud overlays */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-48 h-20 rounded-full bg-white/[0.04] blur-2xl"
            animate={{
              x: ['-10%', '110%'],
              y: [`${20 + i * 25}%`, `${15 + i * 25}%`, `${20 + i * 25}%`],
            }}
            transition={{
              x: { duration: 20 + i * 8, repeat: Infinity, ease: 'linear' },
              y: { duration: 5 + i * 2, repeat: Infinity, ease: 'easeInOut' },
              delay: i * 7,
            }}
          />
        ))}
      </div>

      {/* Glass overlay */}
      <div className="absolute inset-0 bg-[#0B1020]/40 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 p-6">
        <div className="flex items-start justify-between">
          {/* Main temp */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">{location?.name ?? 'New York City'}</span>
            </div>
            <div className="flex items-end gap-3">
              <motion.div
                key={currentWeather?.temperature}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl font-bold text-white tracking-tighter leading-none"
              >
                {currentWeather ? Math.round(currentWeather.temperature) : '--'}
              </motion.div>
              <div className="text-3xl font-light text-slate-300 mb-3">°C</div>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <WeatherIcon code={currentWeather?.weathercode ?? 0} size="sm" />
              <span className="text-sm text-slate-300">
                {getWeatherDescription(currentWeather?.weathercode ?? 0)}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1">Feels like {Math.round(feelsLike)}°C</div>
          </div>

          {/* Large weather icon */}
          <div className="text-7xl opacity-80 select-none">
            {getWeatherIcon(currentWeather?.weathercode ?? 0)}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mt-5">
          {[
            { icon: Droplets, label: 'Humidity', value: `${humidity}%`, color: 'text-blue-400' },
            { icon: Wind, label: 'Wind', value: `${Math.round(currentWeather?.windspeed ?? 0)} km/h`, color: 'text-cyan-400' },
            { icon: Sun, label: 'UV Index', value: String(uvIndex), color: 'text-yellow-400' },
            { icon: Gauge, label: 'Pressure', value: `${Math.round(pressure)} hPa`, color: 'text-violet-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="bg-white/[0.06] rounded-xl p-2.5 border border-white/[0.06]">
              <Icon className={`w-4 h-4 ${color} mb-1`} />
              <div className="text-xs text-slate-400">{label}</div>
              <div className="text-sm font-semibold text-white mt-0.5">{value}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
