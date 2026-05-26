'use client';

import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/stores/locationStore';
import { BarChart3, TrendingUp, Info, Sun, Zap, Award, CheckCircle } from 'lucide-react';
import HourlyTemperature from '@/components/charts/HourlyTemperature';
import WeatherHeatmap from '@/components/charts/WeatherHeatmap';

export default function AnalyticsPage() {
  const { isLoading } = useWeather();
  const currentLocation = useLocationStore((s) => s.currentLocation);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 220, 
        damping: 24 
      } 
    },
  } as any;

  if (!currentLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="max-w-md glass-panel p-8 shadow-lg bg-white/[0.01] border-white/5 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center mb-5">
            <BarChart3 className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide mb-2 uppercase text-center">No Location Selected</h2>
          <p className="text-xs text-white/50 mb-6 leading-relaxed text-center">
            Query your device GPS or select a geocoding coordinate in the navigation header to unlock hyperlocal climate micro-analytics and historic variations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Title */}
      <div className="px-1">
        <h2 className="text-xl font-extrabold text-white tracking-tight uppercase select-none">
          Climate Analytics
        </h2>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5 select-none">
          Deep-level breakdowns of hyperlocal atmospheric variations
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Key Stat Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Stat 1 */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex items-center gap-4 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/35 uppercase tracking-wider">
                  Baseline Anomaly
                </p>
                <h4 className="text-lg font-black text-white mt-1">
                  +1.2°C Thermal Shift
                </h4>
                <p className="text-[10px] text-emerald-400 font-bold mt-0.5">
                  Warm Anomaly Registered
                </p>
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex items-center gap-4 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/35 uppercase tracking-wider">
                  Atmospheric Variance
                </p>
                <h4 className="text-lg font-black text-white mt-1">
                  Index level 2 (Stable)
                </h4>
                <p className="text-[10px] text-white/35 font-bold mt-0.5">
                  Muted isobaric gradients
                </p>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex items-center gap-4 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[9px] font-black text-white/35 uppercase tracking-wider">
                  Solar Radiance Index
                </p>
                <h4 className="text-lg font-black text-white mt-1">
                  4.8 kWh / m² yield
                </h4>
                <p className="text-[10px] text-cyan font-bold mt-0.5">
                  High solar capture rate
                </p>
              </div>
            </motion.div>
          </div>

          {/* Core Analytics charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col">
              <h3 className="text-xs font-black text-white/60 tracking-widest uppercase mb-5 px-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan" />
                Diurnal Temperature Profile
              </h3>
              <div className="flex-1 w-full min-h-[240px]">
                <HourlyTemperature />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col justify-between">
              <h3 className="text-xs font-black text-white/60 tracking-widest uppercase mb-5 px-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-purple-400" />
                Hyperlocal Climate Heatmap
              </h3>
              <div className="flex-1 w-full flex items-center justify-center py-2 min-h-[240px]">
                <WeatherHeatmap />
              </div>
            </motion.div>
          </div>

          {/* Technical Info Capsule */}
          <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-cyan/10 rounded-xl text-cyan flex-shrink-0 mt-0.5">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs text-white uppercase tracking-wider">Meteorological Blending Mechanics</h4>
                <p className="text-[11px] text-white/45 leading-relaxed mt-1.5 max-w-2xl">
                  HyperWeather blended grids derive localized microclimate values by compiling Open-Meteo spatial matrices, layering terrain elevation constants, and dynamically weighing real-time community report flags. This generates high-fidelity meteorological street intelligence.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
