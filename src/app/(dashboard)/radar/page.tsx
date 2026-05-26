'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Compass, Play, Pause, FastForward, Info, Layers } from 'lucide-react';
import { useLocationStore } from '@/stores/locationStore';

// Dynamically import WeatherMap with ssr disabled to prevent window object reference errors
const WeatherMap = dynamic(() => import('@/components/map/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#0B1020]/40 rounded-3xl border border-white/5 animate-pulse">
      <Compass className="w-12 h-12 text-cyan/40 animate-spin mb-3" />
      <p className="text-sm text-white/40 font-medium">Powering radar arrays...</p>
    </div>
  ),
});

export default function RadarPage() {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1); // 1x, 2x, 4x simulation speed

  const handlePlayToggle = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedToggle = () => {
    if (speed === 1) setSpeed(2);
    else if (speed === 2) setSpeed(4);
    else setSpeed(1);
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[450px] relative flex flex-col">
      {/* Page Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-cyan" />
            Simulated Radar Sweeper
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Hyperlocal wind-direction modeling & precipitation sweep rates
          </p>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B1020]/25 backdrop-blur-xl">
        <WeatherMap showRadar={isPlaying} />

        {/* Floating Animation Control Overlay */}
        <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-3">
          <div className="glass-panel p-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-white/8 bg-[#0B1020]/80 backdrop-blur-xl">
            <button
              onClick={handlePlayToggle}
              className="p-2 rounded-xl text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all duration-150 focus-ring"
              title={isPlaying ? "Pause Simulation" : "Start Simulation"}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-cyan" /> : <Play className="w-4 h-4 text-emerald-400" />}
            </button>
            <div className="h-4 w-px bg-white/10 mx-0.5"></div>
            <button
              onClick={handleSpeedToggle}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white/60 hover:text-white hover:bg-white/5 transition-all duration-150 focus-ring"
              title="Simulation Speed"
            >
              <FastForward className="w-3.5 h-3.5" />
              {speed}x
            </button>
          </div>
        </div>

        {/* Sidebar Legend Overlay */}
        <div className="absolute top-4 left-4 z-20 glass-panel p-4 rounded-2xl border border-white/8 bg-[#0B1020]/80 backdrop-blur-xl max-w-[200px] pointer-events-none select-none">
          <h4 className="text-xs font-bold text-white tracking-wider uppercase mb-3 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan" />
            Intensity Legend
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-semibold text-white/60">
              <div className="w-3 h-3 rounded bg-red-500/70 border border-red-500/20"></div>
              <span>Heavy (Storm / Hail)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-white/60">
              <div className="w-3 h-3 rounded bg-yellow-500/60 border border-yellow-500/20"></div>
              <span>Moderate (Rain)</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-semibold text-white/60">
              <div className="w-3 h-3 rounded bg-green-500/50 border border-green-500/20"></div>
              <span>Light (Drizzle / Mist)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
