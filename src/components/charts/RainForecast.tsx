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
    <div className="rounded-xl border border-white/10 bg-[#0B1020]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-bold text-blue-400">{data.probability}% chance</p>
      <p className="text-xs text-white/50">{data.precipitation.toFixed(1)} mm</p>
    </div>
  );
}

function getBarColor(probability: number): string {
  if (probability >= 80) return '#2563EB';
  if (probability >= 60) return '#3B82F6';
  if (probability >= 40) return '#60A5FA';
  if (probability >= 20) return '#93C5FD';
  return '#BFDBFE';
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
      <div className={`flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${className}`}>
        <p className="text-sm text-white/30">No rain data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-white/60 uppercase">
        Rain Probability
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="rainBarGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#1E40AF" stopOpacity={0.6} />
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
              domain={[0, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar dataKey="probability" radius={[4, 4, 0, 0]} maxBarSize={16}>
              {data.map((entry, index) => (
                <Cell key={index} fill={getBarColor(entry.probability)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
