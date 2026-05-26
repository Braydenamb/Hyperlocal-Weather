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
    <div className="rounded-xl border border-white/10 bg-[#0B1020]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
      <p className="text-lg font-bold text-cyan-400">{payload[0].value.toFixed(1)}°C</p>
      {payload[1] && (
        <p className="text-xs text-white/50">Feels like {payload[1].value.toFixed(1)}°C</p>
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
      <div className={`flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${className}`}>
        <p className="text-sm text-white/30">No temperature data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-white/60 uppercase">
        24-Hour Temperature
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="hour"
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              tickLine={false}
              interval={3}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={['dataMin - 2', 'dataMax + 2']}
              tickFormatter={(v: number) => `${v}°`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="feelsLike"
              stroke="rgba(139,92,246,0.5)"
              strokeWidth={1}
              strokeDasharray="4 4"
              fill="none"
              dot={false}
              name="Feels Like"
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#06b6d4', stroke: '#fff', strokeWidth: 2 }}
              name="Temperature"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
