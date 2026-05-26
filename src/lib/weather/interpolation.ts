import type { Coordinates } from "@/types/location";
import type { HourlyForecast, CurrentWeather } from "@/types/weather";
import { lerp, clamp } from "@/lib/utils";

// ============================================================
// Types
// ============================================================

export interface InterpolatedPoint {
  latitude: number;
  longitude: number;
  value: number;
  weight: number;
}

export interface RadarGridCell {
  latitude: number;
  longitude: number;
  intensity: number; // mm/h
  type: "rain" | "snow" | "mixed" | "none";
  confidence: number; // 0-1
}

export interface WindVector {
  speed: number;     // km/h
  direction: number; // degrees (meteorological: where the wind comes from)
  u: number;         // east-west component (m/s)
  v: number;         // north-south component (m/s)
}

export interface StationObservation {
  id: string;
  coordinates: Coordinates;
  temperature: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  precipitation: number;
  timestamp: Date;
}

// ============================================================
// Inverse Distance Weighting (IDW) Interpolation
// ============================================================

/**
 * Interpolate a value at a target point using Inverse Distance Weighting
 * from a set of known data points. This is the standard approach used
 * in meteorological spatial interpolation.
 *
 * @param target The coordinates to interpolate at
 * @param points Known data points with values
 * @param power The power parameter (default 2 = inverse square)
 * @returns Interpolated value
 */
export function interpolateIDW(
  target: Coordinates,
  points: InterpolatedPoint[],
  power: number = 2
): number {
  if (points.length === 0) return 0;
  if (points.length === 1) return points[0].value;

  let numerator = 0;
  let denominator = 0;

  for (const point of points) {
    const dist = haversineDistance(target, {
      latitude: point.latitude,
      longitude: point.longitude,
    });

    // If we're very close to a known point, return its value directly
    if (dist < 0.001) return point.value;

    const weight = (point.weight / Math.pow(dist, power));
    numerator += weight * point.value;
    denominator += weight;
  }

  return denominator === 0 ? 0 : numerator / denominator;
}

// ============================================================
// Simulated Radar Interpolation
// ============================================================

/**
 * Generate a simulated radar grid from hourly forecast data.
 * Uses bilinear interpolation to create a smooth radar-like
 * precipitation field around a central point.
 *
 * @param center Center coordinates
 * @param hourlyData Hourly forecast data from Open-Meteo
 * @param gridSize Number of cells per side (default 20 = 20x20 grid)
 * @param radiusKm Radius in km (default 50)
 * @param hourIndex Which hour's data to use (default 0 = current)
 * @returns Grid of radar cells
 */
export function generateRadarGrid(
  center: Coordinates,
  hourlyData: HourlyForecast[],
  gridSize: number = 20,
  radiusKm: number = 50,
  hourIndex: number = 0
): RadarGridCell[] {
  if (hourlyData.length === 0) return [];

  const hour = hourlyData[clamp(hourIndex, 0, hourlyData.length - 1)];
  const basePrecipitation = hour.precipitation;
  const baseRain = hour.rain;
  const baseSnow = hour.snowfall;
  const baseCloudCover = hour.cloudCover;
  const baseWindSpeed = hour.windSpeed;
  const baseWindDirection = hour.windDirection;

  // Approximate degrees per km at this latitude
  const degPerKmLat = 1 / 111.32;
  const degPerKmLon = 1 / (111.32 * Math.cos((center.latitude * Math.PI) / 180));

  const halfExtent = radiusKm;
  const cellSizeKm = (2 * halfExtent) / gridSize;

  const grid: RadarGridCell[] = [];

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const offsetKmLat = -halfExtent + (row + 0.5) * cellSizeKm;
      const offsetKmLon = -halfExtent + (col + 0.5) * cellSizeKm;

      const lat = center.latitude + offsetKmLat * degPerKmLat;
      const lon = center.longitude + offsetKmLon * degPerKmLon;

      // Distance from center in km
      const distFromCenter = Math.sqrt(
        offsetKmLat * offsetKmLat + offsetKmLon * offsetKmLon
      );

      // Simulate spatial variation using deterministic noise based on position
      const spatialNoise = deterministicNoise(lat, lon, hour.time.getTime());

      // Precipitation falls off with distance, modulated by cloud cover and noise
      const distanceFactor = Math.max(0, 1 - distFromCenter / (halfExtent * 1.2));
      const cloudFactor = baseCloudCover / 100;

      // Wind-advected precipitation pattern
      const windRadians = ((baseWindDirection + 180) * Math.PI) / 180; // Direction wind is blowing TO
      const advectionX = Math.sin(windRadians);
      const advectionY = Math.cos(windRadians);
      const advectionOffset =
        (offsetKmLon * advectionX + offsetKmLat * advectionY) /
        (halfExtent * 0.5);
      const advectionFactor = clamp(0.5 + advectionOffset * 0.3, 0, 1);

      // Combine factors
      const intensity =
        basePrecipitation *
        distanceFactor *
        cloudFactor *
        advectionFactor *
        (0.7 + 0.6 * spatialNoise);

      // Determine precipitation type
      let type: RadarGridCell["type"] = "none";
      if (intensity > 0.01) {
        if (baseSnow > baseRain) {
          type = baseRain > 0.01 ? "mixed" : "snow";
        } else {
          type = baseSnow > 0.01 ? "mixed" : "rain";
        }
      }

      // Confidence decreases with distance from center
      const confidence = clamp(1 - (distFromCenter / halfExtent) * 0.5, 0.2, 1);

      grid.push({
        latitude: lat,
        longitude: lon,
        intensity: Math.max(0, intensity),
        type,
        confidence,
      });
    }
  }

  return grid;
}

/**
 * Deterministic noise function based on coordinates and a seed.
 * Returns a value between 0 and 1.
 */
function deterministicNoise(lat: number, lon: number, seed: number): number {
  const x = Math.sin(lat * 12.9898 + lon * 78.233 + seed * 0.001) * 43758.5453;
  return x - Math.floor(x);
}

// ============================================================
// Station Blending
// ============================================================

/**
 * Blend observations from multiple simulated weather stations
 * using inverse distance weighting to produce a single estimate
 * at the target coordinates.
 *
 * @param target Target coordinates
 * @param stations Array of station observations
 * @param maxDistanceKm Maximum distance to consider (default 100km)
 * @returns Blended observation, or null if no stations within range
 */
export function blendStationData(
  target: Coordinates,
  stations: StationObservation[],
  maxDistanceKm: number = 100
): StationObservation | null {
  if (stations.length === 0) return null;

  // Filter to stations within range
  const stationsWithDistance = stations
    .map((station) => ({
      station,
      distance: haversineDistance(target, station.coordinates),
    }))
    .filter((s) => s.distance <= maxDistanceKm)
    .sort((a, b) => a.distance - b.distance);

  if (stationsWithDistance.length === 0) return null;

  // If only one station or very close, return it directly
  if (
    stationsWithDistance.length === 1 ||
    stationsWithDistance[0].distance < 0.5
  ) {
    return stationsWithDistance[0].station;
  }

  // IDW blend
  let totalWeight = 0;
  let blendedTemp = 0;
  let blendedHumidity = 0;
  let blendedPressure = 0;
  let blendedWindSpeed = 0;
  let blendedPrecipitation = 0;
  // Wind direction needs circular averaging
  let windSinSum = 0;
  let windCosSum = 0;

  for (const { station, distance } of stationsWithDistance) {
    const weight = 1 / (distance * distance);
    totalWeight += weight;

    blendedTemp += station.temperature * weight;
    blendedHumidity += station.humidity * weight;
    blendedPressure += station.pressure * weight;
    blendedWindSpeed += station.windSpeed * weight;
    blendedPrecipitation += station.precipitation * weight;

    const windRad = (station.windDirection * Math.PI) / 180;
    windSinSum += Math.sin(windRad) * weight;
    windCosSum += Math.cos(windRad) * weight;
  }

  const blendedWindDirection =
    ((Math.atan2(windSinSum / totalWeight, windCosSum / totalWeight) * 180) /
      Math.PI +
      360) %
    360;

  return {
    id: "blended",
    coordinates: target,
    temperature: blendedTemp / totalWeight,
    humidity: blendedHumidity / totalWeight,
    pressure: blendedPressure / totalWeight,
    windSpeed: blendedWindSpeed / totalWeight,
    windDirection: blendedWindDirection,
    precipitation: blendedPrecipitation / totalWeight,
    timestamp: new Date(),
  };
}

/**
 * Generate simulated weather stations around a central point.
 * Uses the current weather data to create plausible nearby observations
 * with natural spatial variation.
 */
export function generateSimulatedStations(
  center: Coordinates,
  currentWeather: CurrentWeather,
  count: number = 8,
  radiusKm: number = 50
): StationObservation[] {
  const stations: StationObservation[] = [];

  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count;
    const distance = radiusKm * (0.3 + 0.7 * deterministicNoise(i, angle, center.latitude));

    const degPerKmLat = 1 / 111.32;
    const degPerKmLon =
      1 / (111.32 * Math.cos((center.latitude * Math.PI) / 180));

    const lat = center.latitude + distance * Math.cos(angle) * degPerKmLat;
    const lon = center.longitude + distance * Math.sin(angle) * degPerKmLon;

    // Add natural variation
    const noise = deterministicNoise(lat, lon, i * 1000);
    const tempVariation = (noise - 0.5) * 4; // ±2°C
    const humidityVariation = (noise - 0.5) * 20; // ±10%
    const pressureVariation = (noise - 0.5) * 4; // ±2 hPa
    const windVariation = (noise - 0.5) * 10; // ±5 km/h

    stations.push({
      id: `station-${i}`,
      coordinates: { latitude: lat, longitude: lon },
      temperature: currentWeather.temperature + tempVariation,
      humidity: clamp(currentWeather.humidity + humidityVariation, 0, 100),
      pressure: currentWeather.pressureMsl + pressureVariation,
      windSpeed: Math.max(0, currentWeather.windSpeed + windVariation),
      windDirection: (currentWeather.windDirection + (noise - 0.5) * 30 + 360) % 360,
      precipitation: Math.max(0, currentWeather.precipitation + (noise - 0.5) * 2),
      timestamp: currentWeather.time,
    });
  }

  return stations;
}

// ============================================================
// Wind Direction Modeling
// ============================================================

/**
 * Decompose wind speed and direction into u/v vector components.
 * Uses meteorological convention (direction wind comes FROM).
 */
export function windToVector(speed: number, direction: number): WindVector {
  const dirRad = (direction * Math.PI) / 180;
  // Meteorological convention: wind FROM direction
  const u = -speed * Math.sin(dirRad) / 3.6; // Convert km/h to m/s
  const v = -speed * Math.cos(dirRad) / 3.6;

  return { speed, direction, u, v };
}

/**
 * Convert u/v wind components back to speed and direction.
 */
export function vectorToWind(u: number, v: number): { speed: number; direction: number } {
  const speedMs = Math.sqrt(u * u + v * v);
  const speedKmh = speedMs * 3.6;
  const direction = ((Math.atan2(-u, -v) * 180) / Math.PI + 360) % 360;

  return { speed: speedKmh, direction };
}

/**
 * Interpolate wind direction between two hourly forecasts.
 * Uses circular interpolation to handle the 0°/360° boundary correctly.
 *
 * @param hourA Wind at time A
 * @param hourB Wind at time B
 * @param t Interpolation factor (0 = A, 1 = B)
 * @returns Interpolated wind vector
 */
export function interpolateWind(
  hourA: { speed: number; direction: number },
  hourB: { speed: number; direction: number },
  t: number
): WindVector {
  // Decompose to vectors, interpolate, recompose
  const vecA = windToVector(hourA.speed, hourA.direction);
  const vecB = windToVector(hourB.speed, hourB.direction);

  const u = lerp(vecA.u, vecB.u, t);
  const v = lerp(vecA.v, vecB.v, t);

  const { speed, direction } = vectorToWind(u, v);
  return { speed, direction, u, v };
}

/**
 * Generate a wind field grid around a center point using hourly data.
 * Models wind variation across the area using the base observation
 * and terrain-effect simulation.
 */
export function generateWindField(
  center: Coordinates,
  hourlyData: HourlyForecast[],
  gridSize: number = 10,
  radiusKm: number = 30,
  hourIndex: number = 0
): WindVector[][] {
  if (hourlyData.length === 0) return [];

  const hour = hourlyData[clamp(hourIndex, 0, hourlyData.length - 1)];
  const baseVector = windToVector(hour.windSpeed, hour.windDirection);

  const degPerKmLat = 1 / 111.32;
  const degPerKmLon =
    1 / (111.32 * Math.cos((center.latitude * Math.PI) / 180));

  const field: WindVector[][] = [];

  for (let row = 0; row < gridSize; row++) {
    const rowVectors: WindVector[] = [];
    for (let col = 0; col < gridSize; col++) {
      const offsetKmLat = -radiusKm + (row + 0.5) * ((2 * radiusKm) / gridSize);
      const offsetKmLon = -radiusKm + (col + 0.5) * ((2 * radiusKm) / gridSize);

      const lat = center.latitude + offsetKmLat * degPerKmLat;
      const lon = center.longitude + offsetKmLon * degPerKmLon;

      // Simulate terrain effects on wind
      const noise = deterministicNoise(lat, lon, hour.time.getTime());
      const speedVariation = 1 + (noise - 0.5) * 0.4; // ±20%
      const dirVariation = (noise - 0.5) * 20; // ±10°

      const modifiedSpeed = Math.max(0, hour.windSpeed * speedVariation);
      const modifiedDirection = (hour.windDirection + dirVariation + 360) % 360;

      const vec = windToVector(modifiedSpeed, modifiedDirection);
      rowVectors.push(vec);
    }
    field.push(rowVectors);
  }

  return field;
}

// ============================================================
// Temporal Interpolation
// ============================================================

/**
 * Interpolate weather conditions between two hourly data points
 * for sub-hourly precision.
 *
 * @param before The hourly forecast before the target time
 * @param after The hourly forecast after the target time
 * @param t Interpolation factor (0-1, where 0 = before, 1 = after)
 * @returns Interpolated hourly forecast
 */
export function interpolateHourly(
  before: HourlyForecast,
  after: HourlyForecast,
  t: number
): HourlyForecast {
  const clampedT = clamp(t, 0, 1);
  const wind = interpolateWind(
    { speed: before.windSpeed, direction: before.windDirection },
    { speed: after.windSpeed, direction: after.windDirection },
    clampedT
  );

  return {
    time: new Date(
      before.time.getTime() +
        (after.time.getTime() - before.time.getTime()) * clampedT
    ),
    temperature: lerp(before.temperature, after.temperature, clampedT),
    apparentTemperature: lerp(
      before.apparentTemperature,
      after.apparentTemperature,
      clampedT
    ),
    humidity: lerp(before.humidity, after.humidity, clampedT),
    dewPoint: lerp(before.dewPoint, after.dewPoint, clampedT),
    precipitationProbability: lerp(
      before.precipitationProbability,
      after.precipitationProbability,
      clampedT
    ),
    precipitation: lerp(before.precipitation, after.precipitation, clampedT),
    rain: lerp(before.rain, after.rain, clampedT),
    showers: lerp(before.showers, after.showers, clampedT),
    snowfall: lerp(before.snowfall, after.snowfall, clampedT),
    snowDepth: lerp(before.snowDepth, after.snowDepth, clampedT),
    weatherCode: clampedT < 0.5 ? before.weatherCode : after.weatherCode,
    pressureMsl: lerp(before.pressureMsl, after.pressureMsl, clampedT),
    surfacePressure: lerp(before.surfacePressure, after.surfacePressure, clampedT),
    cloudCover: lerp(before.cloudCover, after.cloudCover, clampedT),
    visibility: lerp(before.visibility, after.visibility, clampedT),
    windSpeed: wind.speed,
    windDirection: wind.direction,
    windGusts: lerp(before.windGusts, after.windGusts, clampedT),
    uvIndex: lerp(before.uvIndex, after.uvIndex, clampedT),
    isDay: clampedT < 0.5 ? before.isDay : after.isDay,
  };
}

// ============================================================
// Helpers
// ============================================================

/** Haversine distance between two points in km */
function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLon = Math.sin(dLon / 2);
  const aCalc =
    sinDLat * sinDLat +
    Math.cos((a.latitude * Math.PI) / 180) *
      Math.cos((b.latitude * Math.PI) / 180) *
      sinDLon * sinDLon;
  const c = 2 * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
  return R * c;
}
