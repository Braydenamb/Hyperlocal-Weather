'use client';

import { Sun, Moon, Bell, Zap, Menu } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { motion } from 'framer-motion';
import LocationSelector from '@/components/location/LocationSelector';

interface HeaderProps {
  onMobileMenuToggle?: () => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="glass-header sticky top-0 z-30 h-16 flex items-center px-4 lg:px-6 gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMobileMenuToggle}
        className="md:hidden p-2 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors focus-ring"
        aria-label="Toggle menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Logo (small, visible on mobile) */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="w-7 h-7 rounded-lg brand-gradient-bg flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
      </div>

      {/* Location Selector */}
      <div className="flex-1 flex items-center justify-center md:justify-start max-w-sm">
        <LocationSelector />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1.5">
        {/* Theme toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={toggleTheme}
          className="relative p-2.5 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/5 transition-all duration-200 focus-ring"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          <motion.div
            key={theme}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>

        {/* Notifications */}
        <button
          className="relative p-2.5 rounded-xl text-white/50 hover:text-white/80 hover:bg-white/5 transition-colors focus-ring"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Notification dot */}
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan rounded-full animate-pulse" />
        </button>
      </div>
    </header>
  );
}
