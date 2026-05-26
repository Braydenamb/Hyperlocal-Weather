'use client';

import { motion } from 'framer-motion';
import { ZoomIn, ZoomOut, Compass, Layers, CloudRain, Wind, Eye } from 'lucide-react';
import clsx from 'clsx';

interface MapControlsProps {
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
  onRecenter: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

export default function MapControls({
  activeLayer,
  setActiveLayer,
  onRecenter,
  onZoomIn,
  onZoomOut,
}: MapControlsProps) {
  const layers = [
    { id: 'radar', name: 'Live Radar', icon: CloudRain },
    { id: 'wind', name: 'Wind Model', icon: Wind },
    { id: 'satellite', name: 'Satellite', icon: Eye },
  ];

  return (
    <div className="absolute bottom-6 left-6 z-20 flex flex-col gap-3">
      {/* Layer Toggles Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-2.5 rounded-2xl flex items-center gap-1.5 shadow-2xl border border-white/8 bg-[#0B1020]/80 backdrop-blur-xl"
      >
        <span className="p-2 text-white/40">
          <Layers className="w-4 h-4" />
        </span>
        <div className="h-4 w-px bg-white/10 mx-0.5"></div>
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              className={clsx(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 focus-ring',
                isActive
                  ? 'bg-cyan/15 border border-cyan/30 text-cyan shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                  : 'border border-transparent text-white/60 hover:text-white/90 hover:bg-white/5'
              )}
            >
              <Icon className="w-3.5 h-3.5" />
              {layer.name}
            </button>
          );
        })}
      </motion.div>

      {/* Navigation Tools Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="glass-panel p-1.5 rounded-2xl flex gap-1 shadow-2xl border border-white/8 bg-[#0B1020]/80 backdrop-blur-xl self-start"
      >
        <button
          onClick={onZoomIn}
          className="p-2 rounded-xl text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all duration-150 focus-ring"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 rounded-xl text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all duration-150 focus-ring"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <div className="w-px bg-white/10 my-1 mx-0.5"></div>
        <button
          onClick={onRecenter}
          className="p-2 rounded-xl text-white/60 hover:text-cyan hover:bg-cyan/10 transition-all duration-150 focus-ring"
          title="Recenter Map"
        >
          <Compass className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}
