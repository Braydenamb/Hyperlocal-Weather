'use client'
import { Settings, Globe, Bell, Database, Palette } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

export default function SettingsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <Settings className="w-5 h-5 text-slate-400" />
        <h1 className="text-xl font-bold text-white">Settings</h1>
      </div>

      <div className="space-y-3">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Palette className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-slate-200">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-300">Theme</div>
              <div className="text-xs text-slate-500">Toggle between dark and light mode</div>
            </div>
            <ThemeToggle />
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-4 h-4 text-blue-400" />
            <h2 className="text-sm font-semibold text-slate-200">Units & Locale</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Temperature', options: ['Celsius (°C)', 'Fahrenheit (°F)'] },
              { label: 'Wind Speed', options: ['km/h', 'mph', 'm/s'] },
              { label: 'Pressure', options: ['hPa', 'inHg', 'mmHg'] },
            ].map(({ label, options }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="text-sm text-slate-300">{label}</div>
                <select className="bg-white/[0.06] border border-white/[0.08] rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50">
                  {options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-slate-200">Notifications</h2>
          </div>
          <div className="space-y-3">
            {[
              { label: 'Severe Weather Alerts', enabled: true },
              { label: 'Daily Forecast Summary', enabled: true },
              { label: 'Rain in Next Hour', enabled: false },
              { label: 'UV Index High', enabled: true },
            ].map(({ label, enabled }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="text-sm text-slate-300">{label}</div>
                <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-cyan-500/40' : 'bg-white/[0.1]'}`}>
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${enabled ? 'right-0.5 bg-cyan-400' : 'left-0.5 bg-slate-500'}`} />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Database className="w-4 h-4 text-green-400" />
            <h2 className="text-sm font-semibold text-slate-200">Data & Cache</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Cache Size</span><span className="text-white">2.4 MB</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Last Sync</span><span className="text-white">2 min ago</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>API Calls (today)</span><span className="text-white">147</span>
            </div>
          </div>
          <button className="mt-3 w-full py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs hover:bg-red-500/20 transition-colors">
            Clear Cache
          </button>
        </GlassCard>
      </div>
    </div>
  )
}
