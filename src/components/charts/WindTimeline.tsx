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
    <div 
      className="rounded-xl px-3 py-2 shadow-xl backdrop-blur-xl border"
      style={{ 
        backgroundColor: 'var(--chart-tooltip-bg)',
        borderColor: 'var(--chart-tooltip-border)',
        color: 'var(--chart-tooltip-text)'
      }}
    >
      <p className="text-sm font-bold" style={{ color: 'var(--chart-wind-line)' }}>{data.speed.toFixed(1)} km/h</p>
      <p className="text-xs opacity-70">Direction: {data.dirLabel} ({data.direction}°)</p>
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
      <circle r="3" fill="var(--chart-wind-line)" stroke="var(--color-background)" strokeWidth="1.5" />
      <g transform={`rotate(${rotation})`}>
        <line x1="0" y1="-6" x2="0" y2="-12" stroke="var(--chart-wind-line)" strokeWidth="1.5" />
        <polygon points="-3,-10 0,-14 3,-10" fill="var(--chart-wind-line)" />
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
      <div className={`flex w-full h-full min-h-[150px] items-center justify-center ${className}`}>
        <p className="text-sm opacity-50">No wind data available</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className={`w-full h-full min-h-[150px] ${className}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 10, bottom: 0, left: -15 }}>
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
            tickFormatter={(v: number) => `${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--chart-axis-line)' }} />
          <Line
            type="monotone"
            dataKey="speed"
            stroke="var(--chart-wind-line)"
            strokeWidth={2.5}
            dot={<CustomDot />}
            activeDot={{ r: 5, fill: 'var(--chart-wind-line)', stroke: 'var(--color-background)', strokeWidth: 2 }}
          />
          {gustPoint && (
            <ReferenceDot
              x={gustPoint.hour}
              y={gustPoint.speed}
              r={6}
              fill="var(--color-warning)"
              stroke="var(--color-background)"
              strokeWidth={2}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
