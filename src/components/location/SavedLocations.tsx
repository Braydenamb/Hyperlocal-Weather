'use client';

import { MapPin, Star, X } from 'lucide-react';
import { useLocationStore } from '@/stores/locationStore';
import { motion, AnimatePresence } from 'framer-motion';

export default function SavedLocations() {
  const { savedLocations, removeSavedLocation, setCurrentLocation, currentLocation } =
    useLocationStore();

  if (savedLocations.length === 0) {
    return (
      <div className="text-center py-6">
        <Star className="w-8 h-8 text-white/15 mx-auto mb-2" />
        <p className="text-xs text-white/30">No saved locations</p>
        <p className="text-[10px] text-white/20 mt-1">Star locations to save them</p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <AnimatePresence mode="popLayout">
        {savedLocations.map((loc) => {
          const isActive = currentLocation?.id === loc.id;
          return (
            <motion.button
              key={loc.id}
              layout
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8, scale: 0.95 }}
              onClick={() => setCurrentLocation(loc)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors group ${
                isActive
                  ? 'bg-cyan/10 text-cyan'
                  : 'text-[var(--color-foreground)] hover:bg-white/5'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-cyan' : 'text-white/30'}`} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{loc.name}</div>
                <div className="text-[10px] text-white/30 truncate">{loc.country}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeSavedLocation(loc.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-white/10 transition-all"
                aria-label={`Remove ${loc.name}`}
              >
                <X className="w-3 h-3 text-white/40" />
              </button>
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
