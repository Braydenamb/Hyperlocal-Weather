import { HeroWeather } from '@/components/weather/HeroWeather'
import { KPICard } from '@/components/weather/KPICard'
import { ForecastChart } from '@/components/charts/ForecastChart'
import { RainCountdown } from '@/components/weather/RainCountdown'
import { ConfidenceGauge } from '@/components/weather/ConfidenceGauge'
import { RainChart } from '@/components/charts/RainChart'
import { WindChart } from '@/components/charts/WindChart'
import { Thermometer, Droplets, Wind, Eye, Gauge, Activity } from 'lucide-react'

export default function OverviewPage() {
  return (
    <div className="p-4 space-y-4 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-bold text-white">Weather Overview</h1>
          <p className="text-xs text-slate-400 mt-0.5">Real-time hyperlocal intelligence</p>
        </div>
        <div className="text-xs text-slate-500">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Hero */}
      <HeroWeather />

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        <KPICard title="Temperature" value={22} unit="°C" delta={2} color="cyan" icon={<Thermometer className="w-3.5 h-3.5" />} description="Feels like 24°C" />
        <KPICard title="Humidity" value={65} unit="%" delta={-5} color="blue" icon={<Droplets className="w-3.5 h-3.5" />} description="Comfortable range" />
        <KPICard title="Wind Speed" value={18} unit="km/h" delta={8} color="violet" icon={<Wind className="w-3.5 h-3.5" />} description="NNE direction" />
        <KPICard title="AQI" value={42} unit="" delta={-3} color="green" icon={<Activity className="w-3.5 h-3.5" />} description="Good air quality" />
        <KPICard title="Pressure" value={1013} unit="hPa" delta={0} color="amber" icon={<Gauge className="w-3.5 h-3.5" />} description="Stable" />
        <KPICard title="Visibility" value={16} unit="km" delta={4} color="cyan" icon={<Eye className="w-3.5 h-3.5" />} description="Excellent" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RainCountdown />
        <ConfidenceGauge />
      </div>

      {/* Forecast chart */}
      <ForecastChart />

      {/* Secondary charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <RainChart />
        <WindChart />
      </div>
    </div>
  )
}
