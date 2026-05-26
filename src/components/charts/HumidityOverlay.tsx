'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useWeatherStore } from '@/stores/weatherStore';

interface HumidityDataPoint {
  time: string;
  hour: string;
  humidity: number;
  dewPoint: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }> }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0B1020]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
      {payload.map((entry, i) => (
        <p key={i} className="text-sm" style={{ color: entry.color }}>
          <span className="font-bold">{entry.value.toFixed(1)}</span>
          <span className="ml-1 text-xs text-white/50">
            {entry.name === 'humidity' ? '%' : '°C'}
          </span>
        </p>
      ))}
    </div>
  );
}

export default function HumidityOverlay({ className = '' }: { className?: string }) {
  const { hourlyForecast } = useWeatherStore();

  const data = useMemo<HumidityDataPoint[]>(() => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const currentHour = now.getHours();

    return hourlyForecast.time.slice(currentHour, currentHour + 24).map((t, i) => ({
      time: t,
      hour: format(parseISO(t), 'ha'),
      humidity: hourlyForecast.humidity[currentHour + i],
      dewPoint: hourlyForecast.dewPoint[currentHour + i],
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[150px] items-center justify-center ${className}`}>
        <p className="text-sm opacity-50">No humidity data available</p>
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
        <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
          <defs>
            <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-teal)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--color-teal)" stopOpacity={0} />
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
            yAxisId="humidity"
            tick={{ fill: 'var(--chart-axis-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            yAxisId="dewPoint"
            orientation="right"
            tick={{ fill: 'var(--chart-axis-text)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `${v}°`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--chart-axis-line)' }} />
          <Legend
            wrapperStyle={{ fontSize: 11, color: 'var(--chart-axis-text)' }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            stroke="var(--color-teal)"
            strokeWidth={2}
            fill="url(#humidityGrad)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--color-teal)', stroke: 'var(--color-background)', strokeWidth: 2 }}
            name="Humidity"
          />
          <Line
            yAxisId="dewPoint"
            type="monotone"
            dataKey="dewPoint"
            stroke="var(--color-cyan)"
            strokeWidth={2}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--color-cyan)', stroke: 'var(--color-background)', strokeWidth: 2 }}
            name="Dew Point"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
