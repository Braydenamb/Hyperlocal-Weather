'use client';

import { motion } from 'framer-motion';

interface WeatherIconProps {
  weatherCode: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

function getCondition(code: number): string {
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly-cloudy';
  if (code === 3) return 'cloudy';
  if (code >= 45 && code <= 48) return 'fog';
  if (code >= 51 && code <= 57) return 'drizzle';
  if (code >= 61 && code <= 67) return 'rain';
  if (code >= 71 && code <= 77) return 'snow';
  if (code >= 80 && code <= 82) return 'rain';
  if (code >= 85 && code <= 86) return 'snow';
  if (code >= 95 && code <= 99) return 'thunderstorm';
  return 'clear';
}

function ClearSky({ isDay, size }: { isDay: boolean; size: number }) {
  if (isDay) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
        <motion.circle
          cx="32"
          cy="32"
          r="14"
          fill="url(#sunGrad)"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <motion.line
            key={angle}
            x1={32 + Math.cos((angle * Math.PI) / 180) * 20}
            y1={32 + Math.sin((angle * Math.PI) / 180) * 20}
            x2={32 + Math.cos((angle * Math.PI) / 180) * 26}
            y2={32 + Math.sin((angle * Math.PI) / 180) * 26}
            stroke="#FBBF24"
            strokeWidth="2.5"
            strokeLinecap="round"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: angle * 0.002,
            }}
          />
        ))}
        <defs>
          <radialGradient id="sunGrad">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </radialGradient>
        </defs>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <motion.circle
        cx="30"
        cy="32"
        r="14"
        fill="url(#moonGrad)"
        animate={{ scale: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <circle cx="36" cy="28" r="12" fill="#0B1020" />
      {[
        { cx: 18, cy: 20, r: 1.2 },
        { cx: 48, cy: 16, r: 0.8 },
        { cx: 50, cy: 40, r: 1 },
        { cx: 12, cy: 44, r: 0.7 },
        { cx: 40, cy: 50, r: 0.9 },
      ].map((star, i) => (
        <motion.circle
          key={i}
          cx={star.cx}
          cy={star.cy}
          r={star.r}
          fill="#E2E8F0"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
      <defs>
        <radialGradient id="moonGrad">
          <stop offset="0%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CloudIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <motion.g
        animate={{ x: [0, 3, 0, -3, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="32" cy="34" rx="18" ry="10" fill="url(#cloudGrad)" opacity="0.9" />
        <circle cx="24" cy="28" r="10" fill="url(#cloudGrad)" />
        <circle cx="36" cy="26" r="12" fill="url(#cloudGrad)" />
      </motion.g>
      <defs>
        <linearGradient id="cloudGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PartlyCloudyIcon({ isDay, size }: { isDay: boolean; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {isDay ? (
        <motion.circle
          cx="22"
          cy="22"
          r="10"
          fill="#FBBF24"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      ) : (
        <>
          <motion.circle cx="20" cy="20" r="9" fill="#CBD5E1"
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <circle cx="24" cy="17" r="8" fill="#0B1020" />
        </>
      )}
      <motion.g
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="36" cy="38" rx="16" ry="9" fill="url(#pcGrad)" opacity="0.95" />
        <circle cx="28" cy="32" r="9" fill="url(#pcGrad)" />
        <circle cx="40" cy="30" r="10" fill="url(#pcGrad)" />
      </motion.g>
      <defs>
        <linearGradient id="pcGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RainIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <motion.g
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="32" cy="26" rx="16" ry="9" fill="#94A3B8" opacity="0.9" />
        <circle cx="24" cy="20" r="9" fill="#94A3B8" />
        <circle cx="36" cy="18" r="10" fill="#94A3B8" />
      </motion.g>
      {[
        { x: 22, delay: 0 },
        { x: 30, delay: 0.3 },
        { x: 38, delay: 0.6 },
      ].map(({ x, delay }) => (
        <motion.line
          key={x}
          x1={x}
          y1={36}
          x2={x - 3}
          y2={48}
          stroke="#60A5FA"
          strokeWidth="2"
          strokeLinecap="round"
          animate={{ y: [0, 6, 0], opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, delay }}
        />
      ))}
    </svg>
  );
}

function ThunderstormIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <motion.g
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="32" cy="22" rx="16" ry="9" fill="#64748B" opacity="0.95" />
        <circle cx="24" cy="16" r="9" fill="#64748B" />
        <circle cx="36" cy="14" r="10" fill="#64748B" />
      </motion.g>
      <motion.polygon
        points="30,30 34,38 28,38 33,50 26,40 32,40 28,30"
        fill="#FBBF24"
        animate={{ opacity: [1, 0.3, 1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {[
        { x: 20, delay: 0.2 },
        { x: 42, delay: 0.5 },
      ].map(({ x, delay }) => (
        <motion.line
          key={x}
          x1={x}
          y1={32}
          x2={x - 2}
          y2={44}
          stroke="#60A5FA"
          strokeWidth="1.5"
          strokeLinecap="round"
          animate={{ y: [0, 5, 0], opacity: [0.8, 0.2, 0.8] }}
          transition={{ duration: 1, repeat: Infinity, delay }}
        />
      ))}
    </svg>
  );
}

function SnowIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <motion.g
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="32" cy="24" rx="16" ry="9" fill="#CBD5E1" opacity="0.9" />
        <circle cx="24" cy="18" r="9" fill="#CBD5E1" />
        <circle cx="36" cy="16" r="10" fill="#CBD5E1" />
      </motion.g>
      {[
        { cx: 22, cy: 40, delay: 0 },
        { cx: 32, cy: 44, delay: 0.4 },
        { cx: 42, cy: 38, delay: 0.8 },
        { cx: 27, cy: 50, delay: 1.2 },
        { cx: 37, cy: 52, delay: 0.6 },
      ].map(({ cx, cy, delay }) => (
        <motion.circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="2.5"
          fill="#E2E8F0"
          animate={{ y: [0, 6, 0], opacity: [1, 0.4, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay }}
        />
      ))}
    </svg>
  );
}

function FogIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      {[20, 28, 36, 44].map((y, i) => (
        <motion.line
          key={y}
          x1={12 + i * 2}
          y1={y}
          x2={52 - i * 2}
          y2={y}
          stroke="#94A3B8"
          strokeWidth="3"
          strokeLinecap="round"
          animate={{ x: [0, 4, 0, -4, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}
    </svg>
  );
}

function DrizzleIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <motion.g
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="32" cy="26" rx="16" ry="9" fill="#94A3B8" opacity="0.85" />
        <circle cx="24" cy="20" r="9" fill="#94A3B8" />
        <circle cx="36" cy="18" r="10" fill="#94A3B8" />
      </motion.g>
      {[
        { x: 20, y: 36, delay: 0 },
        { x: 28, y: 40, delay: 0.3 },
        { x: 36, y: 36, delay: 0.6 },
        { x: 44, y: 40, delay: 0.9 },
        { x: 24, y: 46, delay: 0.15 },
        { x: 32, y: 50, delay: 0.45 },
        { x: 40, y: 46, delay: 0.75 },
      ].map(({ x, y, delay }) => (
        <motion.circle
          key={`${x}-${y}`}
          cx={x}
          cy={y}
          r="1.2"
          fill="#93C5FD"
          animate={{ y: [0, 4, 0], opacity: [0.8, 0.3, 0.8] }}
          transition={{ duration: 1.5, repeat: Infinity, delay }}
        />
      ))}
    </svg>
  );
}

export default function WeatherIcon({
  weatherCode,
  isDay = true,
  size = 64,
  className = '',
}: WeatherIconProps) {
  const condition = getCondition(weatherCode);

  const iconMap: Record<string, React.ReactNode> = {
    'clear': <ClearSky isDay={isDay} size={size} />,
    'partly-cloudy': <PartlyCloudyIcon isDay={isDay} size={size} />,
    'cloudy': <CloudIcon size={size} />,
    'fog': <FogIcon size={size} />,
    'drizzle': <DrizzleIcon size={size} />,
    'rain': <RainIcon size={size} />,
    'snow': <SnowIcon size={size} />,
    'thunderstorm': <ThunderstormIcon size={size} />,
  };

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      {iconMap[condition] ?? <ClearSky isDay={isDay} size={size} />}
    </div>
  );
}

export { getCondition };
