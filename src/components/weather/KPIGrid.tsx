'use client';

import { useMemo } from 'react';
import { Thermometer, Droplets, Wind, Activity, Gauge, CloudRain } from 'lucide-react';
import { useWeatherStore } from '@/stores/weatherStore';
import KPICard from '@/components/weather/KPICard';

function getNext24(data: number[] | undefined): number[] {
  if (!data) return Array(24).fill(0);
  const now = new Date();
  const currentHour = now.getHours();
  return data.slice(currentHour, currentHour + 24);
}

function getTrend(data: number[]): { direction: 'up' | 'down' | 'neutral'; value: string } {
  if (data.length < 2) return { direction: 'neutral', value: '' };
  const first = data[0];
  const last = data[data.length - 1];
  const diff = last - first;
  if (Math.abs(diff) < 0.5) return { direction: 'neutral', value: '' };
  return {
    direction: diff > 0 ? 'up' : 'down',
    value: `${Math.abs(diff).toFixed(1)}`,
  };
}

export default function KPIGrid() {
  const { currentWeather, hourlyForecast, airQuality } = useWeatherStore();

  const kpiData = useMemo(() => {
    const tempData = getNext24(hourlyForecast?.temperature);
    const humidityData = getNext24(hourlyForecast?.humidity);
    const windData = getNext24(hourlyForecast?.windSpeed);
    const pressureData = getNext24(hourlyForecast?.pressure);
    const rainData = getNext24(hourlyForecast?.precipitationProbability);

    const tempTrend = getTrend(tempData);
    const humidTrend = getTrend(humidityData);
    const windTrend = getTrend(windData);
    const pressureTrend = getTrend(pressureData);

    return [
      {
        icon: Thermometer,
        label: 'Temperature',
        value: currentWeather ? Math.round(currentWeather.temperature) : '--',
        unit: '°C',
        sparklineData: tempData,
        trend: tempTrend.direction,
        trendValue: tempTrend.value ? `${tempTrend.value}°` : undefined,
        color: '#06b6d4',
      },
      {
        icon: Droplets,
        label: 'Humidity',
        value: currentWeather ? currentWeather.humidity : '--',
        unit: '%',
        sparklineData: humidityData,
        trend: humidTrend.direction,
        trendValue: humidTrend.value ? `${humidTrend.value}%` : undefined,
        color: '#3b82f6',
      },
      {
        icon: Wind,
        label: 'Wind Speed',
        value: currentWeather ? Math.round(currentWeather.windSpeed) : '--',
        unit: 'km/h',
        sparklineData: windData,
        trend: windTrend.direction,
        trendValue: windTrend.value ? `${windTrend.value}` : undefined,
        color: '#14b8a6',
      },
      {
        icon: Activity,
        label: 'Air Quality',
        value: airQuality ? airQuality.usAqi : '--',
        unit: 'AQI',
        sparklineData: Array(24).fill(airQuality?.usAqi ?? 0).map((v, i) => v + Math.sin(i * 0.5) * 5),
        trend: 'neutral' as const,
        color: '#8b5cf6',
      },
      {
        icon: Gauge,
        label: 'Pressure',
        value: currentWeather ? Math.round(currentWeather.pressure) : '--',
        unit: 'hPa',
        sparklineData: pressureData,
        trend: pressureTrend.direction,
        trendValue: pressureTrend.value ? `${pressureTrend.value}` : undefined,
        color: '#a855f7',
      },
      {
        icon: CloudRain,
        label: 'Rain Prob.',
        value: rainData[0] !== undefined ? Math.round(rainData[0]) : '--',
        unit: '%',
        sparklineData: rainData,
        trend: 'neutral' as const,
        color: '#60a5fa',
      },
    ];
  }, [currentWeather, hourlyForecast, airQuality]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kpiData.map((kpi, index) => (
        <KPICard key={kpi.label} {...kpi} delay={index * 0.08} />
      ))}
    </div>
  );
}
