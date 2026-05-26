'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useWeatherStore } from '@/stores/weatherStore';

interface ChartDataPoint {
  time: string;
  hour: string;
  temperature: number;
  feelsLike: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div 
      className="rounded-xl px-3 py-2 shadow-xl backdrop-blur-xl border"
      style={{ 
        backgroundColor: 'var(--chart-tooltip-bg)',
        borderColor: 'var(--chart-tooltip-border)',
        color: 'var(--chart-tooltip-text)'
      }}
    >
      <p className="text-lg font-bold" style={{ color: 'var(--chart-temp-fill)' }}>{payload[0].value.toFixed(1)}°C</p>
      {payload[1] && (
        <p className="text-xs opacity-70">Feels like {payload[1].value.toFixed(1)}°C</p>
      )}
    </div>
  );
}

export default function HourlyTemperature({ className = '' }: { className?: string }) {
  const { hourlyForecast } = useWeatherStore();

  const data = useMemo<ChartDataPoint[]>(() => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const currentHour = now.getHours();

    return hourlyForecast.time.slice(currentHour, currentHour + 24).map((t, i) => ({
      time: t,
      hour: format(parseISO(t), 'ha'),
      temperature: hourlyForecast.temperature[currentHour + i],
      feelsLike: hourlyForecast.apparentTemperature[currentHour + i],
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[150px] items-center justify-center ${className}`}>
        <p className="text-sm opacity-50">No temperature data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`w-full h-full min-h-[150px] ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
          <defs>
            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-temp-fill)" stopOpacity={0.4} />
              <stop offset="50%" stopColor="var(--chart-temp-fill)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--chart-temp-fill)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
          <XAxis
            dataKey="hour"
            tick={{ fill: 'var(--chart-axis-text)', fontSize: 11 }}
            axisLine={{ stroke: 'var(--chart-axis-line)' }}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: 'var(--chart-axis-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={['dataMin - 2', 'dataMax + 2']}
            tickFormatter={(v: number) => `${v}°`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--chart-axis-line)' }} />
          <Area
            type="monotone"
            dataKey="feelsLike"
            stroke="var(--chart-feels-like)"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
            name="Feels Like"
          />
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="var(--chart-temp-stroke)"
            strokeWidth={2.5}
            fill="url(#tempGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--chart-temp-fill)', stroke: 'var(--color-background)', strokeWidth: 2 }}
            name="Temperature"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
