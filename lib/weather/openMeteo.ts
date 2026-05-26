const BASE_URL = 'https://api.open-meteo.com/v1'

export interface OpenMeteoCurrentWeather {
  temperature: number
  windspeed: number
  winddirection: number
  weathercode: number
  time: string
}

export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  current_weather: OpenMeteoCurrentWeather
  hourly: {
    time: string[]
    temperature_2m: number[]
    precipitation_probability: number[]
    precipitation: number[]
    windspeed_10m: number[]
    winddirection_10m: number[]
    relativehumidity_2m: number[]
    surface_pressure: number[]
    uv_index: number[]
    apparent_temperature: number[]
  }
}

export async function fetchWeather(lat: number, lon: number): Promise<OpenMeteoResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current_weather: 'true',
    hourly: 'temperature_2m,precipitation_probability,precipitation,windspeed_10m,winddirection_10m,relativehumidity_2m,surface_pressure,uv_index,apparent_temperature',
    timezone: 'auto',
    forecast_days: '3',
  })

  const response = await fetch(`${BASE_URL}/forecast?${params}`, {
    next: { revalidate: 300 },
  })

  if (!response.ok) {
    throw new Error(`Open-Meteo API error: ${response.status}`)
  }

  return response.json()
}

export function getWeatherDescription(code: number): string {
  const codes: Record<number, string> = {
    0: 'Clear Sky',
    1: 'Mainly Clear',
    2: 'Partly Cloudy',
    3: 'Overcast',
    45: 'Foggy',
    48: 'Icy Fog',
    51: 'Light Drizzle',
    53: 'Moderate Drizzle',
    55: 'Dense Drizzle',
    61: 'Slight Rain',
    63: 'Moderate Rain',
    65: 'Heavy Rain',
    71: 'Slight Snow',
    73: 'Moderate Snow',
    75: 'Heavy Snow',
    80: 'Slight Showers',
    81: 'Moderate Showers',
    82: 'Violent Showers',
    95: 'Thunderstorm',
    99: 'Thunderstorm with Hail',
  }
  return codes[code] ?? 'Unknown'
}

export function getWeatherIcon(code: number): string {
  if (code === 0 || code === 1) return '☀️'
  if (code === 2) return '⛅'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if (code >= 51 && code <= 55) return '🌦️'
  if (code >= 61 && code <= 65) return '🌧️'
  if (code >= 71 && code <= 75) return '❄️'
  if (code >= 80 && code <= 82) return '🌦️'
  if (code >= 95) return '⛈️'
  return '🌡️'
}
