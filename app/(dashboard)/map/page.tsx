'use client'
import dynamic from 'next/dynamic'
import { Map } from 'lucide-react'

const WeatherMap = dynamic(() => import('@/components/map/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-white/[0.04] rounded-2xl border border-white/[0.06]">
      <div className="text-slate-400 text-sm">Loading map...</div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <div className="p-4 h-screen flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Map className="w-5 h-5 text-cyan-400" />
        <h1 className="text-xl font-bold text-white">Live Weather Map</h1>
      </div>
      <div className="flex-1 min-h-0">
        <WeatherMap />
      </div>
    </div>
  )
}
