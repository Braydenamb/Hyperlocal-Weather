'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Bell, Layers, Clock } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { useWeatherStore } from '@/stores/weatherStore'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

const savedLocations = [
  { name: 'New York', temp: '22°C', condition: '⛅' },
  { name: 'Los Angeles', temp: '28°C', condition: '☀️' },
  { name: 'Chicago', temp: '15°C', condition: '🌧️' },
  { name: 'Miami', temp: '31°C', condition: '☀️' },
]

export function RightPanel() {
  const { rightPanelOpen, toggleRightPanel } = useUIStore()
  const { location } = useWeatherStore()

  return (
    <AnimatePresence>
      {rightPanelOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="flex flex-col h-full bg-white/[0.03] border-l border-white/[0.06] overflow-hidden flex-shrink-0"
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/[0.06]">
            <span className="text-sm font-semibold text-slate-200">Panel</span>
            <button
              onClick={toggleRightPanel}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-3 space-y-3">
            {/* Current Location */}
            <GlassCard className="p-3" glow="cyan">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Location</span>
              </div>
              <div className="text-sm text-white font-medium">{location?.name ?? 'Unknown'}</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {location?.lat.toFixed(4)}°, {location?.lon.toFixed(4)}°
              </div>
            </GlassCard>

            {/* Saved Locations */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Saved Places</span>
              </div>
              <div className="space-y-1.5">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.name}
                    className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{loc.condition}</span>
                      <span className="text-sm text-slate-300">{loc.name}</span>
                    </div>
                    <span className="text-sm font-medium text-white">{loc.temp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Layers */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Layers className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Map Layers</span>
              </div>
              <div className="space-y-1.5">
                {['Radar', 'Temperature', 'Wind', 'Precipitation', 'Clouds'].map((layer) => (
                  <div key={layer} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.04]">
                    <span className="text-sm text-slate-300">{layer}</span>
                    <div className="w-8 h-4 rounded-full bg-cyan-500/30 relative cursor-pointer">
                      <div className="absolute right-0.5 top-0.5 w-3 h-3 rounded-full bg-cyan-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            <GlassCard className="p-3" glow="violet">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="w-4 h-4 text-violet-400" />
                <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Alerts</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-amber-300">Wind Advisory</div>
                    <div className="text-[11px] text-slate-400">Gusts up to 45 mph expected</div>
                  </div>
                </div>
                <div className="flex items-start gap-2 p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-medium text-blue-300">Rain Tonight</div>
                    <div className="text-[11px] text-slate-400">60% chance after 8 PM</div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Time Range */}
            <div>
              <div className="flex items-center gap-2 mb-2 px-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Forecast Range</span>
              </div>
              <div className="flex gap-1.5">
                {['24h', '48h', '7d', '14d'].map((range) => (
                  <button
                    key={range}
                    className={cn(
                      'flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors',
                      range === '24h'
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08]'
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
