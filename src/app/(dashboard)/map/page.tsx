'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import { CloudRain, Compass, Plus, Info } from 'lucide-react';
import MapControls from '@/components/map/MapControls';
import CommunityReportForm from '@/components/weather/CommunityReportForm';
import { useLocationStore } from '@/stores/locationStore';

// Dynamically import WeatherMap with ssr disabled to prevent window object reference errors
const WeatherMap = dynamic(() => import('@/components/map/WeatherMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-[#0B1020]/40 rounded-3xl border border-white/5 animate-pulse">
      <Compass className="w-12 h-12 text-cyan/40 animate-spin mb-3" />
      <p className="text-sm text-white/40 font-medium">Assembling street-level maps...</p>
    </div>
  ),
});

export default function MapPage() {
  const currentLocation = useLocationStore((s) => s.currentLocation);
  const [activeLayer, setActiveLayer] = useState('radar');
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [mapKey, setMapKey] = useState(0); // Trigger map reload on action

  const handleRecenter = () => {
    if (currentLocation) {
      // Force trigger map auto-centering
      useLocationStore.getState().setCurrentLocation({ ...currentLocation });
    }
  };

  const handleZoomIn = () => {
    // Zoom behaviors handled natively or through triggering map key re-renders if necessary
  };

  const handleZoomOut = () => {
  };

  const handleReportSubmitted = () => {
    // Reload map markers by updating the key
    setMapKey((k) => k + 1);
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] min-h-[450px] relative flex flex-col">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-wide flex items-center gap-2">
            <CloudRain className="w-5 h-5 text-cyan" />
            Hyperlocal Street Radar
          </h1>
          <p className="text-xs text-white/40 mt-0.5">
            Real-time radar sweeps blended with user report heatmaps
          </p>
        </div>
        
        {/* Submit Report Trigger */}
        <button
          onClick={() => setIsReportOpen(true)}
          className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover font-bold text-sm text-[#060814] shadow-lg hover:shadow-cyan/15 transition-all duration-200 focus-ring"
        >
          <Plus className="w-4.5 h-4.5 stroke-[3px]" />
          Submit Alert
        </button>
      </div>

      {/* Main Map Container */}
      <div className="flex-1 relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-[#0B1020]/25 backdrop-blur-xl">
        <WeatherMap key={mapKey} showRadar={activeLayer === 'radar'} />

        {/* Dynamic Controls Overlay */}
        <MapControls
          activeLayer={activeLayer}
          setActiveLayer={setActiveLayer}
          onRecenter={handleRecenter}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
        />

        {/* Small floating info banner */}
        <div className="absolute top-4 right-4 z-20 glass-panel px-3 py-1.5 rounded-full border border-white/8 bg-[#0B1020]/80 backdrop-blur-xl pointer-events-none flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan animate-pulse"></div>
          <span className="text-[10px] font-bold text-white/70 uppercase tracking-widest">
            Station Active
          </span>
        </div>
      </div>

      {/* Form Submission Modal */}
      <CommunityReportForm
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onReportSubmitted={handleReportSubmitted}
      />
    </div>
  );
}
