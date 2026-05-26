// ============================================================
// Core Location Types
// ============================================================

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface LocationData extends Coordinates {
  name: string;
  country: string | null;
  countryCode: string | null;
  admin1: string | null; // State/Province
  admin2: string | null; // County/District
  timezone: string | null;
  elevation: number | null;
}

// ============================================================
// Default Location (New York City)
// ============================================================

export const DEFAULT_LOCATION: LocationData = {
  latitude: 40.7128,
  longitude: -74.006,
  name: "New York",
  country: "United States",
  countryCode: "US",
  admin1: "New York",
  admin2: null,
  timezone: "America/New_York",
  elevation: 10,
};

// ============================================================
// Saved / Recent Location Types
// ============================================================

export interface SavedLocationData extends LocationData {
  id: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: Date;
}

export interface RecentSearch {
  location: LocationData;
  searchedAt: Date;
}

// ============================================================
// Geolocation State
// ============================================================

export type GeolocationPermission = "prompt" | "granted" | "denied" | "unsupported";

export interface GeolocationState {
  coordinates: Coordinates | null;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationError | null;
  permission: GeolocationPermission;
  isLoading: boolean;
}

export interface GeolocationError {
  code: GeolocationErrorCode;
  message: string;
}

export type GeolocationErrorCode =
  | "PERMISSION_DENIED"
  | "POSITION_UNAVAILABLE"
  | "TIMEOUT"
  | "NOT_SUPPORTED";

// ============================================================
// Open-Meteo Geocoding API Types
// ============================================================

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation: number | null;
  feature_code: string;
  country_code: string;
  country: string;
  country_id: number;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  admin1_id?: number;
  admin2_id?: number;
  admin3_id?: number;
  admin4_id?: number;
  timezone: string;
  population?: number;
  postcodes?: string[];
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms: number;
}

// ============================================================
// Location Search State
// ============================================================

export interface LocationSearchState {
  query: string;
  results: LocationData[];
  isSearching: boolean;
  error: string | null;
}

// ============================================================
// Utility: Display name for a location
// ============================================================

export function formatLocationName(location: LocationData): string {
  const parts: string[] = [location.name];
  if (location.admin1) parts.push(location.admin1);
  if (location.country) parts.push(location.country);
  return parts.join(", ");
}

/** Distance between two coordinates in km (Haversine formula) */
export function distanceBetween(a: Coordinates, b: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aCalc =
    sinDLat * sinDLon +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLon * sinDLon;
  // Fix: use proper Haversine
  const aHav =
    sinDLat * sinDLat +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(aHav), Math.sqrt(1 - aHav));
  return R * c;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}
