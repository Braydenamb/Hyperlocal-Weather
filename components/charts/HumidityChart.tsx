'use client'
import { useMemo } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'
import { useWeather } from '@/hooks/useWeather'

export function HumidityChart() {
  const { weatherData } = useWeather()

  const data = useMemo(() => {
    if (!weatherData?.hourly) return []
    return weatherData.hourly.time.slice(0, 24).map((t, i) => ({
      time: new Date(t).toLocaleTimeString([], { hour: '2-digit' }),
      humidity: weatherData.hourly.relativehumidity_2m[i],
    }))
  }, [weatherData])

  return (
    <GlassCard className="p-4" glow="green">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Relative Humidity (%)</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: '#0B1020', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: 12 }} />
            <Area type="monotone" dataKey="humidity" stroke="#22C55E" strokeWidth={2} fill="url(#humGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  )
}
