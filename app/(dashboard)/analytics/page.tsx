import { ForecastChart } from '@/components/charts/ForecastChart'
import { HumidityChart } from '@/components/charts/HumidityChart'
import { PressureChart } from '@/components/charts/PressureChart'
import { WindChart } from '@/components/charts/WindChart'
import { BarChart3 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export default function AnalyticsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <BarChart3 className="w-5 h-5 text-violet-400" />
        <h1 className="text-xl font-bold text-white">Analytics</h1>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Avg Temp (7d)', value: '21.4°C', delta: '+1.2°', color: 'text-cyan-400' },
          { label: 'Total Rainfall', value: '12.3mm', delta: '+3.1mm', color: 'text-blue-400' },
          { label: 'Peak Wind', value: '47 km/h', delta: '-8%', color: 'text-violet-400' },
        ].map(({ label, value, delta, color }) => (
          <GlassCard key={label} className="p-4">
            <div className="text-xs text-slate-400 mb-1">{label}</div>
            <div className={`text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{delta} vs last week</div>
          </GlassCard>
        ))}
      </div>

      <ForecastChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <HumidityChart />
        <PressureChart />
        <WindChart />
      </div>
    </div>
  )
}
