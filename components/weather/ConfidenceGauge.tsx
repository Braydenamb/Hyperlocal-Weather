'use client'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

export function ConfidenceGauge() {
  const confidence = 87

  return (
    <GlassCard className="p-4" glow="violet">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-violet-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Forecast Confidence</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16">
          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <motion.circle
              cx="32" cy="32" r="26"
              fill="none"
              stroke="url(#violetGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 26}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - confidence / 100) }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="violetGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white">{confidence}%</span>
          </div>
        </div>
        <div>
          <div className="text-lg font-bold text-violet-400">High</div>
          <div className="text-xs text-slate-400 leading-tight">Model agreement<br />is excellent</div>
        </div>
      </div>
    </GlassCard>
  )
}
