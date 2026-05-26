'use client';

import { useState } from 'react';
import {
  Thermometer,
  CloudRain,
  Wind,
  Cloud,
  Gauge,
  MapPin,
} from 'lucide-react';
import SavedLocations from '@/components/location/SavedLocations';
import clsx from 'clsx';

const weatherLayers = [
  { id: 'temperature', label: 'Temperature', icon: Thermometer, color: '#EF4444' },
  { id: 'precipitation', label: 'Precipitation', icon: CloudRain, color: '#3B82F6' },
  { id: 'wind', label: 'Wind', icon: Wind, color: '#22C55E' },
  { id: 'clouds', label: 'Clouds', icon: Cloud, color: '#94A3B8' },
  { id: 'pressure', label: 'Pressure', icon: Gauge, color: '#A78BFA' },
];

const timeFilters = [
  { id: 'today', label: 'Today' },
  { id: '3days', label: '3 Days' },
  { id: '7days', label: '7 Days' },
];

export default function RightPanel() {
  const [activeLayers, setActiveLayers] = useState<Set<string>>(
    new Set(['temperature', 'precipitation'])
  );
  const [activeTime, setActiveTime] = useState('today');

  function toggleLayer(id: string) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <aside className="hidden xl:flex flex-col w-[280px] h-full glass-sidebar border-l border-white/6 border-r-0 overflow-y-auto">
      {/* Saved Locations */}
      <div className="p-4 border-b border-white/6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-4 h-4 text-cyan" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50">
            Saved Locations
          </h3>
        </div>
        <SavedLocations />
      </div>

      {/* Weather Layers */}
      <div className="p-4 border-b border-white/6">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
          Weather Layers
        </h3>
        <div className="space-y-1.5">
          {weatherLayers.map((layer) => {
            const Icon = layer.icon;
            const isActive = activeLayers.has(layer.id);
            return (
              <button
                key={layer.id}
                onClick={() => toggleLayer(layer.id)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                  isActive
                    ? 'bg-white/8 text-[var(--color-foreground)]'
                    : 'text-white/40 hover:text-white/60 hover:bg-white/3'
                )}
              >
                <div
                  className={clsx(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all',
                    isActive ? 'bg-white/10' : 'bg-white/3'
                  )}
                >
                  <Icon
                    className="w-4 h-4"
                    style={{ color: isActive ? layer.color : undefined }}
                  />
                </div>
                <span className="flex-1 text-left font-medium">{layer.label}</span>
                <div
                  className={clsx(
                    'w-4 h-4 rounded-md border-2 transition-all duration-200',
                    isActive
                      ? 'border-cyan bg-cyan'
                      : 'border-white/20 bg-transparent'
                  )}
                >
                  {isActive && (
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      className="w-full h-full text-white"
                    >
                      <path
                        d="M4 8l3 3 5-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time Filter */}
      <div className="p-4">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">
          Time Range
        </h3>
        <div className="flex gap-1.5 p-1 rounded-xl bg-white/4">
          {timeFilters.map((tf) => (
            <button
              key={tf.id}
              onClick={() => setActiveTime(tf.id)}
              className={clsx(
                'flex-1 py-2 rounded-lg text-xs font-semibold transition-all duration-200',
                activeTime === tf.id
                  ? 'bg-cyan/15 text-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'text-white/40 hover:text-white/60'
              )}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
