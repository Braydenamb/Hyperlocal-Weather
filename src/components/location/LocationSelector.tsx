'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Navigation } from 'lucide-react';
import { useLocationSearch } from '@/hooks/useLocationSearch';
import { useLocationStore } from '@/stores/locationStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import type { Location } from '@/types';
import clsx from 'clsx';

export default function LocationSelector() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { results, isSearching } = useLocationSearch(query);
  const { currentLocation, setCurrentLocation, addRecentSearch, recentSearches } =
    useLocationStore();
  const { getCurrentPosition, position, isLoading: geoLoading } = useGeolocation();

  useEffect(() => {
    if (position) {
      const geoLocation: Location = {
        id: `geo-${position.latitude}-${position.longitude}`,
        name: 'Current Location',
        country: '',
        latitude: position.latitude,
        longitude: position.longitude,
      };
      setCurrentLocation(geoLocation);
      setIsOpen(false);
    }
  }, [position, setCurrentLocation]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleSelect(location: Location) {
    setCurrentLocation(location);
    addRecentSearch(location);
    setQuery('');
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <div
        className={clsx(
          'flex items-center gap-2 glass-input px-3 py-2 cursor-text',
          isOpen && 'border-cyan shadow-[0_0_0_3px_rgba(6,182,212,0.15)]'
        )}
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        <Search className="w-4 h-4 text-white/40 flex-shrink-0" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={currentLocation?.name ?? 'Search location...'}
          className="flex-1 bg-transparent text-sm text-[var(--color-foreground)] placeholder:text-white/30 outline-none"
        />
        {isSearching && <Loader2 className="w-4 h-4 text-cyan animate-spin" />}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 glass-panel p-2 z-50 max-h-72 overflow-y-auto"
          >
            {/* Use My Location */}
            <button
              onClick={() => getCurrentPosition()}
              disabled={geoLoading}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-cyan hover:bg-cyan/10 transition-colors"
            >
              {geoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              <span>Use my location</span>
            </button>

            {/* Search Results */}
            {results.length > 0 && (
              <div className="mt-1">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                  Results
                </div>
                {results.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-foreground)] hover:bg-white/5 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{loc.name}</div>
                      <div className="text-xs text-white/40 truncate">
                        {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Recent Searches */}
            {query.length < 2 && recentSearches.length > 0 && (
              <div className="mt-1">
                <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-white/30 font-semibold">
                  Recent
                </div>
                {recentSearches.map((loc) => (
                  <button
                    key={loc.id}
                    onClick={() => handleSelect(loc)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[var(--color-foreground)] hover:bg-white/5 transition-colors text-left"
                  >
                    <MapPin className="w-4 h-4 text-white/30 flex-shrink-0" />
                    <span className="truncate">{loc.name}</span>
                    <span className="text-xs text-white/30 ml-auto flex-shrink-0">{loc.country}</span>
                  </button>
                ))}
              </div>
            )}

            {query.length >= 2 && results.length === 0 && !isSearching && (
              <div className="px-3 py-4 text-sm text-white/30 text-center">
                No locations found
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
