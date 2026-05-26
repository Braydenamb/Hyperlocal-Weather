'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherStore } from '@/stores/weatherStore';

interface HeatmapCell {
  dayName: string;
  hourLabel: string;
  value: number;
  intensity: number; // Normalized 0-1
}

export default function WeatherHeatmap({ className = '' }: { className?: string }) {
  const { hourlyForecast, dailyForecast } = useWeatherStore();
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const hourSteps = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22];
  const hourLabels = ['12a', '2a', '4a', '6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p'];

  const { cells } = useMemo(() => {
    if (!hourlyForecast || !dailyForecast) return { cells: [], minVal: 0, maxVal: 0 };

    const temps = hourlyForecast.temperature;
    const minVal = Math.min(...temps);
    const maxVal = Math.max(...temps);
    const range = maxVal - minVal;

    const list: HeatmapCell[][] = [];

    // Map 7 days
    for (let d = 0; d < 7; d++) {
      const dayName = new Date(dailyForecast.time[d]).toLocaleDateString('en-US', { weekday: 'short' });
      const row: HeatmapCell[] = [];

      // Map 12 bi-hourly steps
      hourSteps.forEach((h, idx) => {
        const index = d * 24 + h;
        const val = temps[index] ?? 0;
        const intensity = range > 0 ? (val - minVal) / range : 0.5;

        row.push({
          dayName,
          hourLabel: hourLabels[idx],
          value: val,
          intensity,
        });
      });

      list.push(row);
    }

    return { cells: list, minVal, maxVal };
  }, [hourlyForecast, dailyForecast]);

  if (!cells.length) {
    return (
      <div className={`flex w-full h-full min-h-[180px] items-center justify-center ${className}`}>
        <span className="text-xs font-semibold text-white/30 tracking-wider uppercase">
          No microclimate logs
        </span>
      </div>
    );
  }

  // Calculate semantic color based on intensity
  function getHeatmapColor(intensity: number): string {
    if (intensity < 0.25) {
      // Very cool (Cyan-Teal)
      return `rgba(6, 182, 212, ${0.15 + intensity * 2.2})`;
    } else if (intensity < 0.6) {
      // Mild (Sky-Electric)
      return `rgba(59, 130, 246, ${0.25 + (intensity - 0.25) * 1.6})`;
    } else if (intensity < 0.8) {
      // Warm (Amber)
      return `rgba(245, 158, 11, ${0.35 + (intensity - 0.6) * 2.2})`;
    } else {
      // Hot (Orange-Red)
      return `rgba(239, 68, 68, ${0.55 + (intensity - 0.8) * 2.2})`;
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    const bounds = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - bounds.left + 15,
      y: e.clientY - bounds.top - 55,
    });
  }

  return (
    <div
      className={`w-full relative select-none ${className}`}
      onMouseMove={handleMouseMove}
    >
      <div className="flex flex-col gap-2.5 w-full min-w-[300px]">
        {/* Hour Header labels */}
        <div className="flex items-center w-full">
          <div className="w-10 text-[9px] font-bold text-white/30 uppercase tracking-widest text-center flex-shrink-0" />
          <div className="flex-1 grid grid-cols-12 gap-1 text-center">
            {hourLabels.map((lbl) => (
              <span key={lbl} className="text-[9px] font-bold text-white/30 light:text-slate-400 uppercase tracking-widest">
                {lbl}
              </span>
            ))}
          </div>
        </div>

        {/* Heatmap Grid rows */}
        <div className="flex flex-col gap-1.5 w-full">
          {cells.map((row, rIdx) => (
            <div key={rIdx} className="flex items-center w-full">
              {/* Day row title */}
              <span className="w-10 text-xs font-black text-white/50 light:text-slate-500 text-center flex-shrink-0">
                {row[0].dayName}
              </span>

              {/* Hourly block grid */}
              <div className="flex-1 grid grid-cols-12 gap-1.5">
                {row.map((cell, cIdx) => (
                  <motion.div
                    key={cIdx}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    whileHover={{ scale: 1.2, zIndex: 10 }}
                    transition={{ type: 'spring', stiffness: 450, damping: 20 }}
                    className="aspect-square rounded-md cursor-pointer transition-shadow shadow-sm hover:shadow-md"
                    style={{
                      backgroundColor: getHeatmapColor(cell.intensity),
                      border: '1px solid var(--border)',
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Tooltip Overlay */}
      <AnimatePresence>
        {hoveredCell && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="absolute pointer-events-none z-30 glass-panel px-3 py-2 shadow-xl bg-slate-950/80 backdrop-blur-xl border border-white/5 text-xs flex flex-col font-sans"
            style={{
              left: tooltipPos.x,
              top: tooltipPos.y,
            }}
          >
            <span className="font-black text-white/40 uppercase tracking-widest text-[9px] mb-0.5">
              {hoveredCell.dayName} @ {hoveredCell.hourLabel}
            </span>
            <span className="text-sm font-extrabold text-white">
              {hoveredCell.value.toFixed(1)}°C
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
