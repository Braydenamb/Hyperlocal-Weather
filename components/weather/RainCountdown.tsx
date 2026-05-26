'use client'
import { motion } from 'framer-motion'
import { CloudRain, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { useWeather } from '@/hooks/useWeather'

export function RainCountdown() {
  const { weatherData } = useWeather()
  const now = new Date()

  let rainHoursAhead = -1
  if (weatherData?.hourly) {
    const { time, precipitation_probability } = weatherData.hourly
    for (let i = 0; i < time.length; i++) {
      const t = new Date(time[i])
      if (t > now && precipitation_probability[i] > 50) {
        rainHoursAhead = Math.round((t.getTime() - now.getTime()) / 3600000)
        break
      }
    }
  }

  return (
    <GlassCard className="p-4" glow="blue">
      <div className="flex items-center gap-2 mb-3">
        <CloudRain className="w-4 h-4 text-blue-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Rain Forecast</span>
      </div>
      {rainHoursAhead > 0 ? (
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-blue-400">{rainHoursAhead}</span>
            <span className="text-sm text-slate-400">hours away</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <Clock className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-400">Rain expected around {new Date(now.getTime() + rainHoursAhead * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="mt-3 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(5, 100 - (rainHoursAhead / 24) * 100)}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>
      ) : rainHoursAhead === 0 ? (
        <div className="text-sm text-blue-400 font-medium">Raining now!</div>
      ) : (
        <div>
          <div className="text-lg font-semibold text-green-400">No rain expected</div>
          <div className="text-xs text-slate-400 mt-1">Clear conditions for the next 24h</div>
        </div>
      )}
    </GlassCard>
  )
}
