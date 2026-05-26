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
import { CalendarDays, CloudRain, Sun, Compass, RefreshCw, Layers } from 'lucide-react';
import clsx from 'clsx';

const getDayName = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

const getWeatherDesc = (code: number) => {
  const map: Record<number, string> = {
    0: 'Clear Sky', 1: 'Mainly Clear', 2: 'Partly Cloudy', 3: 'Overcast',
    45: 'Foggy', 48: 'Depositing Fog', 51: 'Light Drizzle', 53: 'Drizzle', 55: 'Dense Drizzle',
    61: 'Slight Rain', 63: 'Moderate Rain', 65: 'Heavy Rain',
    71: 'Slight Snow', 73: 'Moderate Snow', 75: 'Heavy Snow',
    80: 'Rain Showers', 81: 'Showers', 82: 'Violent Showers',
    95: 'Thunderstorm', 96: 'Storm w/ Hail', 99: 'Severe Storm',
  };
  return map[code] ?? 'Weather';
};

export default function OverviewPage() {
  const { currentWeather, dailyForecast, airQuality, isLoading } = useWeather();
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
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md glass-panel p-8 shadow-lg bg-white/[0.01] border-white/5 text-center flex flex-col items-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-cyan/10 border border-cyan/20 text-cyan flex items-center justify-center mb-5">
            <Compass className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <h2 className="text-xl font-black text-white tracking-wide mb-2 uppercase text-center">
            No Location Selected
          </h2>
          <p className="text-xs text-white/50 mb-6 leading-relaxed text-center">
            Select a localized geocoding station or trigger your GPS receiver in the navigation header to load hyper-fidelity street-level weather indices.
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
      className="space-y-8"
    >
      {/* Title & Sync Action */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight uppercase select-none">
            Atmospheric Intelligence
          </h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-0.5 select-none">
            Simulated street-level forecasts blended from active stations
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/5 text-xs font-bold text-white/60 hover:text-white hover:bg-white/10 hover:border-white/10 transition-all duration-200 focus-ring"
        >
          <RefreshCw className={clsx("w-3.5 h-3.5", isLoading && "animate-spin text-cyan")} />
          Sync Station
        </button>
      </div>

      {/* Hero Weather Conditions (Fluid Wide Capsule) */}
      <motion.div variants={itemVariants}>
        <HeroWeather />
      </motion.div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-56 rounded-3xl bg-white/5 animate-pulse" />
            <div className="h-56 rounded-3xl bg-white/5 animate-pulse" />
          </div>
          <div className="h-[400px] rounded-3xl bg-white/5 animate-pulse" />
        </div>
      ) : (
        <>
          {/* Detailed Meteorological KPI telemetry */}
          <motion.div variants={itemVariants}>
            <KPIGrid />
          </motion.div>

          {/* Asymmetric Core Dashboard Workspace */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Section (2 Columns): High fidelity Analytics Charts */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              
              {/* Temperature Curve */}
              <motion.div 
                variants={itemVariants} 
                className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5 px-1">
                  <h3 className="text-xs font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                    <Sun className="w-4 h-4 text-cyan" />
                    Thermal Distribution
                  </h3>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    24h Curve
                  </span>
                </div>
                <div className="flex-1 w-full min-h-[220px]">
                  <HourlyTemperature />
                </div>
              </motion.div>

              {/* Rain Probability Timeline */}
              <motion.div 
                variants={itemVariants} 
                className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col"
              >
                <div className="flex items-center justify-between mb-5 px-1">
                  <h3 className="text-xs font-black text-white/60 tracking-widest uppercase flex items-center gap-2">
                    <CloudRain className="w-4 h-4 text-blue-400" />
                    Precipitation Sweep
                  </h3>
                  <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                    Moisture Probability
                  </span>
                </div>
                <div className="flex-1 w-full min-h-[220px]">
                  <RainForecast />
                </div>
              </motion.div>

            </div>

            {/* Right Section (1 Column): Chronological 7-Day Horizon */}
            <div className="flex flex-col gap-8">
              
              {/* Meteorological Indicators */}
              <motion.div
                variants={itemVariants}
                className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-black text-white/60 tracking-widest uppercase mb-4 px-1">
                    Atmospheric Indicators
                  </h3>
                </div>

                <div className="flex items-center justify-around py-2">
                  <RadialGauge
                    value={airQuality ? airQuality.usAqi : 34}
                    min={0}
                    max={200}
                    label="AQI"
                    type="aqi"
                    className="w-1/2"
                  />
                  <div className="w-px h-24 bg-white/10" />
                  <RadialGauge
                    value={dailyForecast ? (dailyForecast.uvIndexMax[0] ?? 3.5) : 3.5}
                    min={0}
                    max={12}
                    label="UV Index"
                    type="uv"
                    className="w-1/2"
                  />
                </div>
              </motion.div>

              {/* Vertical Chronological Calendar Rail (Stripe/Apple Style) */}
              {dailyForecast && (
                <motion.div
                  variants={itemVariants}
                  className="glass-panel p-5 shadow-sm bg-white/[0.01] border-white/5 flex-1 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-4 px-1 border-b border-white/5 pb-3">
                    <CalendarDays className="w-4.5 h-4.5 text-cyan" />
                    <h3 className="text-xs font-black text-white/60 tracking-widest uppercase">
                      7-Day Horizon
                    </h3>
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-3">
                    {dailyForecast.time.slice(0, 7).map((time, i) => {
                      const maxTemp = dailyForecast.temperatureMax[i];
                      const minTemp = dailyForecast.temperatureMin[i];
                      const code = dailyForecast.weatherCode[i];

                      return (
                        <div
                          key={time}
                          className="flex items-center justify-between py-1.5 px-2 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
                        >
                          {/* Day Column */}
                          <span className="text-xs font-bold text-white/50 w-10 text-left">
                            {getDayName(time)}
                          </span>

                          {/* Weather Icon Column */}
                          <div className="flex items-center justify-center w-8">
                            <WeatherIcon
                              weatherCode={code}
                              isDay={true}
                              size={22}
                            />
                          </div>

                          {/* Climate Description */}
                          <span className="text-[11px] font-bold text-white/80 flex-1 truncate px-3 text-left">
                            {getWeatherDesc(code)}
                          </span>

                          {/* Thermal Range Bar */}
                          <div className="flex items-center gap-2.5 text-xs font-mono">
                            <span className="font-extrabold text-white">
                              {Math.round(maxTemp)}°
                            </span>
                            <div className="w-8 h-1 bg-white/10 rounded-full overflow-hidden relative hidden sm:block">
                              <div className="absolute top-0 bottom-0 left-[20%] right-[30%] bg-cyan rounded-full" />
                            </div>
                            <span className="font-bold text-white/30">
                              {Math.round(minTemp)}°
                            </span>
                          </div>

                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </div>

          </div>
        </>
      )}
    </motion.div>
  );
}
