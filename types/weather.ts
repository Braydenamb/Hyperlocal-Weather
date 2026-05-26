export interface WeatherLocation {
  lat: number
  lon: number
  name: string
}

export interface CurrentWeather {
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  windDirection: number
  weatherCode: number
  description: string
  uvIndex: number
  pressure: number
  aqi: number
  visibility: number
  dewPoint: number
  cloudCover: number
}

export interface HourlyForecast {
  time: string
  temperature: number
  precipProbability: number
  precip: number
  windSpeed: number
  windDirection: number
  humidity: number
  pressure: number
  uvIndex: number
  feelsLike: number
}

export interface WeatherAlert {
  id: string
  type: 'wind' | 'rain' | 'snow' | 'fog' | 'heat' | 'cold' | 'storm'
  severity: 'low' | 'medium' | 'high' | 'extreme'
  title: string
  description: string
  startsAt: string
  endsAt: string
}

export interface RadarData {
  cells: RadarCell[]
  timestamp: string
}

export interface RadarCell {
  lat: number
  lon: number
  intensity: number
  type: 'rain' | 'snow' | 'mixed' | 'storm'
}
