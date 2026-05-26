import { ForecastChart } from '@/components/charts/ForecastChart'
import { RainChart } from '@/components/charts/RainChart'
import { WindChart } from '@/components/charts/WindChart'
import { HumidityChart } from '@/components/charts/HumidityChart'
import { PressureChart } from '@/components/charts/PressureChart'
import { LineChart } from 'lucide-react'

export default function ForecastPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <LineChart className="w-5 h-5 text-blue-400" />
        <h1 className="text-xl font-bold text-white">Detailed Forecast</h1>
      </div>
      <ForecastChart />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RainChart />
        <WindChart />
        <HumidityChart />
        <PressureChart />
      </div>
    </div>
  )
}
