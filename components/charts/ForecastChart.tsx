'use client'
import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'
import { useWeather } from '@/hooks/useWeather'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number; name: string }>
  label?: string
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0B1020]/90 border border-white/10 rounded-xl px-3 py-2 text-xs">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-white font-medium">{Math.round(p.value)}{p.name === 'temp' ? '°C' : '%'}</span>
        </div>
      ))}
    </div>
  )
}

export function ForecastChart() {
  const { weatherData } = useWeather()

  const data = useMemo(() => {
    if (!weatherData?.hourly) return []
    return weatherData.hourly.time
      .slice(0, 24)
      .map((t, i) => ({
        time: new Date(t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temp: weatherData.hourly.temperature_2m[i],
        precip: weatherData.hourly.precipitation_probability[i],
        wind: weatherData.hourly.windspeed_10m[i],
      }))
  }, [weatherData])

  const fallback = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    temp: 20 + Math.sin(i / 4) * 5 + (Math.random() - 0.5) * 2,
    precip: Math.max(0, 30 + Math.sin(i / 3) * 25),
    wind: 10 + Math.random() * 10,
  }))

  const chartData = data.length > 0 ? data : fallback

  return (
    <GlassCard className="p-4" glow="blue">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">24-Hour Forecast</h3>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-cyan-400 rounded" />Temp</div>
          <div className="flex items-center gap-1"><div className="w-3 h-0.5 bg-blue-400 rounded" />Rain%</div>
        </div>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tick={{ fill: '#64748b', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              interval={3}
            />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="temp" name="temp" stroke="#06B6D4" strokeWidth={2} fill="url(#tempGrad)" dot={false} />
            <Area type="monotone" dataKey="precip" name="precip" stroke="#3B82F6" strokeWidth={1.5} fill="url(#precipGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
