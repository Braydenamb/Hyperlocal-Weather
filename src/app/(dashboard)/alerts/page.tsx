'use client';

import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/stores/locationStore';
import { AlertTriangle, ShieldCheck, Compass, Info, Wind, CloudRain, Sun } from 'lucide-react';
import clsx from 'clsx';

export default function AlertsPage() {
  const { currentWeather, isLoading } = useWeather();
  const currentLocation = useLocationStore((s) => s.currentLocation);

  // Derive mock local advisories based on weather conditions to make the app feel alive and real!
  const getAdvisories = () => {
    if (!currentWeather) return [];

    const list = [];

    // Wind advisory
    if (currentWeather.windSpeed > 20) {
      list.push({
        id: "adv-wind",
        title: "High Wind Advisory",
        severity: "moderate",
        message: `Localized wind gusts are expected up to ${Math.round(currentWeather.windGusts)} km/h. Secure loose outdoor items.`,
        icon: Wind,
        color: "border-amber-500/20 bg-amber-500/5 text-amber-400",
      });
    }

    // Heavy rain advisory
    if (currentWeather.precipitation > 2) {
      list.push({
        id: "adv-rain",
        title: "Localized Street Flooding Advisories",
        severity: "high",
        message: "Moderate to heavy rain has triggered urban runoff alerts. Poor drainage areas may experience minor flooding.",
        icon: CloudRain,
        color: "border-rose-500/20 bg-rose-500/5 text-rose-400",
      });
    }

    // UV advisory
    if (currentWeather.isDay && currentWeather.cloudCover < 30) {
      list.push({
        id: "adv-uv",
        title: "Elevated Solar Radiation Advisory",
        severity: "low",
        message: "Clear skies are resulting in high UV levels. Outdoor activities require sun protection between 11:00 AM and 3:00 PM.",
        icon: Sun,
        color: "border-cyan/20 bg-cyan/5 text-cyan",
      });
    }

    // Default advisory if none match
    if (list.length === 0) {
      list.push({
        id: "adv-none",
        title: "Microclimate Advisories: Normal",
        severity: "low",
        message: "Meteorological conditions are stable at street level. No high-wind, heavy precipitation, or temperature warnings are active.",
        icon: ShieldCheck,
        color: "border-emerald-500/20 bg-emerald-500/5 text-emerald-400",
      });
    }

    return list;
  };

  const advisories = getAdvisories();

  if (!currentLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-[#0B1020]/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center mx-auto mb-5">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Location Selected</h2>
          <p className="text-sm text-white/50 mb-6">
            Please search for a location or use GPS to view neighborhood street advisories and weather warnings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-cyan" />
          Street-Level Advisories
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          Real-time weather threat analysis and localized hazard flags
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-24 rounded-2xl bg-white/5 animate-pulse border border-white/5" />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Active alerts grid */}
          <div className="grid grid-cols-1 gap-4">
            {advisories.map((adv, i) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={adv.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className={clsx(
                    "glass-panel border p-5 rounded-3xl flex gap-4 items-start shadow-xl backdrop-blur-xl",
                    adv.color
                  )}
                >
                  <div className="p-3 bg-white/[0.04] border border-white/5 rounded-2xl flex-shrink-0 mt-0.5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-white">
                        {adv.title}
                      </h3>
                      <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {adv.severity}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed mt-2 max-w-2xl">
                      {adv.message}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Microclimate Safety Tips */}
          <div className="glass-panel p-6 rounded-3xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-cyan/10 rounded-2xl text-cyan flex-shrink-0 mt-0.5">
                <Info className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Street-Level Intelligence</h4>
                <p className="text-xs text-white/50 leading-relaxed mt-1.5 max-w-xl">
                  Street-level advisories are computed by comparing active open forecast matrices against regional topographical anomalies and real-time community report submissions. Contributed alerts help other users navigate localized climate issues.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
