import type {
  Coordinates,
  GeolocationState,
  GeolocationError,
  GeolocationErrorCode,
  GeolocationPermission,
} from "@/types/location";

// ============================================================
// Default State
// ============================================================

export const INITIAL_GEOLOCATION_STATE: GeolocationState = {
  coordinates: null,
  accuracy: null,
  altitude: null,
  altitudeAccuracy: null,
  heading: null,
  speed: null,
  timestamp: null,
  error: null,
  permission: "prompt",
  isLoading: false,
};

// ============================================================
// Permission Check
// ============================================================

/**
 * Check the current geolocation permission status without triggering a prompt.
 * Falls back to "prompt" if the Permissions API is unavailable.
 */
export async function checkGeolocationPermission(): Promise<GeolocationPermission> {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    return "unsupported";
  }

  if (typeof navigator.permissions === "undefined") {
    return "prompt";
  }

  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    return status.state as GeolocationPermission;
  } catch {
    return "prompt";
  }
}

/**
 * Subscribe to permission changes. Returns an unsubscribe function.
 */
export async function onPermissionChange(
  callback: (permission: GeolocationPermission) => void
): Promise<() => void> {
  if (typeof navigator === "undefined" || typeof navigator.permissions === "undefined") {
    return () => {};
  }

  try {
    const status = await navigator.permissions.query({ name: "geolocation" });
    const handler = () => {
      callback(status.state as GeolocationPermission);
    };
    status.addEventListener("change", handler);
    return () => status.removeEventListener("change", handler);
  } catch {
    return () => {};
  }
}

// ============================================================
// Geolocation Error Mapping
// ============================================================

function mapGeolocationError(error: globalThis.GeolocationPositionError): GeolocationError {
  const codeMap: Record<number, GeolocationErrorCode> = {
    1: "PERMISSION_DENIED",
    2: "POSITION_UNAVAILABLE",
    3: "TIMEOUT",
  };

  return {
    code: codeMap[error.code] ?? "POSITION_UNAVAILABLE",
    message: error.message || getDefaultErrorMessage(codeMap[error.code]),
  };
}

function getDefaultErrorMessage(code: GeolocationErrorCode | undefined): string {
  switch (code) {
    case "PERMISSION_DENIED":
      return "Location access was denied. Please enable location permissions in your browser settings.";
    case "POSITION_UNAVAILABLE":
      return "Your position could not be determined. Please check your device's location services.";
    case "TIMEOUT":
      return "Location request timed out. Please try again.";
    default:
      return "An unknown geolocation error occurred.";
  }
}

// ============================================================
// Get Current Position (Promise-based)
// ============================================================

export interface GeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const DEFAULT_OPTIONS: GeolocationOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000, // Accept cached position up to 1 minute old
};

/**
 * Get the current device position as a Promise.
 * Triggers a permission prompt if not already granted.
 *
 * @throws GeolocationError if the position cannot be determined
 */
export function getCurrentPosition(
  options: GeolocationOptions = {}
): Promise<GeolocationState> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject({
        code: "NOT_SUPPORTED" as GeolocationErrorCode,
        message: "Geolocation is not supported by this browser.",
      } satisfies GeolocationError);
      return;
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
          error: null,
          permission: "granted",
          isLoading: false,
        });
      },
      (error) => {
        reject(mapGeolocationError(error));
      },
      mergedOptions
    );
  });
}

// ============================================================
// Watch Position (Continuous)
// ============================================================

export interface WatchPositionCallbacks {
  onPosition: (state: GeolocationState) => void;
  onError: (error: GeolocationError) => void;
}

/**
 * Watch the device position continuously.
 * Returns a cleanup function to stop watching.
 */
export function watchPosition(
  callbacks: WatchPositionCallbacks,
  options: GeolocationOptions = {}
): () => void {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    callbacks.onError({
      code: "NOT_SUPPORTED",
      message: "Geolocation is not supported by this browser.",
    });
    return () => {};
  }

  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      callbacks.onPosition({
        coordinates: {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        },
        accuracy: position.coords.accuracy,
        altitude: position.coords.altitude,
        altitudeAccuracy: position.coords.altitudeAccuracy,
        heading: position.coords.heading,
        speed: position.coords.speed,
        timestamp: position.timestamp,
        error: null,
        permission: "granted",
        isLoading: false,
      });
    },
    (error) => {
      callbacks.onError(mapGeolocationError(error));
    },
    mergedOptions
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
  };
}

// ============================================================
// Utility
// ============================================================

/** Check if geolocation is available in the current environment */
export function isGeolocationAvailable(): boolean {
  return typeof navigator !== "undefined" && "geolocation" in navigator;
}

/** Extract just the coordinates from a GeolocationState */
export function extractCoordinates(
  state: GeolocationState
): Coordinates | null {
  return state.coordinates;
}
