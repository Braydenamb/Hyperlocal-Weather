'use client'
import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'
import { useWeather } from '@/hooks/useWeather'

export function RainChart() {
  const { weatherData } = useWeather()

  const data = useMemo(() => {
    if (!weatherData?.hourly) return []
    return weatherData.hourly.time.slice(0, 24).map((t, i) => ({
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit' }),
      prob: weatherData.hourly.precipitation_probability[i],
      mm: weatherData.hourly.precipitation[i],
    }))
  }, [weatherData])

  const fallback = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}h`,
    prob: Math.max(0, 20 + Math.sin(i / 4) * 30),
    mm: Math.max(0, Math.sin(i / 4) * 2),
  }))

  return (
    <GlassCard className="p-4" glow="cyan">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Precipitation Probability</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data.length ? data : fallback} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              itemStyle={{ color: '#06B6D4' }}
            />
            <Bar dataKey="prob" fill="rgba(6,182,212,0.6)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
