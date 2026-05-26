'use client';

import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import { useLocationStore } from '@/stores/locationStore';
import HeroWeather from '@/components/weather/HeroWeather';
import KPIGrid from '@/components/weather/KPIGrid';
import HourlyTemperature from '@/components/charts/HourlyTemperature';
import RainForecast from '@/components/charts/RainForecast';
import RadialGauge from '@/components/charts/RadialGauge';
import WeatherIcon from '@/components/weather/WeatherIcon';
import { CalendarDays, CloudRain, Sun, Compass, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

// Day of week formatter
const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Weather description helper for 7-day cards
const getWeatherDesc = (code: number) => {
  const map: Record<number, string> = {
    0: 'Clear', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
    61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
    80: 'Rain Showers', 81: 'Showers', 82: 'Violent Showers',
    95: 'Thunderstorm', 96: 'Storm w/ Hail', 99: 'Severe Storm',
  };
  return map[code] ?? 'Weather';
};

export default function OverviewPage() {
  const { currentWeather, dailyForecast, airQuality, isLoading, error } = useWeather();
  const currentLocation = useLocationStore((s) => s.currentLocation);

  const handleRefresh = () => {
    if (currentLocation) {
      useLocationStore.getState().setCurrentLocation({ ...currentLocation });
    }
  };

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
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 180, damping: 20 }}
          className="max-w-md glass-panel p-8 rounded-3xl border border-white/10 shadow-2xl bg-[#0B1020]/60 backdrop-blur-xl"
        >
          <div className="w-16 h-16 rounded-full bg-cyan/10 border border-cyan/30 text-cyan flex items-center justify-center mx-auto mb-5 shadow-[0_0_24px_rgba(6,182,212,0.15)]">
            <Compass className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-wide mb-2">
            No Location Selected
          </h2>
          <p className="text-sm text-white/50 mb-6 leading-relaxed">
            HyperWeather requires a starting location to load local street-level weather intelligence. Use the search bar in the header or GPS button to begin.
          </p>
        </motion.div>
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
      {/* Quick Dashboard Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Hyperlocal Intelligence
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Street-level simulated forecast for your neighborhood
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/8 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors focus-ring"
        >
          <RefreshCw className={clsx("w-3.5 h-3.5", isLoading && "animate-spin")} />
          Sync Data
        </button>
      </div>

      {/* Hero Weather Panel */}
      <motion.div variants={itemVariants}>
        <HeroWeather />
      </motion.div>

      {isLoading ? (
        // Loading skeletons
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 h-48 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
          <div className="h-64 rounded-3xl bg-white/5 animate-pulse border border-white/5" />
        </div>
      ) : (
        <>
          {/* KPI Dashboard Grid */}
          <motion.div variants={itemVariants}>
            <KPIGrid />
          </motion.div>

          {/* Charts & Analytics Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 flex flex-col gap-6">
              <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                    <Sun className="w-4 h-4 text-cyan" />
                    Temperature Curve
                  </h3>
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    Next 24h
                  </span>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                  <HourlyTemperature />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h3 className="text-sm font-bold text-white tracking-wider uppercase flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-400" />
                    Rain Timeline
                  </h3>
                  <span className="text-[10px] font-semibold text-white/40 uppercase tracking-widest">
                    Precipitation Prob.
                  </span>
                </div>
                <div className="flex-1 w-full min-h-[250px]">
                  <RainForecast />
                </div>
              </motion.div>
            </div>

            {/* Meteorological Indices Panel */}
            <motion.div
              variants={itemVariants}
              className="glass-panel p-6 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-sm font-bold text-white tracking-wider uppercase mb-3 px-1">
                  Atmospheric Indicators
                </h3>
                <p className="text-xs text-white/40 mb-6 leading-relaxed">
                  Real-time index estimations for local particulate concentration and active solar radiation.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row lg:flex-col gap-8 justify-around items-center py-4">
                <RadialGauge
                  value={airQuality ? airQuality.usAqi : 42}
                  min={0}
                  max={300}
                  label="AQI"
                  subtitle="Air Quality Index"
                  type="aqi"
                  className="w-full max-w-[160px]"
                />

                <div className="h-px w-full bg-white/5 lg:block hidden"></div>
                <div className="w-px h-16 bg-white/5 lg:hidden hidden sm:block"></div>

                <RadialGauge
                  value={dailyForecast ? (dailyForecast.uvIndexMax[0] ?? 4.5) : 4.5}
                  min={0}
                  max={12}
                  label="UV Index"
                  subtitle="Max UV Radiation"
                  type="uv"
                  className="w-full max-w-[160px]"
                />
              </div>
            </motion.div>
          </div>

          {/* 7-Day Forecast Horizon */}
          {dailyForecast && (
            <motion.div
              variants={itemVariants}
              className="glass-panel p-5 rounded-3xl border border-white/10 bg-[#0B1020]/45 backdrop-blur-xl"
            >
              <div className="flex items-center gap-2 mb-5 px-1 border-b border-white/5 pb-3">
                <CalendarDays className="w-4.5 h-4.5 text-cyan" />
                <h3 className="text-sm font-bold text-white tracking-wider uppercase">
                  7-Day Forecast Horizon
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                {dailyForecast.time.slice(0, 7).map((time, i) => {
                  const maxTemp = dailyForecast.temperatureMax[i];
                  const minTemp = dailyForecast.temperatureMin[i];
                  const code = dailyForecast.weatherCode[i];

                  return (
                    <div
                      key={time}
                      className="glass-panel p-4 rounded-2xl border border-white/5 bg-white/[0.02] flex flex-col items-center justify-center text-center transition-all duration-200 hover:bg-white/[0.04] hover:scale-[1.02]"
                    >
                      <span className="text-xs font-semibold text-white/50 mb-2">
                        {getDayName(time)}
                      </span>
                      <div className="my-1.5">
                        <WeatherIcon
                          weatherCode={code}
                          isDay={true}
                          size={40}
                        />
                      </div>
                      <span className="text-xs font-medium text-white/80 mt-2 truncate w-full px-1">
                        {getWeatherDesc(code)}
                      </span>
                      <div className="flex gap-2.5 mt-3 text-xs">
                        <span className="font-bold text-white">
                          {Math.round(maxTemp)}°
                        </span>
                        <span className="font-medium text-white/40">
                          {Math.round(minTemp)}°
                        </span>
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
