// ============================================================
// Open-Meteo API Response Types
// ============================================================

/** Units object returned alongside each group of weather variables */
export interface OpenMeteoUnits {
  time?: string;
  temperature_2m?: string;
  relative_humidity_2m?: string;
  dew_point_2m?: string;
  apparent_temperature?: string;
  is_day?: string;
  precipitation?: string;
  precipitation_probability?: string;
  rain?: string;
  showers?: string;
  snowfall?: string;
  snow_depth?: string;
  weather_code?: string;
  cloud_cover?: string;
  pressure_msl?: string;
  surface_pressure?: string;
  wind_speed_10m?: string;
  wind_direction_10m?: string;
  wind_gusts_10m?: string;
  visibility?: string;
  uv_index?: string;
  uv_index_max?: string;
  temperature_2m_max?: string;
  temperature_2m_min?: string;
  apparent_temperature_max?: string;
  apparent_temperature_min?: string;
  sunrise?: string;
  sunset?: string;
  precipitation_sum?: string;
  rain_sum?: string;
  showers_sum?: string;
  snowfall_sum?: string;
  precipitation_hours?: string;
  precipitation_probability_max?: string;
  wind_speed_10m_max?: string;
  wind_gusts_10m_max?: string;
  wind_direction_10m_dominant?: string;
}

/** Raw "current" block from Open-Meteo */
export interface OpenMeteoCurrentRaw {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
}

/** Raw "hourly" block from Open-Meteo */
export interface OpenMeteoHourlyRaw {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  rain: number[];
  showers: number[];
  snowfall: number[];
  snow_depth: number[];
  weather_code: number[];
  pressure_msl: number[];
  surface_pressure: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  wind_direction_10m: number[];
  wind_gusts_10m: number[];
  uv_index: number[];
  is_day: number[];
}

/** Raw "daily" block from Open-Meteo */
export interface OpenMeteoDailyRaw {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

/** Full forecast response from Open-Meteo */
export interface OpenMeteoForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: OpenMeteoUnits;
  current?: OpenMeteoCurrentRaw;
  hourly_units?: OpenMeteoUnits;
  hourly?: OpenMeteoHourlyRaw;
  daily_units?: OpenMeteoUnits;
  daily?: OpenMeteoDailyRaw;
}

// ============================================================
// Air Quality API Types
// ============================================================

export interface OpenMeteoAirQualityCurrentRaw {
  time: string;
  interval: number;
  us_aqi: number;
  pm10: number;
  pm2_5: number;
}

export interface OpenMeteoAirQualityResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  current_units?: OpenMeteoUnits;
  current?: OpenMeteoAirQualityCurrentRaw;
}

// ============================================================
// App-Level Weather Types (Normalized)
// ============================================================

export interface CurrentWeather {
  time: Date;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: WMOWeatherCode;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
}

export interface HourlyForecast {
  time: Date;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  dewPoint: number;
  precipitationProbability: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  snowDepth: number;
  weatherCode: WMOWeatherCode;
  pressureMsl: number;
  surfacePressure: number;
  cloudCover: number;
  visibility: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
  isDay: boolean;
}

export interface DailyForecast {
  date: Date;
  weatherCode: WMOWeatherCode;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: Date;
  sunset: Date;
  uvIndexMax: number;
  precipitationSum: number;
  rainSum: number;
  showersSum: number;
  snowfallSum: number;
  precipitationHours: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface AirQuality {
  time: Date;
  usAqi: number;
  pm10: number;
  pm25: number;
  category: AirQualityCategory;
}

export type AirQualityCategory =
  | "Good"
  | "Moderate"
  | "Unhealthy for Sensitive Groups"
  | "Unhealthy"
  | "Very Unhealthy"
  | "Hazardous";

/** Complete weather data bundle for a single location */
export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  airQuality: AirQuality | null;
  location: {
    latitude: number;
    longitude: number;
    elevation: number;
    timezone: string;
    timezoneAbbreviation: string;
  };
  fetchedAt: Date;
}

// ============================================================
// WMO Weather Code Enum
// ============================================================

export enum WMOWeatherCode {
  ClearSky = 0,
  MainlyClear = 1,
  PartlyCloudy = 2,
  Overcast = 3,
  Fog = 45,
  DepositingRimeFog = 48,
  DrizzleLight = 51,
  DrizzleModerate = 53,
  DrizzleDense = 55,
  FreezingDrizzleLight = 56,
  FreezingDrizzleDense = 57,
  RainSlight = 61,
  RainModerate = 63,
  RainHeavy = 65,
  FreezingRainLight = 66,
  FreezingRainHeavy = 67,
  SnowSlight = 71,
  SnowModerate = 73,
  SnowHeavy = 75,
  SnowGrains = 77,
  RainShowersSlight = 80,
  RainShowersModerate = 81,
  RainShowersViolent = 82,
  SnowShowersSlight = 85,
  SnowShowersHeavy = 86,
  ThunderstormSlight = 95,
  ThunderstormWithHailSlight = 96,
  ThunderstormWithHailHeavy = 99,
}

/** Human-readable weather description from WMO code */
export function getWeatherDescription(code: WMOWeatherCode): string {
  const descriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snowfall",
    73: "Moderate snowfall",
    75: "Heavy snowfall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return descriptions[code] ?? "Unknown";
}

/** Weather icon name from WMO code (for use with lucide-react or similar) */
export function getWeatherIconName(
  code: WMOWeatherCode,
  isDay: boolean
): string {
  if (code === 0) return isDay ? "Sun" : "Moon";
  if (code <= 2) return isDay ? "CloudSun" : "CloudMoon";
  if (code === 3) return "Cloud";
  if (code <= 48) return "CloudFog";
  if (code <= 57) return "CloudDrizzle";
  if (code <= 67) return "CloudRain";
  if (code <= 77) return "Snowflake";
  if (code <= 82) return "CloudRain";
  if (code <= 86) return "Snowflake";
  if (code >= 95) return "CloudLightning";
  return "Cloud";
}

// ============================================================
// Temperature & Unit Types
// ============================================================

export type TemperatureUnit = "celsius" | "fahrenheit";
export type WindSpeedUnit = "kmh" | "mph" | "ms" | "knots";
export type PrecipitationUnit = "mm" | "inch";
export type TimeFormat = "12h" | "24h";

export interface UnitPreferences {
  temperature: TemperatureUnit;
  windSpeed: WindSpeedUnit;
  precipitation: PrecipitationUnit;
  timeFormat: TimeFormat;
}

// ============================================================
// Community Report Types
// ============================================================

export type CommunityReportType =
  | "rain"
  | "snow"
  | "hail"
  | "fog"
  | "wind"
  | "flooding"
  | "other";

export interface CommunityReportData {
  id: string;
  latitude: number;
  longitude: number;
  reportType: CommunityReportType;
  severity: number;
  description: string | null;
  imageUrl: string | null;
  userId: string | null;
  verified: boolean;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  expiresAt: Date;
}

// ============================================================
// Radar Types
// ============================================================

export type RadarType = "rain" | "snow" | "mixed";

export interface RadarCellData {
  id: string;
  latitude: number;
  longitude: number;
  resolution: number;
  intensity: number;
  radarType: RadarType;
  direction: number | null;
  speed: number | null;
  timestamp: Date;
  validUntil: Date;
}

// ============================================================
// Fetch/Error Types
// ============================================================

export interface WeatherFetchError {
  code: "NETWORK_ERROR" | "API_ERROR" | "PARSE_ERROR" | "TIMEOUT" | "UNKNOWN";
  message: string;
  statusCode?: number;
  retryable: boolean;
}

export interface WeatherFetchOptions {
  signal?: AbortSignal;
  cacheDurationMs?: number;
  retryCount?: number;
  retryDelayMs?: number;
}
