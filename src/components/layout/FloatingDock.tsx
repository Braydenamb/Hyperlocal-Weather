'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Radar,
  CalendarDays,
  BarChart3,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Map', href: '/map', icon: Map },
  { label: 'Radar', href: '/radar', icon: Radar },
  { label: 'Forecast', href: '/forecast', icon: CalendarDays },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function FloatingDock() {
  const pathname = usePathname();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <aside className="hidden md:flex flex-col items-center justify-between h-[calc(100vh-32px)] w-20 fixed left-4 top-4 z-40 glass-panel py-6 px-2 shadow-lg">
      {/* Brand Icon */}
      <div className="relative group">
        <Link href="/overview" className="flex-shrink-0 w-12 h-12 rounded-2xl brand-gradient-bg flex items-center justify-center shadow-lg relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]">
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <svg className="w-6 h-6 text-white relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </Link>
      </div>

      {/* Nav Items Group */}
      <nav className="flex flex-col gap-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onMouseEnter={() => setHoveredItem(item.href)}
              onMouseLeave={() => setHoveredItem(null)}
              className="relative flex items-center justify-center w-12 h-12 rounded-xl group transition-all focus-ring"
            >
              {/* Active Indicator Layer */}
              {isActive && (
                <motion.div
                  layoutId="active-nav-bg"
                  className="absolute inset-0 rounded-xl bg-cyan/10 border border-cyan/15 shadow-[0_0_12px_rgba(6,182,212,0.1)]"
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                />
              )}

              {/* Hover Indicator Layer */}
              <AnimatePresence>
                {hoveredItem === item.href && !isActive && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 rounded-xl bg-white/[0.03] border border-white/5"
                    transition={{ duration: 0.15 }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <Icon
                className={clsx(
                  'w-5.5 h-5.5 relative z-10 transition-transform duration-200 group-hover:scale-110',
                  isActive ? 'text-cyan' : 'text-white/40 group-hover:text-white/80'
                )}
              />

              {/* Tooltip */}
              <AnimatePresence>
                {hoveredItem === item.href && (
                  <motion.div
                    initial={{ opacity: 0, x: -10, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute left-full ml-4 px-3 py-1.5 glass-panel text-[11px] font-bold text-white whitespace-nowrap shadow-xl z-50 pointer-events-none tracking-wide"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile Anchor / Indicator */}
      <div className="relative group">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:border-white/20">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-[10px] font-black text-white">
            HW
          </div>
        </div>
      </div>
    </aside>
  );
}
