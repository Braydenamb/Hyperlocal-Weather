'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

interface RadialGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  subtitle?: string;
  type: 'aqi' | 'uv';
  className?: string;
}

export default function RadialGauge({
  value,
  min = 0,
  max = 500,
  label,
  subtitle,
  type,
  className = '',
}: RadialGaugeProps) {
  // Normalize value between 0 and 1
  const percentage = useMemo(() => {
    const clamped = Math.max(min, Math.min(max, value));
    return (clamped - min) / (max - min);
  }, [value, min, max]);

  // Center coordinate and radius
  const size = 200;
  const cx = size / 2;
  const cy = size / 2 + 20; // Lower a bit to account for arc baseline
  const r = 70;
  const strokeWidth = 14;

  // Arc details (240 degrees total, symmetrical around the top)
  const startAngle = -120;
  const endAngle = 120;
  const totalAngle = endAngle - startAngle;

  // Circle circumference
  const circumference = 2 * Math.PI * r;
  // Length of the 240-degree arc
  const arcLength = (totalAngle / 360) * circumference;
  // Offset based on progress
  const strokeDashoffset = arcLength - percentage * arcLength;

  // Semantic color selection based on type and value
  const themeColors = useMemo(() => {
    if (type === 'aqi') {
      if (value <= 50) return { stroke: 'var(--chart-aqi-good)', text: 'Good', glow: 'rgba(34, 197, 94, 0.25)' };
      if (value <= 100) return { stroke: 'var(--chart-aqi-moderate)', text: 'Moderate', glow: 'rgba(234, 179, 8, 0.25)' };
      return { stroke: 'var(--chart-aqi-poor)', text: 'Poor', glow: 'rgba(239, 68, 68, 0.25)' };
    } else {
      // UV Index
      if (value <= 2) return { stroke: 'var(--chart-aqi-good)', text: 'Low', glow: 'rgba(34, 197, 94, 0.25)' };
      if (value <= 5) return { stroke: 'var(--chart-uv-low)', text: 'Moderate', glow: 'rgba(245, 158, 11, 0.25)' };
      return { stroke: 'var(--chart-uv-high)', text: 'Very High', glow: 'rgba(234, 88, 12, 0.25)' };
    }
  }, [type, value]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-[200px] select-none"
      >
        <defs>
          <filter id="gaugeGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Gray Background Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--color-surface-200)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeLinecap="round"
          transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
        />

        {/* Glowing Progress Arc */}
        <motion.circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={themeColors.stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          initial={{ strokeDashoffset: arcLength }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1] }}
          strokeLinecap="round"
          transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
          style={{ filter: `drop-shadow(0 0 6px ${themeColors.stroke})` }}
        />

        {/* Text Details Inside */}
        <text
          x={cx}
          y={cy - 10}
          textAnchor="middle"
          className="text-4xl font-black fill-[var(--text-primary)] font-mono"
        >
          {Math.round(value)}
        </text>

        <text
          x={cx}
          y={cy + 15}
          textAnchor="middle"
          className="text-[10px] font-bold tracking-widest uppercase fill-[var(--text-secondary)]"
        >
          {label}
        </text>

        <text
          x={cx}
          y={cy + 30}
          textAnchor="middle"
          className="text-xs font-semibold"
          fill={themeColors.stroke}
        >
          {themeColors.text}
        </text>
      </svg>

      {subtitle && (
        <span className="text-[10px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mt-1 block">
          {subtitle}
        </span>
      )}
    </div>
  );
}
