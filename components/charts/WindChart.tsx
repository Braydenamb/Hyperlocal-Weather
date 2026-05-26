'use client'
import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'
import { useWeather } from '@/hooks/useWeather'

export function WindChart() {
  const { weatherData } = useWeather()

  const data = useMemo(() => {
    if (!weatherData?.hourly) return []
    return weatherData.hourly.time.slice(0, 24).map((t, i) => ({
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit' }),
      speed: weatherData.hourly.windspeed_10m[i],
    }))
  }, [weatherData])

  return (
    <GlassCard className="p-4" glow="violet">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Wind Speed (km/h)</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data.length ? data : []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#8B5CF6' }}
            />
            <Line type="monotone" dataKey="speed" stroke="#8B5CF6" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
