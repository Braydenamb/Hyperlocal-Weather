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
  const cy = size / 2 + 15; // Lower a bit to account for arc baseline
  const r = 74;
  const strokeWidth = 8; // Slender, premium modern strokes

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

  // Semantic color selection based on type and value using theme tokens
  const themeColors = useMemo(() => {
    if (type === 'aqi') {
      if (value <= 50) return { stroke: 'var(--aqi-good)', text: 'Good' };
      if (value <= 100) return { stroke: 'var(--aqi-moderate)', text: 'Moderate' };
      return { stroke: 'var(--aqi-poor)', text: 'Poor' };
    } else {
      // UV Index
      if (value <= 2) return { stroke: 'var(--uv-low)', text: 'Low' };
      if (value <= 5) return { stroke: 'var(--uv-mid)', text: 'Moderate' };
      return { stroke: 'var(--uv-high)', text: 'Very High' };
    }
  }, [type, value]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="max-w-[170px] select-none"
      >
        {/* Background Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255, 255, 255, 0.05)"
          className="light:stroke-slate-200"
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
          transition={{ duration: 1.5, ease: [0.25, 1, 0.5, 1] }}
          strokeLinecap="round"
          transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
        />

        {/* Value Inside */}
        <text
          x={cx}
          y={cy - 5}
          textAnchor="middle"
          className="text-4xl font-extrabold fill-white light:fill-slate-900 font-mono tracking-tighter"
        >
          {Math.round(value)}
        </text>

        {/* Label */}
        <text
          x={cx}
          y={cy + 18}
          textAnchor="middle"
          className="text-[9px] font-black tracking-widest uppercase fill-white/40 light:fill-slate-400"
        >
          {label}
        </text>

        {/* Status Text */}
        <text
          x={cx}
          y={cy + 32}
          textAnchor="middle"
          className="text-[10px] font-bold tracking-wide uppercase"
          fill={themeColors.stroke}
        >
          {themeColors.text}
        </text>
      </svg>

      {subtitle && (
        <span className="text-[10px] font-bold text-white/30 light:text-slate-400 uppercase tracking-widest mt-1 block text-center">
          {subtitle}
        </span>
      )}
    </div>
  );
}
