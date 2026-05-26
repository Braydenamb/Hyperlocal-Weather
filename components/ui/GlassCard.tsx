'use client'
import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: 'cyan' | 'blue' | 'violet' | 'green' | 'amber' | 'red' | 'none'
  onClick?: () => void
}

export function GlassCard({ children, className, glow = 'none', onClick }: GlassCardProps) {
  const glowStyles = {
    cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.12)] border-cyan-500/20',
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.12)] border-blue-500/20',
    violet: 'shadow-[0_0_20px_rgba(139,92,246,0.12)] border-violet-500/20',
    green: 'shadow-[0_0_20px_rgba(34,197,94,0.12)] border-green-500/20',
    amber: 'shadow-[0_0_20px_rgba(245,158,11,0.12)] border-amber-500/20',
    red: 'shadow-[0_0_20px_rgba(239,68,68,0.12)] border-red-500/20',
    none: 'border-white/[0.06]',
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border bg-white/[0.04] backdrop-blur-md',
        glowStyles[glow],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
