import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Location } from '@/types';

interface LocationStore {
  currentLocation: Location | null;
  savedLocations: Location[];
  recentSearches: Location[];
  setCurrentLocation: (location: Location) => void;
  addSavedLocation: (location: Location) => void;
  removeSavedLocation: (id: string) => void;
  addRecentSearch: (location: Location) => void;
}

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      currentLocation: null,
      savedLocations: [],
      recentSearches: [],
      setCurrentLocation: (location) => set({ currentLocation: location }),
      addSavedLocation: (location) =>
        set((state) => {
          if (state.savedLocations.some((l) => l.id === location.id)) return state;
          return { savedLocations: [...state.savedLocations, location] };
        }),
      removeSavedLocation: (id) =>
        set((state) => ({
          savedLocations: state.savedLocations.filter((l) => l.id !== id),
        })),
      addRecentSearch: (location) =>
        set((state) => {
          const filtered = state.recentSearches.filter((l) => l.id !== location.id);
          return { recentSearches: [location, ...filtered].slice(0, 5) };
        }),
    }),
    { name: 'hyperweather-locations' }
  )
);
