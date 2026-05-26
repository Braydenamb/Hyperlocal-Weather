import { create } from 'zustand';
import type { CurrentWeather, HourlyForecast, DailyForecast, AirQuality } from '@/types';

interface WeatherStore {
  currentWeather: CurrentWeather | null;
  hourlyForecast: HourlyForecast | null;
  dailyForecast: DailyForecast | null;
  airQuality: AirQuality | null;
  isLoading: boolean;
  error: string | null;
  fetchWeather: (lat: number, lon: number) => Promise<void>;
}

export const useWeatherStore = create<WeatherStore>((set) => ({
  currentWeather: null,
  hourlyForecast: null,
  dailyForecast: null,
  airQuality: null,
  isLoading: false,
  error: null,
  fetchWeather: async (lat: number, lon: number) => {
    set({ isLoading: true, error: null });
    try {
      const [weatherRes, aqRes] = await Promise.all([
        fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure,cloud_cover,precipitation,is_day&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,uv_index,cloud_cover,visibility,dew_point_2m,apparent_temperature,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max&timezone=auto`
        ),
        fetch(
          `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5`
        ),
      ]);

      const weatherData = await weatherRes.json();
      const aqData = await aqRes.json();

      const currentWeather: CurrentWeather = {
        temperature: weatherData.current.temperature_2m,
        feelsLike: weatherData.current.apparent_temperature,
        humidity: weatherData.current.relative_humidity_2m,
        weatherCode: weatherData.current.weather_code,
        windSpeed: weatherData.current.wind_speed_10m,
        windDirection: weatherData.current.wind_direction_10m,
        windGusts: weatherData.current.wind_gusts_10m,
        pressure: weatherData.current.surface_pressure,
        cloudCover: weatherData.current.cloud_cover,
        precipitation: weatherData.current.precipitation,
        isDay: weatherData.current.is_day === 1,
      };

      const hourlyForecast: HourlyForecast = {
        time: weatherData.hourly.time,
        temperature: weatherData.hourly.temperature_2m,
        humidity: weatherData.hourly.relative_humidity_2m,
        precipitationProbability: weatherData.hourly.precipitation_probability,
        precipitation: weatherData.hourly.precipitation,
        weatherCode: weatherData.hourly.weather_code,
        windSpeed: weatherData.hourly.wind_speed_10m,
        windDirection: weatherData.hourly.wind_direction_10m,
        pressure: weatherData.hourly.surface_pressure,
        uvIndex: weatherData.hourly.uv_index,
        cloudCover: weatherData.hourly.cloud_cover,
        visibility: weatherData.hourly.visibility,
        dewPoint: weatherData.hourly.dew_point_2m,
        apparentTemperature: weatherData.hourly.apparent_temperature,
        isDay: weatherData.hourly.is_day,
      };

      const dailyForecast: DailyForecast = {
        time: weatherData.daily.time,
        weatherCode: weatherData.daily.weather_code,
        temperatureMax: weatherData.daily.temperature_2m_max,
        temperatureMin: weatherData.daily.temperature_2m_min,
        sunrise: weatherData.daily.sunrise,
        sunset: weatherData.daily.sunset,
        uvIndexMax: weatherData.daily.uv_index_max,
        precipitationSum: weatherData.daily.precipitation_sum,
        precipitationProbabilityMax: weatherData.daily.precipitation_probability_max,
        windSpeedMax: weatherData.daily.wind_speed_10m_max,
      };

      const airQuality: AirQuality = {
        usAqi: aqData.current?.us_aqi ?? 0,
        pm10: aqData.current?.pm10 ?? 0,
        pm25: aqData.current?.pm2_5 ?? 0,
      };

      set({ currentWeather, hourlyForecast, dailyForecast, airQuality, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
}));
