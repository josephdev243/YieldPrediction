import { useState, useCallback } from "react";
import type { WeatherData, WeatherForecast } from "../lib/types";
import {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherHistory,
  getWeatherByCoordinates,
} from "../services/weatherService";

interface UseWeatherReturn {
  weather: WeatherData | null;
  forecast: WeatherForecast[];
  history: WeatherData[];
  isLoading: boolean;
  error: string | null;
  fetchWeather: (fieldId: string) => Promise<void>;
  fetchForecast: (fieldId: string, days?: number) => Promise<void>;
  fetchHistory: (
    fieldId: string,
    startDate: string,
    endDate: string,
  ) => Promise<void>;
  fetchWeatherByCoordinates: (
    latitude: number,
    longitude: number,
  ) => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for weather data management
 */
export const useWeather = (): UseWeatherReturn => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<WeatherForecast[]>([]);
  const [history, setHistory] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async (fieldId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getCurrentWeather(fieldId);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch weather");
      }

      setWeather(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching weather");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (fieldId: string, days = 7) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getWeatherForecast(fieldId, days);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch forecast");
      }

      setForecast(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching forecast");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchHistory = useCallback(
    async (fieldId: string, startDate: string, endDate: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getWeatherHistory(fieldId, startDate, endDate);

        if (!response.success || !response.data) {
          throw new Error(response.error || "Failed to fetch history");
        }

        setHistory(response.data);
      } catch (err: any) {
        setError(err.message || "Error fetching history");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const fetchWeatherByCoordinates = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await getWeatherByCoordinates(latitude, longitude);

        if (!response.success || !response.data) {
          throw new Error(
            response.error || "Failed to fetch weather by coordinates",
          );
        }

        setWeather(response.data);
      } catch (err: any) {
        setError(err.message || "Error fetching weather");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    weather,
    forecast,
    history,
    isLoading,
    error,
    fetchWeather,
    fetchForecast,
    fetchHistory,
    fetchWeatherByCoordinates,
    clearError,
  };
};
