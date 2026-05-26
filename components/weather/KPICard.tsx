'use client'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { GlassCard } from '@/components/ui/GlassCard'
import { cn } from '@/lib/utils'

interface KPICardProps {
  title: string
  value: number
  unit: string
  delta?: number
  sparklineData?: number[]
  color?: 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red'
  icon?: React.ReactNode
  description?: string
}

const colorMap = {
  cyan: { stroke: '#06B6D4', fill: 'rgba(6,182,212,0.1)', text: 'text-cyan-400' },
  blue: { stroke: '#3B82F6', fill: 'rgba(59,130,246,0.1)', text: 'text-blue-400' },
  violet: { stroke: '#8B5CF6', fill: 'rgba(139,92,246,0.1)', text: 'text-violet-400' },
  green: { stroke: '#22C55E', fill: 'rgba(34,197,94,0.1)', text: 'text-green-400' },
  amber: { stroke: '#F59E0B', fill: 'rgba(245,158,11,0.1)', text: 'text-amber-400' },
  red: { stroke: '#EF4444', fill: 'rgba(239,68,68,0.1)', text: 'text-red-400' },
}

export function KPICard({ title, value, unit, delta, sparklineData, color = 'cyan', icon, description }: KPICardProps) {
  const colors = colorMap[color]
  const chartData = (sparklineData ?? Array.from({ length: 10 }, () => Math.random() * value * 0.4 + value * 0.8)).map(v => ({ v }))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      <GlassCard glow={color} className="p-4 h-full">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              {icon && <div className={colors.text}>{icon}</div>}
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</span>
            </div>
            <div className="flex items-end gap-1">
              <span className={cn('text-3xl font-bold text-white')}>
                {Math.round(value)}
              </span>
              <span className="text-sm text-slate-400 mb-1">{unit}</span>
            </div>
            {description && <div className="text-xs text-slate-500 mt-0.5">{description}</div>}
          </div>

          {delta !== undefined && (
            <div className={cn('flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded-lg', delta >= 0 ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400')}>
              {delta >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(delta)}%
            </div>
          )}
        </div>

        {/* Sparkline */}
        <div className="h-12 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.stroke} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={colors.stroke} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={colors.stroke}
                strokeWidth={1.5}
                fill={`url(#grad-${color})`}
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>
    </motion.div>
  )
}
