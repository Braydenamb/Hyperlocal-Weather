import { clsx, type ClassValue } from "clsx";
import { format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";
import type { TemperatureUnit, WindSpeedUnit, PrecipitationUnit, TimeFormat } from "@/types/weather";

// ============================================================
// Class Name Utility (Tailwind)
// ============================================================

/** Merge Tailwind CSS classes with clsx */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

// ============================================================
// Temperature Formatting
// ============================================================

export function celsiusToFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function fahrenheitToCelsius(fahrenheit: number): number {
  return ((fahrenheit - 32) * 5) / 9;
}

export function formatTemp(
  celsius: number,
  unit: TemperatureUnit = "celsius",
  decimals: number = 0
): string {
  const value = unit === "fahrenheit" ? celsiusToFahrenheit(celsius) : celsius;
  const rounded = value.toFixed(decimals);
  const symbol = unit === "fahrenheit" ? "°F" : "°C";
  return `${rounded}${symbol}`;
}

// ============================================================
// Wind Speed Formatting
// ============================================================

export function convertWindSpeed(
  kmh: number,
  unit: WindSpeedUnit
): number {
  switch (unit) {
    case "kmh":
      return kmh;
    case "mph":
      return kmh * 0.621371;
    case "ms":
      return kmh / 3.6;
    case "knots":
      return kmh * 0.539957;
    default:
      return kmh;
  }
}

export function formatWindSpeed(
  kmh: number,
  unit: WindSpeedUnit = "kmh",
  decimals: number = 1
): string {
  const value = convertWindSpeed(kmh, unit);
  const labels: Record<WindSpeedUnit, string> = {
    kmh: "km/h",
    mph: "mph",
    ms: "m/s",
    knots: "kn",
  };
  return `${value.toFixed(decimals)} ${labels[unit]}`;
}

// ============================================================
// Wind Direction
// ============================================================

const COMPASS_DIRECTIONS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW",
] as const;

export type CompassDirection = (typeof COMPASS_DIRECTIONS)[number];

export function degreesToCompass(degrees: number): CompassDirection {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS_DIRECTIONS[index];
}

export function formatWindDirection(degrees: number): string {
  return `${degreesToCompass(degrees)} (${Math.round(degrees)}°)`;
}

// ============================================================
// Precipitation Formatting
// ============================================================

export function convertPrecipitation(
  mm: number,
  unit: PrecipitationUnit
): number {
  return unit === "inch" ? mm / 25.4 : mm;
}

export function formatPrecipitation(
  mm: number,
  unit: PrecipitationUnit = "mm",
  decimals: number = 1
): string {
  const value = convertPrecipitation(mm, unit);
  const label = unit === "inch" ? "in" : "mm";
  return `${value.toFixed(decimals)} ${label}`;
}

// ============================================================
// Pressure Formatting
// ============================================================

export function formatPressure(hPa: number, decimals: number = 0): string {
  return `${hPa.toFixed(decimals)} hPa`;
}

// ============================================================
// UV Index
// ============================================================

export type UVCategory = "Low" | "Moderate" | "High" | "Very High" | "Extreme";

export function getUVCategory(uvIndex: number): UVCategory {
  if (uvIndex <= 2) return "Low";
  if (uvIndex <= 5) return "Moderate";
  if (uvIndex <= 7) return "High";
  if (uvIndex <= 10) return "Very High";
  return "Extreme";
}

export function formatUVIndex(uvIndex: number): string {
  return `${uvIndex.toFixed(1)} (${getUVCategory(uvIndex)})`;
}

// ============================================================
// Visibility Formatting
// ============================================================

export function formatVisibility(meters: number): string {
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${Math.round(meters)} m`;
}

// ============================================================
// Time & Date Formatting
// ============================================================

export function formatTime(
  date: Date,
  timeFormat: TimeFormat = "24h"
): string {
  return format(date, timeFormat === "12h" ? "h:mm a" : "HH:mm");
}

export function formatDate(date: Date): string {
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  return format(date, "EEE, MMM d");
}

export function formatDateFull(date: Date): string {
  return format(date, "EEEE, MMMM d, yyyy");
}

export function formatRelativeTime(date: Date): string {
  return formatDistanceToNow(date, { addSuffix: true });
}

// ============================================================
// Humidity
// ============================================================

export type HumidityLevel = "Very Dry" | "Dry" | "Comfortable" | "Humid" | "Very Humid";

export function getHumidityLevel(humidity: number): HumidityLevel {
  if (humidity < 25) return "Very Dry";
  if (humidity < 40) return "Dry";
  if (humidity < 60) return "Comfortable";
  if (humidity < 80) return "Humid";
  return "Very Humid";
}

// ============================================================
// Number Utilities
// ============================================================

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * clamp(t, 0, 1);
}

export function roundTo(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// ============================================================
// Air Quality
// ============================================================

export function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good";
  if (aqi <= 100) return "Moderate";
  if (aqi <= 150) return "Unhealthy for Sensitive Groups";
  if (aqi <= 200) return "Unhealthy";
  if (aqi <= 300) return "Very Unhealthy";
  return "Hazardous";
}

export function getAQIColor(aqi: number): string {
  if (aqi <= 50) return "#00e400";
  if (aqi <= 100) return "#ffff00";
  if (aqi <= 150) return "#ff7e00";
  if (aqi <= 200) return "#ff0000";
  if (aqi <= 300) return "#8f3f97";
  return "#7e0023";
}

// ============================================================
// Debounce
// ============================================================

export function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, waitMs);
  };
}

// ============================================================
// Coordinate Formatting
// ============================================================

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? "N" : "S";
  const lonDir = lon >= 0 ? "E" : "W";
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}`;
}

// ============================================================
// Percentage Formatting
// ============================================================

export function formatPercentage(value: number, decimals: number = 0): string {
  return `${value.toFixed(decimals)}%`;
}
