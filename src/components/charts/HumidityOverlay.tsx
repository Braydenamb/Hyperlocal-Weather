'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
  const humidity = payload.find(p => p.name === 'Humidity')?.value;
  const dewPoint = payload.find(p => p.name === 'Dew Point')?.value;

  return (
    <div className="glass-panel px-3.5 py-2.5 shadow-xl bg-slate-950/80 backdrop-blur-xl border border-white/5 text-left flex flex-col gap-0.5">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
        Moisture Profile
      </div>
      <div className="text-lg font-black text-emerald-400 mt-0.5">
        {humidity !== undefined ? `${Math.round(humidity)}% humidity` : '--'}
      </div>
      {dewPoint !== undefined && (
        <div className="text-[11px] font-medium text-white/50">
          Dew Point: {dewPoint.toFixed(1)}°C
        </div>
      )}
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
      hour: format(parseISO(t), 'h a'),
      humidity: hourlyForecast.humidity[currentHour + i] ?? 0,
      dewPoint: hourlyForecast.dewPoint[currentHour + i] ?? 0,
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[180px] items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-white/30 tracking-wider uppercase">
          No humidity telemetry
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
        <ComposedChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: -25 }}>
          <defs>
            <linearGradient id="humidityGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--humidity)" stopOpacity={0.15} />
              <stop offset="100%" stopColor="var(--humidity)" stopOpacity={0.0} />
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
            yAxisId="humidity"
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
          />
          <YAxis
            yAxisId="dewPoint"
            orientation="right"
            tick={false}
            axisLine={false}
            tickLine={false}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
          />
          
          {/* Humidity Area */}
          <Area
            yAxisId="humidity"
            type="monotone"
            dataKey="humidity"
            stroke="var(--humidity)"
            strokeWidth={2}
            fill="url(#humidityGrad)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--humidity)', stroke: 'var(--bg)', strokeWidth: 2 }}
            name="Humidity"
          />
          
          {/* Dew Point Line */}
          <Line
            yAxisId="dewPoint"
            type="monotone"
            dataKey="dewPoint"
            stroke="var(--primary)"
            strokeWidth={1.5}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--bg)', strokeWidth: 2 }}
            name="Dew Point"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
