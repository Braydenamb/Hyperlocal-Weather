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
    <div className="rounded-xl border border-white/10 bg-[#0B1020]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-bold text-violet-400">{payload[0].value.toFixed(1)} hPa</p>
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
      <div className={`flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${className}`}>
        <p className="text-sm text-white/30">No pressure data available</p>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-white/60 uppercase">
        Pressure Trend
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
            <defs>
              <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                <stop offset="50%" stopColor="#a855f7" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
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
              domain={[domainMin, domainMax]}
              tickFormatter={(v: number) => `${Math.round(v)}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="pressure"
              stroke="#8b5cf6"
              strokeWidth={2.5}
              fill="url(#pressureGrad)"
              dot={false}
              activeDot={{ r: 4, fill: '#8b5cf6', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
