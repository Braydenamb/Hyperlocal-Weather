'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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
    <div className="glass-panel px-3.5 py-2.5 shadow-xl bg-slate-950/80 backdrop-blur-xl border border-white/5 text-left flex flex-col gap-0.5">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
        Barometric Pressure
      </div>
      <div className="text-lg font-black text-purple-400 mt-0.5">
        {payload[0].value.toFixed(1)} hPa
      </div>
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
      hour: format(parseISO(t), 'h a'),
      pressure: hourlyForecast.pressure[currentHour + i] ?? 0,
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[180px] items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-white/30 tracking-wider uppercase">
          No pressure telemetry
        </span>
      </div>
    );
  }

  const pressureMin = Math.min(...data.map((d) => d.pressure));
  const pressureMax = Math.max(...data.map((d) => d.pressure));
  const range = pressureMax - pressureMin;
  const domainMin = pressureMin - Math.max(range * 0.2, 1);
  const domainMax = pressureMax + Math.max(range * 0.2, 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`w-full h-full min-h-[180px] relative ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: -25 }}>
          <defs>
            <linearGradient id="pressureGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--violet)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--violet)" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          
          <XAxis
            dataKey="hour"
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            domain={[domainMin, domainMax]}
            tickFormatter={(v: number) => `${Math.round(v)}`}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
          />
          
          <Area
            type="monotone"
            dataKey="pressure"
            stroke="var(--violet)"
            strokeWidth={2}
            fill="url(#pressureGrad)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--violet)', stroke: 'var(--bg)', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
