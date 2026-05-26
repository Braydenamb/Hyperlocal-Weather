export interface Location {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  admin1?: string;
}

export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  pressure: number;
  cloudCover: number;
  precipitation: number;
  isDay: boolean;
}

export interface HourlyForecast {
  time: string[];
  temperature: number[];
  humidity: number[];
  precipitationProbability: number[];
  precipitation: number[];
  weatherCode: number[];
  windSpeed: number[];
  windDirection: number[];
  pressure: number[];
  uvIndex: number[];
  cloudCover: number[];
  visibility: number[];
  dewPoint: number[];
  apparentTemperature: number[];
  isDay: number[];
}

export interface DailyForecast {
  time: string[];
  weatherCode: number[];
  temperatureMax: number[];
  temperatureMin: number[];
  sunrise: string[];
  sunset: string[];
  uvIndexMax: number[];
  precipitationSum: number[];
  precipitationProbabilityMax: number[];
  windSpeedMax: number[];
}

export interface AirQuality {
  usAqi: number;
  pm10: number;
  pm25: number;
}

export interface CommunityReport {
  id: string;
  latitude: number;
  longitude: number;
  condition: 'sunny' | 'cloudy' | 'rain' | 'storm' | 'hail' | 'windy';
  note?: string;
  createdAt: string;
}
