'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
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

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: RainDataPoint }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="glass-panel px-3.5 py-2.5 shadow-xl bg-slate-950/80 backdrop-blur-xl border border-white/5 text-left flex flex-col gap-0.5">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
        Precipitation
      </div>
      <div className="text-lg font-black text-cyan mt-0.5">
        {data.probability}% chance
      </div>
      <div className="text-[11px] font-medium text-white/50">
        Rainfall volume: {data.precipitation.toFixed(1)} mm
      </div>
    </div>
  );
}

function getBarColor(probability: number): string {
  if (probability >= 80) return 'var(--primary)';
  if (probability >= 50) return 'var(--electric)';
  if (probability >= 20) return 'rgba(59, 130, 246, 0.45)';
  return 'rgba(255, 255, 255, 0.05)';
}

export default function RainForecast({ className = '' }: { className?: string }) {
  const { hourlyForecast } = useWeatherStore();

  const data = useMemo<RainDataPoint[]>(() => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const currentHour = now.getHours();

    return hourlyForecast.time.slice(currentHour, currentHour + 24).map((t, i) => ({
      time: t,
      hour: format(parseISO(t), 'h a'),
      probability: hourlyForecast.precipitationProbability[currentHour + i] ?? 0,
      precipitation: hourlyForecast.precipitation[currentHour + i] ?? 0,
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[180px] items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-white/30 tracking-wider uppercase">
          No moisture metrics
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.08 }}
      className={`w-full h-full min-h-[180px] relative ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: -25 }}>
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
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ fill: 'rgba(255, 255, 255, 0.02)', radius: 4 }} 
          />
          
          <Bar dataKey="probability" radius={[6, 6, 0, 0]} maxBarSize={10}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.probability)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
