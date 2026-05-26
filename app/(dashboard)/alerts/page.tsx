import { GlassCard } from '@/components/ui/GlassCard'
import { AlertTriangle, Wind, CloudRain, Thermometer, Eye } from 'lucide-react'

const alerts = [
  {
    id: '1',
    type: 'wind',
    severity: 'medium',
    title: 'Wind Advisory',
    description: 'Sustained winds 25-35 mph with gusts up to 50 mph. Travel may be difficult especially for high profile vehicles.',
    startsAt: '2024-01-15T18:00:00',
    endsAt: '2024-01-16T06:00:00',
    icon: Wind,
    color: 'amber',
  },
  {
    id: '2',
    type: 'rain',
    severity: 'low',
    title: 'Rain Expected Tonight',
    description: 'Light to moderate rain expected. Total accumulation 0.5-1 inch possible.',
    startsAt: '2024-01-15T20:00:00',
    endsAt: '2024-01-16T08:00:00',
    icon: CloudRain,
    color: 'blue',
  },
  {
    id: '3',
    type: 'heat',
    severity: 'high',
    title: 'Heat Advisory',
    description: 'High temperatures expected 95-100°F. Heat index values up to 105°F.',
    startsAt: '2024-01-16T10:00:00',
    endsAt: '2024-01-16T20:00:00',
    icon: Thermometer,
    color: 'red',
  },
]

const severityColors: Record<string, string> = {
  low: 'border-blue-500/30 bg-blue-500/10',
  medium: 'border-amber-500/30 bg-amber-500/10',
  high: 'border-red-500/30 bg-red-500/10',
  extreme: 'border-red-600/40 bg-red-600/15',
}

const severityBadge: Record<string, string> = {
  low: 'bg-blue-500/20 text-blue-400',
  medium: 'bg-amber-500/20 text-amber-400',
  high: 'bg-red-500/20 text-red-400',
  extreme: 'bg-red-600/30 text-red-300',
}

export default function AlertsPage() {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-2 pt-2">
        <AlertTriangle className="w-5 h-5 text-amber-400" />
        <h1 className="text-xl font-bold text-white">Weather Alerts</h1>
        <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">{alerts.length} Active</span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = alert.icon
          return (
            <div key={alert.id} className={`rounded-2xl border p-4 ${severityColors[alert.severity]}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white/[0.06]`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white text-sm">{alert.title}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider ${severityBadge[alert.severity]}`}>
                      {alert.severity}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{alert.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-[11px] text-slate-500">
                    <span>From: {new Date(alert.startsAt).toLocaleString()}</span>
                    <span>Until: {new Date(alert.endsAt).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <GlassCard className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Alert History (7 days)</span>
        </div>
        <div className="space-y-2">
          {['Frost Warning - Jan 12', 'Dense Fog Advisory - Jan 11', 'High Wind Watch - Jan 10'].map((item) => (
            <div key={item} className="flex items-center gap-2 py-2 border-b border-white/[0.04] last:border-0">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span className="text-xs text-slate-500">{item}</span>
              <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-white/[0.04] text-slate-500">Expired</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
