'use client'
import dynamic from 'next/dynamic'
import { Radio } from 'lucide-react'

const WeatherMap = dynamic(() => import('@/components/map/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-white/[0.04] rounded-2xl border border-white/[0.06]">
      <div className="text-slate-400 text-sm">Loading radar...</div>
    </div>
  ),
})

export default function RadarPage() {
  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-bold text-white">Radar View</h1>
        </div>
        <div className="flex items-center gap-2">
          {['Rain', 'Snow', 'Mixed', 'Storm'].map((type) => (
            <div key={type} className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
              <div className={`w-2 h-2 rounded-full ${type === 'Rain' ? 'bg-cyan-400' : type === 'Snow' ? 'bg-blue-200' : type === 'Mixed' ? 'bg-violet-400' : 'bg-red-400'}`} />
              <span className="text-xs text-slate-400">{type}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <WeatherMap />
      </div>
    </div>
  )
}
