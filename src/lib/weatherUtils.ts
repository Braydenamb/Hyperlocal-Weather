import {
  Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudDrizzle,
  CloudFog, Snowflake, Wind, CloudSun, CloudMoon, Moon,
} from 'lucide-react';
import type { ComponentType } from 'react';

interface WeatherInfo {
  label: string;
  icon: ComponentType<{ className?: string; size?: number }>;
  color: string;
}

const weatherMap: Record<number, WeatherInfo> = {
  0: { label: 'Clear Sky', icon: Sun, color: '#FBBF24' },
  1: { label: 'Mainly Clear', icon: CloudSun, color: '#FCD34D' },
  2: { label: 'Partly Cloudy', icon: CloudSun, color: '#94A3B8' },
  3: { label: 'Overcast', icon: Cloud, color: '#64748B' },
  45: { label: 'Foggy', icon: CloudFog, color: '#94A3B8' },
  48: { label: 'Rime Fog', icon: CloudFog, color: '#CBD5E1' },
  51: { label: 'Light Drizzle', icon: CloudDrizzle, color: '#38BDF8' },
  53: { label: 'Moderate Drizzle', icon: CloudDrizzle, color: '#0EA5E9' },
  55: { label: 'Dense Drizzle', icon: CloudDrizzle, color: '#0284C7' },
  56: { label: 'Freezing Drizzle', icon: CloudDrizzle, color: '#7DD3FC' },
  57: { label: 'Heavy Freezing Drizzle', icon: CloudDrizzle, color: '#38BDF8' },
  61: { label: 'Slight Rain', icon: CloudRain, color: '#38BDF8' },
  63: { label: 'Moderate Rain', icon: CloudRain, color: '#0EA5E9' },
  65: { label: 'Heavy Rain', icon: CloudRain, color: '#0369A1' },
  66: { label: 'Light Freezing Rain', icon: CloudRain, color: '#7DD3FC' },
  67: { label: 'Heavy Freezing Rain', icon: CloudRain, color: '#0284C7' },
  71: { label: 'Slight Snow', icon: Snowflake, color: '#E0E7FF' },
  73: { label: 'Moderate Snow', icon: CloudSnow, color: '#C7D2FE' },
  75: { label: 'Heavy Snow', icon: CloudSnow, color: '#A5B4FC' },
  77: { label: 'Snow Grains', icon: Snowflake, color: '#CBD5E1' },
  80: { label: 'Rain Showers', icon: CloudRain, color: '#38BDF8' },
  81: { label: 'Moderate Rain Showers', icon: CloudRain, color: '#0EA5E9' },
  82: { label: 'Violent Rain Showers', icon: CloudRain, color: '#0369A1' },
  85: { label: 'Snow Showers', icon: CloudSnow, color: '#C7D2FE' },
  86: { label: 'Heavy Snow Showers', icon: CloudSnow, color: '#818CF8' },
  95: { label: 'Thunderstorm', icon: CloudLightning, color: '#A78BFA' },
  96: { label: 'Thunderstorm with Hail', icon: CloudLightning, color: '#8B5CF6' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: CloudLightning, color: '#7C3AED' },
};

const defaultInfo: WeatherInfo = { label: 'Unknown', icon: Wind, color: '#94A3B8' };

export function getWeatherInfo(code: number): WeatherInfo {
  return weatherMap[code] ?? defaultInfo;
}

export function getNightIcon(code: number): ComponentType<{ className?: string; size?: number }> {
  if (code === 0) return Moon;
  if (code <= 2) return CloudMoon;
  return getWeatherInfo(code).icon;
}

export function getAqiLabel(aqi: number): { label: string; color: string } {
  if (aqi <= 50) return { label: 'Good', color: '#22C55E' };
  if (aqi <= 100) return { label: 'Moderate', color: '#F59E0B' };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#F97316' };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#EF4444' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: '#7C3AED' };
  return { label: 'Hazardous', color: '#991B1B' };
}

export function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return dirs[index];
}

export function formatTemperature(temp: number, unit: '°C' | '°F' = '°C'): string {
  if (unit === '°F') {
    return `${Math.round(temp * 9 / 5 + 32)}°F`;
  }
  return `${Math.round(temp)}°C`;
}
