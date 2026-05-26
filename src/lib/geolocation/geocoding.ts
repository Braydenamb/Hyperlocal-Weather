import type {
  GeocodingResponse,
  GeocodingResult,
  LocationData,
} from "@/types/location";

// ============================================================
// Configuration
// ============================================================

const GEOCODING_BASE_URL =
  process.env.NEXT_PUBLIC_OPEN_METEO_GEOCODING_URL ??
  "https://geocoding-api.open-meteo.com/v1";

const GEOCODING_CACHE_MS = Number(
  process.env.NEXT_PUBLIC_GEOCODING_CACHE_MS ?? "3600000"
);

// ============================================================
// In-Memory Cache
// ============================================================

interface GeocodingCacheEntry {
  results: LocationData[];
  fetchedAt: number;
  expiresAt: number;
}

const geocodingCache = new Map<string, GeocodingCacheEntry>();

function getCacheKey(query: string, count: number, language: string): string {
  return `${query.toLowerCase().trim()}:${count}:${language}`;
}

// ============================================================
// Transform
// ============================================================

function geocodingResultToLocation(result: GeocodingResult): LocationData {
  return {
    latitude: result.latitude,
    longitude: result.longitude,
    name: result.name,
    country: result.country,
    countryCode: result.country_code,
    admin1: result.admin1 ?? null,
    admin2: result.admin2 ?? null,
    timezone: result.timezone,
    elevation: result.elevation,
  };
}

// ============================================================
// API
// ============================================================

export interface GeocodingOptions {
  count?: number;
  language?: string;
  signal?: AbortSignal;
}

/**
 * Search for locations by name using the Open-Meteo Geocoding API.
 * Results are cached in memory for the configured duration.
 *
 * @param query Location search query (city name, zip code, etc.)
 * @param options Optional configuration
 * @returns Array of matching locations
 */
export async function searchLocations(
  query: string,
  options: GeocodingOptions = {}
): Promise<LocationData[]> {
  const { count = 10, language = "en", signal } = options;
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 2) return [];

  // Check cache
  const cacheKey = getCacheKey(trimmedQuery, count, language);
  const cached = geocodingCache.get(cacheKey);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.results;
  }

  // Build URL
  const url = new URL(`${GEOCODING_BASE_URL}/search`);
  url.searchParams.set("name", trimmedQuery);
  url.searchParams.set("count", String(count));
  url.searchParams.set("language", language);
  url.searchParams.set("format", "json");

  // Fetch
  const response = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error(
      `Geocoding API error: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as GeocodingResponse;
  const results = (data.results ?? []).map(geocodingResultToLocation);

  // Cache results
  const now = Date.now();
  geocodingCache.set(cacheKey, {
    results,
    fetchedAt: now,
    expiresAt: now + GEOCODING_CACHE_MS,
  });

  return results;
}

/**
 * Reverse geocode coordinates to a location name.
 * Uses the forward geocoding API with coordinates as query,
 * then finds the closest result.
 *
 * @param latitude Latitude
 * @param longitude Longitude
 * @returns The closest matching location, or a default entry
 */
export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<LocationData> {
  // Open-Meteo doesn't have a dedicated reverse geocoding endpoint,
  // so we use a coordinate-based search approach
  const query = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;

  try {
    const results = await searchLocations(query, { count: 1 });
    if (results.length > 0) {
      return results[0];
    }
  } catch {
    // Silently fall through to default
  }

  // Return a basic location with just coordinates
  return {
    latitude,
    longitude,
    name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    country: null,
    countryCode: null,
    admin1: null,
    admin2: null,
    timezone: null,
    elevation: null,
  };
}

/** Clear the geocoding cache */
export function clearGeocodingCache(): void {
  geocodingCache.clear();
}
