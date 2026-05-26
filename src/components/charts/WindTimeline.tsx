'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format, parseISO } from 'date-fns';
import { useWeatherStore } from '@/stores/weatherStore';

interface WindDataPoint {
  time: string;
  hour: string;
  speed: number;
  direction: number;
  dirLabel: string;
}

function windDirectionLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: WindDataPoint }> }) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  
  return (
    <div className="glass-panel px-3.5 py-2.5 shadow-xl bg-slate-950/80 backdrop-blur-xl border border-white/5 text-left flex flex-col gap-0.5">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
        Wind Velocity
      </div>
      <div className="text-lg font-black text-teal-400 mt-0.5">
        {data.speed.toFixed(1)} km/h
      </div>
      <div className="text-[11px] font-medium text-white/50">
        Direction: {data.dirLabel} ({data.direction}°)
      </div>
    </div>
  );
}

function CustomDot(props: { cx?: number; cy?: number; payload?: WindDataPoint; index?: number }) {
  const { cx, cy, payload, index } = props;
  if (!cx || !cy || !payload || index === undefined) return null;
  if (index % 4 !== 0) return null;

  const rotation = payload.direction;
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <circle r="3" fill="var(--humidity)" stroke="var(--bg)" strokeWidth="1.5" />
      <g transform={`rotate(${rotation})`}>
        <line x1="0" y1="-6" x2="0" y2="-11" stroke="var(--humidity)" strokeWidth="1.5" />
        <polygon points="-2.5,-9 0,-13 2.5,-9" fill="var(--humidity)" />
      </g>
    </g>
  );
}

export default function WindTimeline({ className = '' }: { className?: string }) {
  const { hourlyForecast } = useWeatherStore();

  const data = useMemo<WindDataPoint[]>(() => {
    if (!hourlyForecast) return [];
    const now = new Date();
    const currentHour = now.getHours();

    return hourlyForecast.time
      .slice(currentHour, currentHour + 24)
      .map((t, i) => ({
        time: t,
        hour: format(parseISO(t), 'h a'),
        speed: hourlyForecast.windSpeed[currentHour + i] ?? 0,
        direction: hourlyForecast.windDirection[currentHour + i] ?? 0,
        dirLabel: windDirectionLabel(hourlyForecast.windDirection[currentHour + i] ?? 0),
      }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[180px] items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-white/30 tracking-wider uppercase">
          No velocity metrics
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`w-full h-full min-h-[180px] relative ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 10, bottom: 0, left: -25 }}>
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
            tickFormatter={(v: number) => `${Math.round(v)}`}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
          />
          
          <Line
            type="monotone"
            dataKey="speed"
            stroke="var(--humidity)"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 4, fill: 'var(--humidity)', stroke: 'var(--bg)', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
