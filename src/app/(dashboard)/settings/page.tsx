'use client';

import { useThemeStore } from '@/stores/themeStore';
import { useLocationStore } from '@/stores/locationStore';
import { Settings, Moon, Sun, Info, Trash2, ShieldCheck, Compass } from 'lucide-react';
import clsx from 'clsx';
import { useState } from 'react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore();
  const { savedLocations, removeSavedLocation } = useLocationStore();
  const [tempUnit, setTempUnit] = useState<'C' | 'F'>('C');
  const [windUnit, setWindUnit] = useState<'kmh' | 'mph' | 'ms'>('kmh');
  const [isPurged, setIsPurged] = useState(false);

  const handleClearCache = () => {
    localStorage.clear();
    setIsPurged(true);
    setTimeout(() => {
      window.location.reload();
    }, 1200);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <Settings className="w-5 h-5 text-cyan" />
          System Settings
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          Configure preferences, unit measurements, and storage pools
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Units & Theme */}
        <div className="space-y-6">
          {/* Unit Settings Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl space-y-5">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-white/5 pb-3">
              Unit Configuration
            </h3>

            {/* Temp toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Temperature Scale</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Display values in Celsius or Fahrenheit</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                <button
                  onClick={() => setTempUnit('C')}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    tempUnit === 'C' ? "bg-cyan text-[#060814] shadow" : "text-white/60 hover:text-white"
                  )}
                >
                  °C
                </button>
                <button
                  onClick={() => setTempUnit('F')}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all",
                    tempUnit === 'F' ? "bg-cyan text-[#060814] shadow" : "text-white/60 hover:text-white"
                  )}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Wind toggle */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Wind Velocity</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Display values in metric or imperial speeds</p>
              </div>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                {['kmh', 'mph', 'ms'].map((unit) => (
                  <button
                    key={unit}
                    onClick={() => setWindUnit(unit as any)}
                    className={clsx(
                      "px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all",
                      windUnit === unit ? "bg-cyan text-[#060814] shadow" : "text-white/60 hover:text-white"
                    )}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interface Appearance Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-white/5 pb-3">
              Appearance & Theme
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Application Theme</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Switch between dark and light dashboards</p>
              </div>
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 border border-white/5 text-xs font-semibold transition-colors focus-ring"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-cyan" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-violet-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column - Saved & Cache */}
        <div className="space-y-6">
          {/* Favorites management */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-white/5 pb-3">
              Favorite Locations ({savedLocations.length})
            </h3>

            {savedLocations.length === 0 ? (
              <p className="text-xs text-white/30 text-center py-4 font-medium">
                No locations saved to favorites pool yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {savedLocations.map((loc) => (
                  <div
                    key={loc.id}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-white/5 bg-white/[0.01]"
                  >
                    <div className="truncate pr-4">
                      <p className="text-xs font-bold text-white truncate">{loc.name}</p>
                      <p className="text-[9px] text-white/40 mt-0.5 truncate">
                        {loc.admin1 ? `${loc.admin1}, ` : ''}{loc.country}
                      </p>
                    </div>
                    <button
                      onClick={() => removeSavedLocation(loc.id)}
                      className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors focus-ring"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Database & Diagnostics Card */}
          <div className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl space-y-4">
            <h3 className="text-sm font-bold text-white tracking-wider uppercase border-b border-white/5 pb-3">
              Diagnostics & Storage
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white">Purge Local Pools</h4>
                <p className="text-[10px] text-white/40 mt-0.5">Reset stored favorites, recents, and theme cookies</p>
              </div>
              <button
                onClick={handleClearCache}
                className="px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/15 text-xs font-bold transition-all focus-ring"
              >
                {isPurged ? 'Purging pools...' : 'Purge All Data'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info banner */}
      <div className="glass-panel p-5 rounded-3xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="flex gap-4 items-start">
          <div className="p-3 bg-cyan/10 rounded-2xl text-cyan flex-shrink-0 mt-0.5">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white">HyperWeather Local Server v1.0.0</h4>
            <p className="text-xs text-white/50 leading-relaxed mt-1.5">
              Production configuration compiled on Next.js 16 frameworks. Blended geocoding matrices run under free non-commercial Open-Meteo licenses.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
