import type {
  OpenMeteoForecastResponse,
  OpenMeteoAirQualityResponse,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  AirQuality,
  AirQualityCategory,
  WeatherData,
  WMOWeatherCode,
  WeatherFetchError,
  WeatherFetchOptions,
} from "@/types/weather";
import type { Coordinates } from "@/types/location";

// ============================================================
// Configuration
// ============================================================

const FORECAST_BASE_URL =
  process.env.NEXT_PUBLIC_OPEN_METEO_BASE_URL ?? "https://api.open-meteo.com/v1";
const AIR_QUALITY_BASE_URL =
  process.env.NEXT_PUBLIC_OPEN_METEO_AIR_QUALITY_URL ??
  "https://air-quality-api.open-meteo.com/v1";

const DEFAULT_CACHE_MS = Number(
  process.env.NEXT_PUBLIC_WEATHER_CACHE_MS ?? "300000"
);
const DEFAULT_RETRY_COUNT = 3;
const DEFAULT_RETRY_DELAY_MS = 1000;

const CURRENT_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "apparent_temperature",
  "is_day",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "weather_code",
  "cloud_cover",
  "pressure_msl",
  "surface_pressure",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
].join(",");

const HOURLY_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "dew_point_2m",
  "apparent_temperature",
  "precipitation_probability",
  "precipitation",
  "rain",
  "showers",
  "snowfall",
  "snow_depth",
  "weather_code",
  "pressure_msl",
  "surface_pressure",
  "cloud_cover",
  "visibility",
  "wind_speed_10m",
  "wind_direction_10m",
  "wind_gusts_10m",
  "uv_index",
  "is_day",
].join(",");

const DAILY_PARAMS = [
  "weather_code",
  "temperature_2m_max",
  "temperature_2m_min",
  "apparent_temperature_max",
  "apparent_temperature_min",
  "sunrise",
  "sunset",
  "uv_index_max",
  "precipitation_sum",
  "rain_sum",
  "showers_sum",
  "snowfall_sum",
  "precipitation_hours",
  "precipitation_probability_max",
  "wind_speed_10m_max",
  "wind_gusts_10m_max",
  "wind_direction_10m_dominant",
].join(",");

const AIR_QUALITY_PARAMS = "us_aqi,pm10,pm2_5";

// ============================================================
// In-Memory Cache
// ============================================================

interface CacheEntry<T> {
  data: T;
  fetchedAt: number;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry<unknown>>();

function getCacheKey(prefix: string, coords: Coordinates): string {
  // Round to 2 decimal places to reduce cache fragmentation
  const lat = coords.latitude.toFixed(2);
  const lon = coords.longitude.toFixed(2);
  return `${prefix}:${lat},${lon}`;
}

function getFromCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data as T;
}

function setCache<T>(key: string, data: T, durationMs: number): void {
  const now = Date.now();
  memoryCache.set(key, {
    data,
    fetchedAt: now,
    expiresAt: now + durationMs,
  });
}

/** Clear all cached weather data */
export function clearWeatherCache(): void {
  memoryCache.clear();
}

// ============================================================
// Retry Logic
// ============================================================

async function fetchWithRetry(
  url: string,
  options: WeatherFetchOptions = {}
): Promise<Response> {
  const {
    signal,
    retryCount = DEFAULT_RETRY_COUNT,
    retryDelayMs = DEFAULT_RETRY_DELAY_MS,
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retryCount; attempt++) {
    try {
      const response = await fetch(url, {
        signal,
        headers: { Accept: "application/json" },
      });

      if (response.ok) return response;

      // Don't retry client errors (4xx) except 429
      if (response.status >= 400 && response.status < 500 && response.status !== 429) {
        throw createWeatherError(
          "API_ERROR",
          `Open-Meteo API returned ${response.status}: ${response.statusText}`,
          response.status,
          false
        );
      }

      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        throw createWeatherError("TIMEOUT", "Request was aborted", undefined, false);
      }

      if (
        error !== null &&
        typeof error === "object" &&
        "code" in error &&
        (error as WeatherFetchError).code !== undefined
      ) {
        throw error;
      }

      lastError = error instanceof Error ? error : new Error(String(error));
    }

    // Exponential backoff
    if (attempt < retryCount) {
      const delay = retryDelayMs * Math.pow(2, attempt);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw createWeatherError(
    "NETWORK_ERROR",
    lastError?.message ?? "Failed to fetch weather data after retries",
    undefined,
    true
  );
}

function createWeatherError(
  code: WeatherFetchError["code"],
  message: string,
  statusCode?: number,
  retryable: boolean = false
): WeatherFetchError {
  return { code, message, statusCode, retryable };
}

// ============================================================
// API Fetchers
// ============================================================

/** Fetch raw forecast data from Open-Meteo */
export async function fetchForecastRaw(
  coords: Coordinates,
  options: WeatherFetchOptions = {}
): Promise<OpenMeteoForecastResponse> {
  const cacheDuration = options.cacheDurationMs ?? DEFAULT_CACHE_MS;
  const cacheKey = getCacheKey("forecast", coords);

  const cached = getFromCache<OpenMeteoForecastResponse>(cacheKey);
  if (cached) return cached;

  const url = new URL(`${FORECAST_BASE_URL}/forecast`);
  url.searchParams.set("latitude", String(coords.latitude));
  url.searchParams.set("longitude", String(coords.longitude));
  url.searchParams.set("current", CURRENT_PARAMS);
  url.searchParams.set("hourly", HOURLY_PARAMS);
  url.searchParams.set("daily", DAILY_PARAMS);
  url.searchParams.set("timezone", "auto");

  const response = await fetchWithRetry(url.toString(), options);

  let data: OpenMeteoForecastResponse;
  try {
    data = (await response.json()) as OpenMeteoForecastResponse;
  } catch {
    throw createWeatherError("PARSE_ERROR", "Failed to parse forecast response", undefined, true);
  }

  setCache(cacheKey, data, cacheDuration);
  return data;
}

/** Fetch raw air quality data from Open-Meteo */
export async function fetchAirQualityRaw(
  coords: Coordinates,
  options: WeatherFetchOptions = {}
): Promise<OpenMeteoAirQualityResponse> {
  const cacheDuration = options.cacheDurationMs ?? DEFAULT_CACHE_MS;
  const cacheKey = getCacheKey("airquality", coords);

  const cached = getFromCache<OpenMeteoAirQualityResponse>(cacheKey);
  if (cached) return cached;

  const url = new URL(`${AIR_QUALITY_BASE_URL}/air-quality`);
  url.searchParams.set("latitude", String(coords.latitude));
  url.searchParams.set("longitude", String(coords.longitude));
  url.searchParams.set("current", AIR_QUALITY_PARAMS);
  url.searchParams.set("timezone", "auto");

  const response = await fetchWithRetry(url.toString(), options);

  let data: OpenMeteoAirQualityResponse;
  try {
    data = (await response.json()) as OpenMeteoAirQualityResponse;
  } catch {
    throw createWeatherError(
      "PARSE_ERROR",
      "Failed to parse air quality response",
      undefined,
      true
    );
  }

  setCache(cacheKey, data, cacheDuration);
  return data;
}

// ============================================================
// Transformers (Raw → App Types)
// ============================================================

function parseCurrentWeather(raw: OpenMeteoForecastResponse): CurrentWeather {
  const c = raw.current;
  if (!c) {
    throw createWeatherError("PARSE_ERROR", "No current weather data in response", undefined, false);
  }
  return {
    time: new Date(c.time),
    temperature: c.temperature_2m,
    apparentTemperature: c.apparent_temperature,
    humidity: c.relative_humidity_2m,
    isDay: c.is_day === 1,
    precipitation: c.precipitation,
    rain: c.rain,
    showers: c.showers,
    snowfall: c.snowfall,
    weatherCode: c.weather_code as WMOWeatherCode,
    cloudCover: c.cloud_cover,
    pressureMsl: c.pressure_msl,
    surfacePressure: c.surface_pressure,
    windSpeed: c.wind_speed_10m,
    windDirection: c.wind_direction_10m,
    windGusts: c.wind_gusts_10m,
  };
}

function parseHourlyForecast(raw: OpenMeteoForecastResponse): HourlyForecast[] {
  const h = raw.hourly;
  if (!h) return [];

  return h.time.map((time, i) => ({
    time: new Date(time),
    temperature: h.temperature_2m[i],
    apparentTemperature: h.apparent_temperature[i],
    humidity: h.relative_humidity_2m[i],
    dewPoint: h.dew_point_2m[i],
    precipitationProbability: h.precipitation_probability[i],
    precipitation: h.precipitation[i],
    rain: h.rain[i],
    showers: h.showers[i],
    snowfall: h.snowfall[i],
    snowDepth: h.snow_depth[i],
    weatherCode: h.weather_code[i] as WMOWeatherCode,
    pressureMsl: h.pressure_msl[i],
    surfacePressure: h.surface_pressure[i],
    cloudCover: h.cloud_cover[i],
    visibility: h.visibility[i],
    windSpeed: h.wind_speed_10m[i],
    windDirection: h.wind_direction_10m[i],
    windGusts: h.wind_gusts_10m[i],
    uvIndex: h.uv_index[i],
    isDay: h.is_day[i] === 1,
  }));
}

function parseDailyForecast(raw: OpenMeteoForecastResponse): DailyForecast[] {
  const d = raw.daily;
  if (!d) return [];

  return d.time.map((time, i) => ({
    date: new Date(time),
    weatherCode: d.weather_code[i] as WMOWeatherCode,
    tempMax: d.temperature_2m_max[i],
    tempMin: d.temperature_2m_min[i],
    apparentTempMax: d.apparent_temperature_max[i],
    apparentTempMin: d.apparent_temperature_min[i],
    sunrise: new Date(d.sunrise[i]),
    sunset: new Date(d.sunset[i]),
    uvIndexMax: d.uv_index_max[i],
    precipitationSum: d.precipitation_sum[i],
    rainSum: d.rain_sum[i],
    showersSum: d.showers_sum[i],
    snowfallSum: d.snowfall_sum[i],
    precipitationHours: d.precipitation_hours[i],
    precipitationProbabilityMax: d.precipitation_probability_max[i],
    windSpeedMax: d.wind_speed_10m_max[i],
    windGustsMax: d.wind_gusts_10m_max[i],
    windDirectionDominant: d.wind_direction_10m_dominant[i],
  }));
}

function parseAirQuality(raw: OpenMeteoAirQualityResponse): AirQuality | null {
  const c = raw.current;
  if (!c) return null;

  const aqi = c.us_aqi;
  let category: AirQualityCategory;
  if (aqi <= 50) category = "Good";
  else if (aqi <= 100) category = "Moderate";
  else if (aqi <= 150) category = "Unhealthy for Sensitive Groups";
  else if (aqi <= 200) category = "Unhealthy";
  else if (aqi <= 300) category = "Very Unhealthy";
  else category = "Hazardous";

  return {
    time: new Date(c.time),
    usAqi: aqi,
    pm10: c.pm10,
    pm25: c.pm2_5,
    category,
  };
}

// ============================================================
// Public API: Fetch Complete Weather Data
// ============================================================

/**
 * Fetches complete weather data for a location.
 * Includes current conditions, hourly forecast, daily forecast, and air quality.
 * Automatically retries on failure and uses in-memory caching.
 */
export async function fetchWeatherData(
  coords: Coordinates,
  options: WeatherFetchOptions = {}
): Promise<WeatherData> {
  // Fire both requests in parallel
  const [forecastRaw, airQualityRaw] = await Promise.all([
    fetchForecastRaw(coords, options),
    fetchAirQualityRaw(coords, options).catch((): null => null),
  ]);

  const current = parseCurrentWeather(forecastRaw);
  const hourly = parseHourlyForecast(forecastRaw);
  const daily = parseDailyForecast(forecastRaw);
  const airQuality = airQualityRaw ? parseAirQuality(airQualityRaw) : null;

  return {
    current,
    hourly,
    daily,
    airQuality,
    location: {
      latitude: forecastRaw.latitude,
      longitude: forecastRaw.longitude,
      elevation: forecastRaw.elevation,
      timezone: forecastRaw.timezone,
      timezoneAbbreviation: forecastRaw.timezone_abbreviation,
    },
    fetchedAt: new Date(),
  };
}

/**
 * Fetch only current conditions (lighter payload when you don't need forecasts).
 */
export async function fetchCurrentWeather(
  coords: Coordinates,
  options: WeatherFetchOptions = {}
): Promise<CurrentWeather> {
  const cacheKey = getCacheKey("current-only", coords);
  const cached = getFromCache<CurrentWeather>(cacheKey);
  if (cached) return cached;

  const cacheDuration = options.cacheDurationMs ?? DEFAULT_CACHE_MS;
  const url = new URL(`${FORECAST_BASE_URL}/forecast`);
  url.searchParams.set("latitude", String(coords.latitude));
  url.searchParams.set("longitude", String(coords.longitude));
  url.searchParams.set("current", CURRENT_PARAMS);
  url.searchParams.set("timezone", "auto");

  const response = await fetchWithRetry(url.toString(), options);

  let data: OpenMeteoForecastResponse;
  try {
    data = (await response.json()) as OpenMeteoForecastResponse;
  } catch {
    throw createWeatherError("PARSE_ERROR", "Failed to parse current weather response", undefined, true);
  }

  const result = parseCurrentWeather(data);
  setCache(cacheKey, result, cacheDuration);
  return result;
}
