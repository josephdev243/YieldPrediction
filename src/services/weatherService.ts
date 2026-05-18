import { get } from "../lib/api";
import type { WeatherData, WeatherForecast, ApiResponse } from "../lib/types";

/**
 * Get current weather for a field
 */
export const getCurrentWeather = async (
  fieldId: string,
): Promise<ApiResponse<WeatherData>> => {
  return get<WeatherData>(`/weather/current/${fieldId}`);
};

/**
 * Get weather forecast for a field
 */
export const getWeatherForecast = async (
  fieldId: string,
  days: number = 7,
): Promise<ApiResponse<WeatherForecast[]>> => {
  return get<WeatherForecast[]>(`/weather/forecast/${fieldId}?days=${days}`);
};

/**
 * Get weather history for a field
 */
export const getWeatherHistory = async (
  fieldId: string,
  startDate: string,
  endDate: string,
): Promise<ApiResponse<WeatherData[]>> => {
  return get<WeatherData[]>(
    `/weather/history/${fieldId}?startDate=${startDate}&endDate=${endDate}`,
  );
};

/**
 * Get weather data by coordinates
 */
export const getWeatherByCoordinates = async (
  latitude: number,
  longitude: number,
): Promise<ApiResponse<WeatherData>> => {
  return get<WeatherData>(
    `/weather/coordinates?lat=${latitude}&lon=${longitude}`,
  );
};

/**
 * Get weather alerts for region
 */
export const getWeatherAlerts = async (
  region: string,
): Promise<ApiResponse<any[]>> => {
  return get<any[]>(`/weather/alerts/${region}`);
};

/**
 * Format weather condition for display
 */
export const formatWeatherCondition = (condition: string): string => {
  const conditions: Record<string, string> = {
    clear: "Clear Sky",
    cloudy: "Cloudy",
    rainy: "Rainy",
    stormy: "Stormy",
    snowy: "Snowy",
    foggy: "Foggy",
    windy: "Windy",
    "partly-cloudy": "Partly Cloudy",
  };
  return conditions[condition.toLowerCase()] || condition;
};

/**
 * Get weather icon emoji
 */
export const getWeatherIcon = (condition: string): string => {
  const icons: Record<string, string> = {
    clear: "☀️",
    cloudy: "☁️",
    rainy: "🌧️",
    stormy: "⛈️",
    snowy: "❄️",
    foggy: "🌫️",
    windy: "💨",
    "partly-cloudy": "⛅",
  };
  return icons[condition.toLowerCase()] || "🌤️";
};

/**
 * Calculate rainfall probability
 */
export const calculateRainfallProbability = (humidity: number): number => {
  if (humidity > 80) return 80;
  if (humidity > 60) return 50;
  if (humidity > 40) return 20;
  return 5;
};

/**
 * Check if watering is needed
 */
export const isWateringNeeded = (
  rainfall: number,
  humidity: number,
): boolean => {
  return rainfall < 10 && humidity < 60;
};

/**
 * Get weather recommendation
 */
export const getWeatherRecommendation = (weather: WeatherData): string => {
  if (weather.rainfall > 20) {
    return "Good rainfall. No watering needed.";
  }
  if (weather.humidity > 70) {
    return "High humidity. Watch for fungal diseases.";
  }
  if (weather.temperature > 35) {
    return "High temperature. Ensure adequate watering.";
  }
  if (weather.temperature < 10) {
    return "Cold weather. Check crop frost protection.";
  }
  if (weather.windSpeed > 30) {
    return "Strong wind. Check for crop damage.";
  }
  return "Weather conditions are favorable.";
};
