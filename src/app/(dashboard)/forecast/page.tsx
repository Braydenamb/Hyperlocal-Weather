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
  const { dailyForecast, isLoading, error } = useWeather();
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
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
  } as any;

  if (!currentLocation) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-[#0B1020]/60 backdrop-blur-xl">
          <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center mx-auto mb-5">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">No Location Selected</h2>
          <p className="text-sm text-white/50 mb-6">
            Please search for a location or use GPS in the header to view detailed forecast trends.
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
        <h1 className="text-2xl font-bold text-white tracking-wide">
          Forecast Analytics Hub
        </h1>
        <p className="text-xs text-white/40 mt-0.5">
          Multi-variable charts showing high-fidelity weather metrics
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
        </div>
      ) : (
        <>
          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Temp Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <Sun className="w-4 h-4 text-cyan" />
                  Hourly Temperature Trend
                </h3>
              </div>
              <div className="h-[210px]">
                <HourlyTemperature />
              </div>
            </motion.div>

            {/* Wind Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-400" />
                  Wind Velocity & Direction
                </h3>
              </div>
              <div className="h-[210px]">
                <WindTimeline />
              </div>
            </motion.div>

            {/* Pressure Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-400" />
                  Barometric Pressure Profile
                </h3>
              </div>
              <div className="h-[210px]">
                <PressureTrends />
              </div>
            </motion.div>

            {/* Humidity Chart */}
            <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 px-1">
                <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  Humidity & Dew Point Profile
                </h3>
              </div>
              <div className="h-[210px]">
                <HumidityOverlay />
              </div>
            </motion.div>
          </div>

          {/* Daily list detailed */}
          {dailyForecast && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h2 className="text-lg font-bold text-white tracking-wide flex items-center gap-2 px-1">
                <CalendarDays className="w-5 h-5 text-cyan" />
                Extended Daily Details
              </h2>
              <div className="space-y-3">
                {dailyForecast.time.slice(0, 7).map((time, i) => {
                  const code = dailyForecast.weatherCode[i];
                  return (
                    <div
                      key={time}
                      className="glass-panel p-4 rounded-2xl border border-white/8 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-200 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <WeatherIcon weatherCode={code} isDay={true} size={48} className="flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-white">
                            {getDayName(time)}
                          </h4>
                          <p className="text-xs text-white/40 mt-0.5">
                            {getFormattedDate(time)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-8 justify-between w-full sm:w-auto text-sm">
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-white/30 font-medium">Temperature</p>
                          <p className="font-bold text-white mt-0.5">
                            {Math.round(dailyForecast.temperatureMax[i])}°C / {Math.round(dailyForecast.temperatureMin[i])}°C
                          </p>
                        </div>

                        <div className="text-center sm:text-left">
                          <p className="text-xs text-white/30 font-medium">UV Index</p>
                          <p className="font-bold text-cyan mt-0.5">
                            {dailyForecast.uvIndexMax[i].toFixed(1)}
                          </p>
                        </div>

                        <div className="text-center sm:text-right">
                          <p className="text-xs text-white/30 font-medium">Precipitation</p>
                          <p className="font-bold text-blue-400 mt-0.5">
                            {dailyForecast.precipitationProbabilityMax[i]}% ({dailyForecast.precipitationSum[i]}mm)
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}
