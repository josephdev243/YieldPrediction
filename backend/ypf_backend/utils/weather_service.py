import requests
import logging
from datetime import datetime, timedelta
from django.conf import settings
from ypf_backend.farms.models import WeatherData, Farm

logger = logging.getLogger(__name__)


class OpenWeatherService:
    """Service to fetch weather data from OpenWeatherMap API."""
    
    BASE_URL = 'https://api.openweathermap.org/data/2.5'
    
    def __init__(self):
        self.api_key = settings.OPENWEATHER_API_KEY
    
    def get_current_weather(self, latitude, longitude):
        """Fetch current weather for coordinates."""
        url = f'{self.BASE_URL}/weather'
        params = {
            'lat': latitude,
            'lon': longitude,
            'appid': self.api_key,
            'units': 'metric'
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching weather: {e}")
            return None
    
    def get_forecast(self, latitude, longitude):
        """Fetch 5-day weather forecast for coordinates."""
        url = f'{self.BASE_URL}/forecast'
        params = {
            'lat': latitude,
            'lon': longitude,
            'appid': self.api_key,
            'units': 'metric'
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching forecast: {e}")
            return None
    
    def save_weather_data(self, farm, weather_data):
        """Save weather data to database."""
        if not weather_data:
            return None
        
        main_data = weather_data.get('main', {})
        weather_info = weather_data.get('weather', [{}])[0]
        
        try:
            weather_record, created = WeatherData.objects.update_or_create(
                farm=farm,
                date=datetime.now().date(),
                defaults={
                    'temperature_min': main_data.get('temp_min', 0),
                    'temperature_max': main_data.get('temp_max', 0),
                    'rainfall_mm': weather_data.get('rain', {}).get('1h', 0) * 25.4,  # Convert from inches
                    'humidity_percent': main_data.get('humidity', 0),
                    'wind_speed_kmh': weather_data.get('wind', {}).get('speed', 0) * 3.6,  # Convert from m/s
                    'condition': weather_info.get('main', 'Unknown'),
                }
            )
            return weather_record
        except Exception as e:
            logger.error(f"Error saving weather data: {e}")
            return None


class OpenMeteoService:
    """Service to fetch free historical and forecast data from Open-Meteo API."""
    
    BASE_URL = 'https://api.open-meteo.com/v1'
    
    def get_historical_data(self, latitude, longitude, start_date, end_date):
        """Fetch historical weather data for training ML models."""
        url = f'{self.BASE_URL}/archive'
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'start_date': start_date,
            'end_date': end_date,
            'daily': 'temperature_2m_max,temperature_2m_min,precipitation,windspeed_10m',
            'timezone': 'auto'
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching historical data: {e}")
            return None
    
    def get_forecast(self, latitude, longitude):
        """Fetch weather forecast."""
        url = f'{self.BASE_URL}/forecast'
        params = {
            'latitude': latitude,
            'longitude': longitude,
            'daily': 'temperature_2m_max,temperature_2m_min,precipitation,windspeed_10m',
            'timezone': 'auto'
        }
        try:
            response = requests.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            logger.error(f"Error fetching forecast: {e}")
            return None


def update_farm_weather_data(farm_id):
    """Update weather data for a farm."""
    try:
        farm = Farm.objects.get(id=farm_id)
        if not farm.coordinates:
            logger.warning(f"Farm {farm.id} has no coordinates")
            return False
        
        service = OpenWeatherService()
        weather_data = service.get_current_weather(
            farm.coordinates.y, 
            farm.coordinates.x
        )
        service.save_weather_data(farm, weather_data)
        return True
    except Farm.DoesNotExist:
        logger.error(f"Farm {farm_id} not found")
        return False
    except Exception as e:
        logger.error(f"Error updating weather for farm {farm_id}: {e}")
        return False
