'use client';

import { Sun, Moon, Navigation, AlertCircle } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useWeatherStore } from '@/stores/weatherStore';
import { useLocationStore } from '@/stores/locationStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { motion, AnimatePresence } from 'framer-motion';
import LocationSelector from '@/components/location/LocationSelector';
import WeatherIcon from '@/components/weather/WeatherIcon';
import type { Location } from '@/types';
import { useEffect } from 'react';
import clsx from 'clsx';

export default function FloatingHeader() {
  const { theme, toggleTheme } = useThemeStore();
  const { currentWeather, isLoading } = useWeatherStore();
  const { currentLocation, setCurrentLocation } = useLocationStore();
  const { getCurrentPosition, position, isLoading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (position) {
      const geoLocation: Location = {
        id: `geo-${position.latitude}-${position.longitude}`,
        name: 'Current Location',
        country: '',
        latitude: position.latitude,
        longitude: position.longitude,
      };
      setCurrentLocation(geoLocation);
    }
  }, [position, setCurrentLocation]);

  return (
    <header className="sticky top-4 z-30 w-full px-4 md:px-6">
      <div className="glass-panel w-full h-16 flex items-center justify-between px-4 lg:px-6 gap-4 shadow-md bg-white/[0.01] border-white/5">
        
        {/* Left Side: Branding & Pulse */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs font-black uppercase tracking-widest text-white/50">
              Station
            </span>
            <div className="relative flex items-center justify-center h-4 w-4">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan/30 opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan shadow-[0_0_8px_var(--primary)]" />
            </div>
          </div>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <h1 className="text-sm font-black tracking-wider uppercase brand-gradient hidden md:block select-none">
            HyperWeather
          </h1>
        </div>

        {/* Center: Location Selection Capsule */}
        <div className="flex-1 max-w-xs sm:max-w-sm flex items-center gap-1.5">
          <LocationSelector />
          <button
            onClick={() => getCurrentPosition()}
            disabled={geoLoading}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50 hover:text-cyan hover:bg-cyan/10 hover:border-cyan/20 transition-all duration-200 focus-ring flex-shrink-0"
            title="Locate via GPS"
          >
            <Navigation className={clsx("w-4 h-4", geoLoading && "animate-spin text-cyan")} />
          </button>
        </div>

        {/* Right Side: Snapshot Capsule & Controls */}
        <div className="flex items-center gap-2">
          {/* Real-time Temperature Snapshot */}
          <AnimatePresence mode="wait">
            {currentLocation && currentWeather && !isLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 shadow-sm"
              >
                <WeatherIcon
                  weatherCode={currentWeather.weatherCode}
                  isDay={currentWeather.isDay}
                  size={20}
                  className="flex-shrink-0"
                />
                <span className="text-xs font-bold text-white tracking-tight">
                  {Math.round(currentWeather.temperature)}°C
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Theme switcher */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-200 focus-ring"
            aria-label="Toggle visual theme"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={theme}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-center"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-cyan" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-400" />
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>
        </div>

      </div>
    </header>
  );
}
