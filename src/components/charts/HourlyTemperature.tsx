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

interface ChartDataPoint {
  time: string;
  hour: string;
  temperature: number;
  feelsLike: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) {
  if (!active || !payload?.length) return null;
  const temp = payload.find(p => p.name === 'Temperature')?.value;
  const feels = payload.find(p => p.name === 'Feels Like')?.value;

  return (
    <div className="glass-panel px-3.5 py-2.5 shadow-xl bg-slate-950/80 backdrop-blur-xl border border-white/5 text-left flex flex-col gap-0.5">
      <div className="text-[10px] font-black uppercase tracking-widest text-white/40">
        Temperature
      </div>
      <div className="text-lg font-black text-white mt-0.5">
        {temp !== undefined ? `${temp.toFixed(1)}°C` : '--'}
      </div>
      {feels !== undefined && (
        <div className="text-[11px] font-medium text-white/50">
          Feels like {feels.toFixed(1)}°C
        </div>
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
      hour: format(parseISO(t), 'h a'),
      temperature: hourlyForecast.temperature[currentHour + i] ?? 0,
      feelsLike: hourlyForecast.apparentTemperature[currentHour + i] ?? 0,
    }));
  }, [hourlyForecast]);

  if (!data.length) {
    return (
      <div className={`flex w-full h-full min-h-[180px] items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-white/30 tracking-wider uppercase">
          No telemetry available
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
        <AreaChart data={data} margin={{ top: 12, right: 10, bottom: 0, left: -25 }}>
          <defs>
            <linearGradient id="tempCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.18} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.0} />
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
            domain={['dataMin - 1', 'dataMax + 1']}
            tickFormatter={(v: number) => `${Math.round(v)}°`}
          />
          
          <Tooltip 
            content={<CustomTooltip />} 
            cursor={{ stroke: 'var(--border)', strokeWidth: 1.5, strokeDasharray: '4 4' }} 
          />
          
          {/* Feels Like - Muted Dash */}
          <Area
            type="monotone"
            dataKey="feelsLike"
            stroke="var(--electric)"
            strokeWidth={1}
            strokeDasharray="4 4"
            fill="none"
            dot={false}
            activeDot={false}
            name="Feels Like"
          />
          
          {/* Main Temperature Area */}
          <Area
            type="monotone"
            dataKey="temperature"
            stroke="var(--primary)"
            strokeWidth={2}
            fill="url(#tempCurveGradient)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--primary)', stroke: 'var(--bg)', strokeWidth: 2, className: "shadow-md" }}
            name="Temperature"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
