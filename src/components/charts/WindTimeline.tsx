'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
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
    <div className="rounded-xl border border-white/10 bg-[#0B1020]/90 px-3 py-2 shadow-xl backdrop-blur-xl">
      <p className="text-sm font-bold text-teal-400">{data.speed.toFixed(1)} km/h</p>
      <p className="text-xs text-white/50">Direction: {data.dirLabel} ({data.direction}°)</p>
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
      <circle r="3" fill="#14b8a6" stroke="#0B1020" strokeWidth="1.5" />
      <g transform={`rotate(${rotation})`}>
        <line x1="0" y1="-6" x2="0" y2="-12" stroke="#14b8a6" strokeWidth="1.5" />
        <polygon points="-3,-10 0,-14 3,-10" fill="#14b8a6" />
      </g>
    </g>
  );
}

export default function WindTimeline({ className = '' }: { className?: string }) {
  const { hourlyForecast, currentWeather } = useWeatherStore();

  const { data, gustPoint } = useMemo(() => {
    if (!hourlyForecast) return { data: [], gustPoint: null };
    const now = new Date();
    const currentHour = now.getHours();

    const chartData: WindDataPoint[] = hourlyForecast.time
      .slice(currentHour, currentHour + 24)
      .map((t, i) => ({
        time: t,
        hour: format(parseISO(t), 'ha'),
        speed: hourlyForecast.windSpeed[currentHour + i],
        direction: hourlyForecast.windDirection[currentHour + i],
        dirLabel: windDirectionLabel(hourlyForecast.windDirection[currentHour + i]),
      }));

    let maxGust: { hour: string; speed: number } | null = null;
    if (currentWeather) {
      const maxIdx = chartData.reduce(
        (maxI, p, i, arr) => (p.speed > arr[maxI].speed ? i : maxI),
        0
      );
      maxGust = { hour: chartData[maxIdx].hour, speed: chartData[maxIdx].speed };
    }

    return { data: chartData, gustPoint: maxGust };
  }, [hourlyForecast, currentWeather]);

  if (!data.length) {
    return (
      <div className={`flex h-64 items-center justify-center rounded-2xl border border-white/10 bg-white/5 ${className}`}>
        <p className="text-sm text-white/30">No wind data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-xl ${className}`}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-white/60 uppercase">
        Wind Timeline
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 15, right: 10, bottom: 5, left: -10 }}>
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
              tickFormatter={(v: number) => `${v}`}
              label={{ value: 'km/h', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#14b8a6"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 5, fill: '#14b8a6', stroke: '#fff', strokeWidth: 2 }}
            />
            {gustPoint && (
              <ReferenceDot
                x={gustPoint.hour}
                y={gustPoint.speed}
                r={6}
                fill="#F59E0B"
                stroke="#0B1020"
                strokeWidth={2}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
