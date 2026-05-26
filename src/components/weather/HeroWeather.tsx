'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Droplets, Wind, Eye, ArrowUp } from 'lucide-react';
import { useWeatherStore } from '@/stores/weatherStore';
import { useLocationStore } from '@/stores/locationStore';
import { useThemeStore } from '@/stores/themeStore';
import WeatherIcon from '@/components/weather/WeatherIcon';
import WeatherParticles from '@/components/animations/WeatherParticles';
import GlowOrb from '@/components/animations/GlowOrb';
import SunriseSunset from '@/components/weather/SunriseSunset';

function getWeatherDescription(code: number): string {
  const map: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Depositing Rime Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    56: 'Light Freezing Drizzle',
    57: 'Dense Freezing Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    66: 'Light Freezing Rain',
    67: 'Heavy Freezing Rain',
    71: 'Slight Snowfall',
    73: 'Moderate Snowfall',
    75: 'Heavy Snowfall',
    77: 'Snow Grains',
    80: 'Slight Rain Showers',
    81: 'Moderate Rain Showers',
    82: 'Violent Rain Showers',
    85: 'Slight Snow Showers',
    86: 'Heavy Snow Showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with Slight Hail',
    99: 'Thunderstorm with Heavy Hail',
  };
  return map[code] ?? 'Unknown';
}

function getParticleCondition(code: number): 'rain' | 'snow' | 'cloud' | 'clear' | 'storm' {
  if (code >= 95) return 'storm';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 71 && code <= 86) return 'snow';
  if (code >= 51 && code <= 57) return 'rain';
  if (code === 3 || (code >= 45 && code <= 48)) return 'cloud';
  return 'clear';
}

function getGradient(code: number, isDay: boolean): string {
  if (!isDay) return 'from-[#0B1020] via-[#111827] to-[#1E1B4B]';
  if (code >= 95) return 'from-[#1E293B] via-[#334155] to-[#475569]';
  if (code >= 61 || (code >= 80 && code <= 82)) return 'from-[#1E3A5F] via-[#2C5282] to-[#3B82F6]';
  if (code >= 51 && code <= 57) return 'from-[#1E3A5F] via-[#3B82F6] to-[#60A5FA]';
  if (code >= 71 && code <= 86) return 'from-[#E2E8F0] via-[#CBD5E1] to-[#94A3B8]';
  if (code >= 45 && code <= 48) return 'from-[#64748B] via-[#94A3B8] to-[#CBD5E1]';
  if (code === 3) return 'from-[#475569] via-[#64748B] to-[#94A3B8]';
  if (code === 2) return 'from-[#0369A1] via-[#0EA5E9] to-[#38BDF8]';
  if (code === 1) return 'from-[#0284C7] via-[#06B6D4] to-[#67E8F9]';
  return 'from-[#0369A1] via-[#0EA5E9] to-[#7DD3FC]';
}

function getAqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: 'Good', color: 'bg-green-500/20 text-green-400 border-green-500/30' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500/20 text-red-400 border-red-500/30' };
  return { label: 'Hazardous', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' };
}

function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(deg / 22.5) % 16];
}

export default function HeroWeather() {
  const { currentWeather, dailyForecast, airQuality } = useWeatherStore();
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const theme = useThemeStore((s) => s.theme);

  const gradient = useMemo(
    () => (currentWeather ? getGradient(currentWeather.weatherCode, currentWeather.isDay) : 'from-[#0B1020] via-[#111827] to-[#1E1B4B]'),
    [currentWeather]
  );

  const particleCondition = useMemo(
    () => (currentWeather ? getParticleCondition(currentWeather.weatherCode) : 'clear'),
    [currentWeather]
  );

  if (!currentWeather || !currentLocation) {
    return (
      <div className="relative flex min-h-[380px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-[#0B1020] via-[#111827] to-[#1E1B4B] p-8">
        <GlowOrb color="#06b6d4" size={200} className="left-1/4 top-1/4" />
        <GlowOrb color="#8b5cf6" size={250} className="right-1/4 bottom-1/4" delay={2} />
        <div className="relative z-10 text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mx-auto mb-4 h-16 w-16 rounded-full bg-white/10"
          />
          <p className="text-lg font-medium text-white/50">Select a location to see weather</p>
        </div>
      </div>
    );
  }

  const aqiInfo = airQuality ? getAqiLabel(airQuality.usAqi) : null;
  const uvIndex = dailyForecast?.uvIndexMax?.[0] ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 shadow-2xl md:p-8`}
    >
      {/* Particles overlay */}
      <WeatherParticles condition={particleCondition} intensity={0.7} className="z-0" />

      {/* Glow orbs */}
      <GlowOrb
        color={currentWeather.isDay ? '#FBBF24' : '#8b5cf6'}
        size={280}
        className="-right-20 -top-20"
      />
      <GlowOrb
        color={currentWeather.isDay ? '#06b6d4' : '#3b82f6'}
        size={200}
        className="-bottom-16 -left-16"
        delay={3}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Location */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 flex items-center gap-2"
        >
          <MapPin size={16} className="text-white/60" />
          <span className="text-sm font-medium text-white/80">
            {currentLocation.name}
            {currentLocation.admin1 ? `, ${currentLocation.admin1}` : ''}
            {`, ${currentLocation.country}`}
          </span>
        </motion.div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          {/* Left: temp + condition */}
          <div className="flex items-start gap-4">
            <WeatherIcon
              weatherCode={currentWeather.weatherCode}
              isDay={currentWeather.isDay}
              size={100}
            />
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-start"
              >
                <span className={`text-7xl font-thin tracking-tighter md:text-8xl ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                  {Math.round(currentWeather.temperature)}
                </span>
                <span className="mt-2 text-3xl font-light text-white/60">°C</span>
              </motion.div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-1 text-lg font-medium text-white/80"
              >
                {getWeatherDescription(currentWeather.weatherCode)}
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="mt-0.5 text-sm text-white/50"
              >
                Feels like {Math.round(currentWeather.feelsLike)}°C
              </motion.p>
            </div>
          </div>

          {/* Right: details grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-2 gap-x-8 gap-y-3"
          >
            <div className="flex items-center gap-2">
              <Droplets size={14} className="text-blue-400" />
              <span className="text-sm text-white/60">Humidity</span>
              <span className="ml-auto text-sm font-semibold text-white">{currentWeather.humidity}%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind size={14} className="text-teal-400" />
              <span className="text-sm text-white/60">Wind</span>
              <span className="ml-auto text-sm font-semibold text-white">
                {Math.round(currentWeather.windSpeed)} km/h {windDirectionLabel(currentWeather.windDirection)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-cyan-400" />
              <span className="text-sm text-white/60">UV Index</span>
              <span className="ml-auto text-sm font-semibold text-white">{uvIndex.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp
                size={14}
                className="text-violet-400"
                style={{ transform: `rotate(${currentWeather.windDirection}deg)` }}
              />
              <span className="text-sm text-white/60">Gusts</span>
              <span className="ml-auto text-sm font-semibold text-white">
                {Math.round(currentWeather.windGusts)} km/h
              </span>
            </div>

            {/* AQI badge */}
            {aqiInfo && (
              <div className="col-span-2 mt-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${aqiInfo.color}`}
                >
                  AQI {airQuality!.usAqi} — {aqiInfo.label}
                </span>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sunrise/Sunset */}
        {dailyForecast && dailyForecast.sunrise[0] && dailyForecast.sunset[0] && (
          <div className="mt-6">
            <SunriseSunset
              sunrise={dailyForecast.sunrise[0]}
              sunset={dailyForecast.sunset[0]}
              variant="minimal"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
