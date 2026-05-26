'use client';

import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/stores/locationStore';
import { BarChart3, TrendingUp, Info, Sun, Zap, Award, CheckCircle } from 'lucide-react';
import HourlyTemperature from '@/components/charts/HourlyTemperature';
import WeatherHeatmap from '@/components/charts/WeatherHeatmap';

export default function AnalyticsPage() {
  const { currentWeather, dailyForecast, isLoading } = useWeather();
  const currentLocation = useLocationStore((s) => s.currentLocation);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: 'spring', 
        stiffness: 180, 
        damping: 20 
      } 
    },
  } as any;

  if (!currentLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-[#0B1020]/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center mx-auto mb-5">
            <BarChart3 className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Location Selected</h2>
          <p className="text-sm text-white/50 mb-6">
            Please search for a location or use GPS to unlock weather analytics and historic comparisons.
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
      className="space-y-6"
    >
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-cyan" />
          Climate Analytics Dashboard
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          Detailed breakdown of hyperlocal meteorological dynamics
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key Stat Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Stat 1 */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 rounded-3xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex items-center gap-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan/15 border border-cyan/30 text-cyan flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(6,182,212,0.15)]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Deviation from normal
                </p>
                <h4 className="text-xl font-black text-white mt-1">
                  +1.2°C High
                </h4>
                <p className="text-xs text-emerald-400 font-semibold mt-0.5 flex items-center gap-1">
                  Warm Anomaly Active
                </p>
              </div>
            </motion.div>

            {/* Stat 2 */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 rounded-3xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex items-center gap-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-violet-500/15 border border-violet-500/30 text-violet-400 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Extreme Index
                </p>
                <h4 className="text-xl font-black text-white mt-1">
                  Level 2 / Low
                </h4>
                <p className="text-xs text-white/40 mt-0.5">
                  Stable pressure gradients
                </p>
              </div>
            </motion.div>

            {/* Stat 3 */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 rounded-3xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex items-center gap-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Sun className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
                  Solar Energy Capture
                </p>
                <h4 className="text-xl font-black text-white mt-1">
                  4.8 kWh/m²
                </h4>
                <p className="text-xs text-cyan font-semibold mt-0.5">
                  Excellent solar yield today
                </p>
              </div>
            </motion.div>
          </div>

          {/* Core Analytics charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 px-1 flex items-center gap-2">
                <Award className="w-4 h-4 text-cyan" />
                Diurnal Temperature Profile
              </h3>
              <div className="flex-1 w-full min-h-[250px]">
                <HourlyTemperature />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col justify-between">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-4 px-1 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-violet-400" />
                Hyperlocal Microclimate Heatmap
              </h3>
              <div className="flex-1 w-full flex items-center justify-center py-2">
                <WeatherHeatmap />
              </div>
            </motion.div>
          </div>

          {/* Microclimate Interpolation description */}
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-3xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col md:flex-row items-center gap-4 justify-between">
            <div className="flex gap-4 items-start">
              <div className="p-3 bg-cyan/10 rounded-2xl text-cyan flex-shrink-0 mt-0.5">
                <Info className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">How does street-level weather intelligence work?</h4>
                <p className="text-xs text-white/50 leading-relaxed mt-1.5 max-w-xl">
                  HyperWeather calculates street-by-street microclimate estimates using Open-Meteo API data combined with nearby station weight blending, topographic height corrections, and real-time community report inputs. This provides high-fidelity, neighborhood-level weather estimations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
