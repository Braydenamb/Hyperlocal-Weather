'use client'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Map, Radio, LineChart, Wind,
  BarChart3, AlertTriangle, Settings, ChevronLeft,
  ChevronRight, CloudRain, Zap
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/overview' },
  { icon: Map, label: 'Live Map', href: '/map' },
  { icon: Radio, label: 'Radar', href: '/radar' },
  { icon: LineChart, label: 'Forecast', href: '/forecast' },
  { icon: BarChart3, label: 'Analytics', href: '/analytics' },
  { icon: AlertTriangle, label: 'Alerts', href: '/alerts' },
  { icon: Settings, label: 'Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <motion.aside
      animate={{ width: sidebarCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="flex flex-col h-full bg-white/[0.03] border-r border-white/[0.06] overflow-hidden relative z-10 flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/[0.06]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-bold text-white text-sm leading-tight">HyperWeather</div>
              <div className="text-[10px] text-cyan-400 font-medium tracking-widest uppercase">Intelligence</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto scrollbar-thin">
        {navItems.map(({ icon: Icon, label, href }) => {
          const isActive = pathname === href || (href !== '/overview' && pathname.startsWith(href))
          return (
            <motion.button
              key={href}
              onClick={() => router.push(href)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                isActive
                  ? 'bg-cyan-500/15 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={cn('w-5 h-5 flex-shrink-0 relative z-10', isActive ? 'text-cyan-400' : '')} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium relative z-10 whitespace-nowrap"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </nav>

      {/* Bottom: weather indicator */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className={cn(
          'flex items-center gap-3 px-2 py-2 rounded-xl bg-white/[0.03]',
          sidebarCollapsed && 'justify-center'
        )}>
          <div className="relative flex-shrink-0">
            <CloudRain className="w-5 h-5 text-blue-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-400 rounded-full" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="min-w-0"
              >
                <div className="text-xs text-slate-300 font-medium truncate">Live Data</div>
                <div className="text-[10px] text-green-400">Connected</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700 border border-white/10 flex items-center justify-center hover:bg-slate-600 transition-colors z-20"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 text-slate-300" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-slate-300" />
        )}
      </button>
    </motion.aside>
  )
}
