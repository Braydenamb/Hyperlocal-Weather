'use client';

import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/stores/locationStore';
import HourlyTemperature from '@/components/charts/HourlyTemperature';
import WindTimeline from '@/components/charts/WindTimeline';
import PressureTrends from '@/components/charts/PressureTrends';
import HumidityOverlay from '@/components/charts/HumidityOverlay';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { CalendarDays, Sun, Wind, Compass, Droplets, Info } from 'lucide-react';

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getFormattedDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function ForecastPage() {
  const { dailyForecast, isLoading } = useWeather();
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
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 24 } },
  } as any;

  if (!currentLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="max-w-md glass-panel p-8 shadow-lg bg-white/[0.01] border-white/5 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center mb-5">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide mb-2 uppercase text-center">No Location Selected</h2>
          <p className="text-xs text-white/50 mb-6 leading-relaxed text-center">
            Search for a localized location or query your device GPS inside the navigation header to load detailed multi-variable meteorological forecast trends.
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
          Forecast Analytics Hub
        </h2>
        <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5 select-none">
          High-fidelity chronological timelines of street-level weather metrics
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />
            <div className="h-64 rounded-3xl bg-white/5 animate-pulse" />
          </div>
          <div className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column (2 Grid Lanes): Staggered High Fidelity Charts */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Temp Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-xs font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                  <Sun className="w-4 h-4 text-cyan" />
                  Thermal Curve
                </h3>
              </div>
              <div className="h-[210px]">
                <HourlyTemperature />
              </div>
            </motion.div>

            {/* Wind Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-xs font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  Wind Velocity & Vector
                </h3>
              </div>
              <div className="h-[210px]">
                <WindTimeline />
              </div>
            </motion.div>

            {/* Pressure Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-xs font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  Barometric Pressure Profile
                </h3>
              </div>
              <div className="h-[210px]">
                <PressureTrends />
              </div>
            </motion.div>

            {/* Humidity Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-5 px-1">
                <h3 className="text-xs font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  Dew Point & Saturation Profile
                </h3>
              </div>
              <div className="h-[210px]">
                <HumidityOverlay />
              </div>
            </motion.div>

          </div>

          {/* Right Column (1 Column): Chronological Timeline list */}
          {dailyForecast && (
            <motion.div variants={itemVariants} className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col">
              <div className="flex items-center gap-2 mb-5 px-1 border-b border-white/5 pb-3">
                <CalendarDays className="w-4.5 h-4.5 text-cyan" />
                <h3 className="text-xs font-black text-white/60 tracking-widest uppercase">
                  Extended Horizon Details
                </h3>
              </div>

              <div className="space-y-3.5">
                {dailyForecast.time.slice(0, 7).map((time, i) => {
                  const code = dailyForecast.weatherCode[i];
                  return (
                    <div
                      key={time}
                      className="glass-panel p-3.5 border-white/5 bg-white/[0.01] flex flex-col gap-3 transition-all duration-200 hover:bg-white/[0.02]"
                    >
                      {/* Row 1: Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <WeatherIcon weatherCode={code} isDay={true} size={28} className="flex-shrink-0" />
                          <div>
                            <h4 className="text-xs font-black text-white tracking-wide">
                              {getDayName(time)}
                            </h4>
                            <p className="text-[9px] text-white/30 font-bold uppercase tracking-wider mt-0.5">
                              {getFormattedDate(time)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider">Range</p>
                          <p className="text-xs font-black text-white mt-0.5">
                            {Math.round(dailyForecast.temperatureMax[i])}°C / {Math.round(dailyForecast.temperatureMin[i])}°C
                          </p>
                        </div>
                      </div>

                      {/* Row 2: Secondary stats */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[10px] text-white/40">
                        <div>
                          <span className="font-semibold">UV Max:</span>{' '}
                          <span className="font-bold text-cyan">{dailyForecast.uvIndexMax[i].toFixed(1)}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold">Precip:</span>{' '}
                          <span className="font-bold text-blue-400">
                            {dailyForecast.precipitationProbabilityMax[i]}% ({dailyForecast.precipitationSum[i]}mm)
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

        </div>
      )}
    </motion.div>
  );
}
