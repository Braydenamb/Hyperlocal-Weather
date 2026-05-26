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

interface PressureDataPoint {
  time: string;
  hour: string;
  pressure: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number }> }) {
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
      <p className="text-sm font-bold" style={{ color: 'var(--chart-pressure)' }}>{payload[0].value.toFixed(1)} hPa</p>
    </div>
  );
}

export default function PressureTrends({ className = '' }: { className?: string }) {
  const { hourlyForecast } = useWeatherStore();

  const data = useMemo<PressureDataPoint[]>(() => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const currentHour = now.getHours();

    return hourlyForecast.time.slice(currentHour, currentHour + 24).map((t, i) => ({
      time: t,
      hour: format(parseISO(t), 'ha'),
      pressure: hourlyForecast.pressure[currentHour + i],
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[150px] items-center justify-center ${className}`}>
        <p className="text-sm opacity-50">No pressure data available</p>
      </div>
    );
  }

  const pressureMin = Math.min(...data.map((d) => d.pressure));
  const pressureMax = Math.max(...data.map((d) => d.pressure));
  const range = pressureMax - pressureMin;
  const domainMin = pressureMin - Math.max(range * 0.3, 1);
  const domainMax = pressureMax + Math.max(range * 0.3, 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`w-full h-full min-h-[150px] ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -15 }}>
          <defs>
            <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--chart-pressure)" stopOpacity={0.4} />
              <stop offset="50%" stopColor="var(--chart-pressure)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--chart-pressure)" stopOpacity={0} />
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
            domain={[domainMin, domainMax]}
            tickFormatter={(v: number) => `${Math.round(v)}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--chart-axis-line)' }} />
          <Area
            type="monotone"
            dataKey="pressure"
            stroke="var(--chart-pressure)"
            strokeWidth={2.5}
            fill="url(#pressureGrad)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--chart-pressure)', stroke: 'var(--color-background)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
