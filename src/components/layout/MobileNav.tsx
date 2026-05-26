'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  CalendarDays,
  AlertTriangle,
  Settings,
} from 'lucide-react';
import clsx from 'clsx';

const tabs = [
  { label: 'Overview', href: '/overview', icon: LayoutDashboard },
  { label: 'Map', href: '/map', icon: Map },
  { label: 'Forecast', href: '/forecast', icon: CalendarDays },
  { label: 'Alerts', href: '/alerts', icon: AlertTriangle },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-header border-t border-white/6 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname.startsWith(tab.href + '/');
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={clsx(
                'flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 min-w-[56px]',
                isActive
                  ? 'nav-active-mobile text-cyan'
                  : 'text-white/40'
              )}
            >
              <Icon className={clsx('w-5 h-5', isActive && 'text-cyan')} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
