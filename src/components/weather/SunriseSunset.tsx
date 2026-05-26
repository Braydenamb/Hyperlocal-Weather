'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import { format, parseISO, differenceInMinutes } from 'date-fns';

interface SunriseSunsetProps {
  sunrise: string;
  sunset: string;
  className?: string;
}

export default function SunriseSunset({ sunrise, sunset, className = '' }: SunriseSunsetProps) {
  const { sunriseTime, sunsetTime, progress, sunX, sunY } = useMemo(() => {
    const sr = parseISO(sunrise);
    const ss = parseISO(sunset);
    const now = new Date();

    const totalMinutes = differenceInMinutes(ss, sr);
    const elapsedMinutes = differenceInMinutes(now, sr);
    const prog = Math.max(0, Math.min(1, elapsedMinutes / totalMinutes));

    const arcWidth = 240;
    const arcHeight = 80;
    const startX = 30;
    const endX = startX + arcWidth;
    const baseY = 100;

    const t = prog;
    const x = startX + t * arcWidth;
    const y = baseY - Math.sin(t * Math.PI) * arcHeight;

    return {
      sunriseTime: format(sr, 'h:mm a'),
      sunsetTime: format(ss, 'h:mm a'),
      progress: prog,
      sunX: x,
      sunY: y,
    };
  }, [sunrise, sunset]);

  const arcPath = useMemo(() => {
    const arcWidth = 240;
    const arcHeight = 80;
    const startX = 30;
    const baseY = 100;
    const points: string[] = [];

    for (let i = 0; i <= 50; i++) {
      const t = i / 50;
      const x = startX + t * arcWidth;
      const y = baseY - Math.sin(t * Math.PI) * arcHeight;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }

    return points.join(' ');
  }, []);

  const filledPath = useMemo(() => {
    const arcWidth = 240;
    const arcHeight = 80;
    const startX = 30;
    const baseY = 100;
    const steps = Math.max(1, Math.floor(50 * progress));
    const points: string[] = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / 50;
      const x = startX + t * arcWidth;
      const y = baseY - Math.sin(t * Math.PI) * arcHeight;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }

    return points.join(' ');
  }, [progress]);

  const isDayTime = progress > 0 && progress < 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl ${className}`}
    >
      <p className="mb-2 text-xs font-medium tracking-wider text-white/50 uppercase">
        Sunrise & Sunset
      </p>

      <svg viewBox="0 0 300 130" className="w-full" aria-label="Sun position arc">
        <defs>
          <linearGradient id="arcGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="arcFill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Horizon line */}
        <line x1="20" y1="100" x2="280" y2="100" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4,4" />

        {/* Background arc */}
        <path d={arcPath} stroke="rgba(255,255,255,0.1)" strokeWidth="2" fill="none" />

        {/* Filled progress arc */}
        {isDayTime && (
          <path d={filledPath} stroke="url(#arcFill)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        )}

        {/* Sun indicator */}
        {isDayTime && (
          <g>
            <motion.circle
              cx={sunX}
              cy={sunY}
              r="16"
              fill="url(#sunGlow)"
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            <circle cx={sunX} cy={sunY} r="5" fill="#FBBF24" />
            <circle cx={sunX} cy={sunY} r="3" fill="#FDE68A" />
          </g>
        )}

        {/* Sunrise marker */}
        <circle cx="30" cy="100" r="3" fill="rgba(251,191,36,0.5)" />
        {/* Sunset marker */}
        <circle cx="270" cy="100" r="3" fill="rgba(249,115,22,0.5)" />
      </svg>

      <div className="mt-1 flex items-center justify-between px-2">
        <div className="flex items-center gap-1.5">
          <Sunrise size={14} className="text-amber-400" />
          <span className="text-xs font-medium text-white/70">{sunriseTime}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sunset size={14} className="text-orange-400" />
          <span className="text-xs font-medium text-white/70">{sunsetTime}</span>
        </div>
      </div>
    </motion.div>
  );
}
