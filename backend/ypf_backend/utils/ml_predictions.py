import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
import logging
from datetime import datetime
from ypf_backend.farms.models import YieldRecord, CropPlanting, WeatherData, YieldPrediction

logger = logging.getLogger(__name__)


class YieldPredictionModel:
    """Machine learning model for yield prediction."""
    
    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=100, random_state=42)
        self.scaler = StandardScaler()
        self.is_trained = False
    
    def prepare_training_data(self, crop_id=None):
        """Prepare historical data for model training."""
        queryset = YieldRecord.objects.select_related(
            'planting__field__farm',
            'planting__crop'
        )
        
        if crop_id:
            queryset = queryset.filter(planting__crop_id=crop_id)
        
        data = []
        for yield_record in queryset:
            planting = yield_record.planting
            field = planting.field
            
            # Get weather data during growing period
            weather = WeatherData.objects.filter(
                farm=field.farm,
                date__gte=planting.planting_date,
                date__lte=yield_record.harvest_date
            )
            
            if not weather.exists():
                continue
            
            weather_avg = weather.aggregate(
                avg_temp_min=models.Avg('temperature_min'),
                avg_temp_max=models.Avg('temperature_max'),
                total_rainfall=models.Sum('rainfall_mm'),
                avg_humidity=models.Avg('humidity_percent'),
            )
            
            features = {
                'area_hectares': field.area_hectares,
                'soil_ph': field.soil_ph or 6.5,
                'moisture_level': field.moisture_level or 50,
                'temp_min': weather_avg.get('avg_temp_min') or 20,
                'temp_max': weather_avg.get('avg_temp_max') or 30,
                'total_rainfall': weather_avg.get('total_rainfall') or 500,
                'humidity': weather_avg.get('avg_humidity') or 60,
                'growing_days': (yield_record.harvest_date - planting.planting_date).days,
            }
            
            data.append({
                **features,
                'yield_per_hectare': yield_record.yield_per_hectare
            })
        
        return pd.DataFrame(data) if data else None
    
    def train(self, crop_id=None):
        """Train the model on historical data."""
        df = self.prepare_training_data(crop_id)
        
        if df is None or df.empty:
            logger.warning("Insufficient data for training")
            return False
        
        X = df.drop('yield_per_hectare', axis=1)
        y = df['yield_per_hectare']
        
        try:
            X_scaled = self.scaler.fit_transform(X)
            self.model.fit(X_scaled, y)
            self.is_trained = True
            return True
        except Exception as e:
            logger.error(f"Error training model: {e}")
            return False
    
    def predict(self, planting):
        """Predict yield for a crop planting."""
        if not self.is_trained:
            logger.warning("Model not trained")
            return None
        
        try:
            field = planting.field
            weather = WeatherData.objects.filter(
                farm=field.farm,
                date__gte=planting.planting_date
            ).order_by('-date')
            
            if not weather.exists():
                logger.warning(f"No weather data for planting {planting.id}")
                return None
            
            weather_avg = weather.aggregate(
                avg_temp_min=models.Avg('temperature_min'),
                avg_temp_max=models.Avg('temperature_max'),
                total_rainfall=models.Sum('rainfall_mm'),
                avg_humidity=models.Avg('humidity_percent'),
            )
            
            days_elapsed = (datetime.now().date() - planting.planting_date).days
            
            features = np.array([[
                field.area_hectares,
                field.soil_ph or 6.5,
                field.moisture_level or 50,
                weather_avg.get('avg_temp_min') or 20,
                weather_avg.get('avg_temp_max') or 30,
                weather_avg.get('total_rainfall') or 500,
                weather_avg.get('avg_humidity') or 60,
                days_elapsed,
            ]])
            
            features_scaled = self.scaler.transform(features)
            prediction = self.model.predict(features_scaled)[0]
            confidence = self.model.score(features_scaled, [prediction])
            
            return {
                'predicted_yield': max(prediction, 0),
                'confidence': abs(confidence)
            }
        except Exception as e:
            logger.error(f"Error making prediction: {e}")
            return None


def generate_yield_predictions_for_farm(farm_id):
    """Generate predictions for all active plantings on a farm."""
    try:
        active_plantings = CropPlanting.objects.filter(
            field__farm_id=farm_id,
            status__in=['growing']
        )
        
        model = YieldPredictionModel()
        
        for planting in active_plantings:
            # Train model per crop type for better accuracy
            if model.train(crop_id=planting.crop_id):
                prediction_data = model.predict(planting)
                
                if prediction_data:
                    YieldPrediction.objects.create(
                        planting=planting,
                        predicted_yield_kg=prediction_data['predicted_yield'] * planting.field.area_hectares,
                        confidence_score=prediction_data['confidence'],
                    )
        
        return True
    except Exception as e:
        logger.error(f"Error generating predictions for farm {farm_id}: {e}")
        return False


# Import models properly
from django.db import models
