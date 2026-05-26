'use client';

import { useState, useEffect } from 'react';
import type { Location } from '@/types';

export function useLocationSearch(query: string) {
  const [results, setResults] = useState<Location[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();
    const debounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`,
          { signal: controller.signal }
        );
        const data = await res.json();
        const locations: Location[] = (data.results ?? []).map(
          (r: { id: number; name: string; country: string; latitude: number; longitude: number; admin1?: string }) => ({
            id: String(r.id),
            name: r.name,
            country: r.country,
            latitude: r.latitude,
            longitude: r.longitude,
            admin1: r.admin1,
          })
        );
        setResults(locations);
      } catch {
        // Aborted or error
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [query]);

  return { results, isSearching };
}
