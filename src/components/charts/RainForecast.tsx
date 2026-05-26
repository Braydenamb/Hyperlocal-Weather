'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useWeatherStore } from '@/stores/weatherStore';

interface RainDataPoint {
  time: string;
  hour: string;
  probability: number;
  precipitation: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; payload: RainDataPoint }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div 
      className="rounded-xl px-3 py-2 shadow-xl backdrop-blur-xl border"
      style={{ 
        backgroundColor: 'var(--chart-tooltip-bg)',
        borderColor: 'var(--chart-tooltip-border)',
        color: 'var(--chart-tooltip-text)'
      }}
    >
      <p className="text-sm font-bold" style={{ color: 'var(--chart-rain-mid)' }}>{data.probability}% chance</p>
      <p className="text-xs opacity-70">{data.precipitation.toFixed(1)} mm</p>
    </div>
  );
}

function getBarColor(probability: number): string {
  if (probability >= 80) return 'var(--chart-rain-high)';
  if (probability >= 60) return 'var(--chart-rain-mid)';
  if (probability >= 40) return 'var(--chart-rain-low)';
  if (probability >= 20) return 'var(--chart-rain-trace)';
  return 'var(--chart-rain-none)';
}

export default function RainForecast({ className = '' }: { className?: string }) {
  const { hourlyForecast } = useWeatherStore();

  const data = useMemo<RainDataPoint[]>(() => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const currentHour = now.getHours();

    return hourlyForecast.time.slice(currentHour, currentHour + 24).map((t, i) => ({
      time: t,
      hour: format(parseISO(t), 'ha'),
      probability: hourlyForecast.precipitationProbability[currentHour + i] ?? 0,
      precipitation: hourlyForecast.precipitation[currentHour + i] ?? 0,
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[150px] items-center justify-center ${className}`}>
        <p className="text-sm opacity-50">No rain data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`w-full h-full min-h-[150px] ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
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
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--chart-grid)' }} />
          <Bar dataKey="probability" radius={[4, 4, 0, 0]} maxBarSize={16}>
            {data.map((entry, index) => (
              <Cell key={index} fill={getBarColor(entry.probability)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
