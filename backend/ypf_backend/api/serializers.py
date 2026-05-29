from rest_framework import serializers
from django.contrib.auth import get_user_model
from ypf_backend.farms.models import (
    Farm, Field, Crop, CropPlanting, YieldRecord, WeatherData, 
    YieldPrediction, Recommendation, InputUsage, PestDiseaseAlert
)

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 
                  'phone_number', 'location', 'profile_picture', 'bio', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True, write_only=True)
    password = serializers.CharField(write_only=True, min_length=6)
    password_confirm = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 
                  'password_confirm', 'role', 'phone_number']
    
    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({"password": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        username = validated_data.pop('username', '') or validated_data['email']
        user = User.objects.create_user(username=username, **validated_data)
        return user


class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ['id', 'name', 'scientific_name', 'description', 'growing_period_days',
                  'optimal_temperature_min', 'optimal_temperature_max', 'optimal_rainfall_mm']


class WeatherDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeatherData
        fields = ['id', 'farm', 'date', 'temperature_min', 'temperature_max', 
                  'rainfall_mm', 'humidity_percent', 'wind_speed_kmh', 'condition']


class YieldPredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = YieldPrediction
        fields = ['id', 'planting', 'predicted_yield_kg', 'confidence_score', 
                  'prediction_date', 'model_version']
        read_only_fields = ['id', 'prediction_date']


class YieldRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = YieldRecord
        fields = ['id', 'planting', 'harvest_date', 'quantity_harvested_kg', 
                  'yield_per_hectare', 'quality_grade', 'notes', 'created_at']
        read_only_fields = ['id', 'created_at']


class CropPlantingSerializer(serializers.ModelSerializer):
    crop_details = CropSerializer(source='crop', read_only=True)
    yield_info = YieldRecordSerializer(source='planting_yields', read_only=True)
    
    class Meta:
        model = CropPlanting
        fields = ['id', 'field', 'crop', 'crop_details', 'planting_date', 
                  'expected_harvest_date', 'quantity_planted_kg', 'status', 
                  'notes', 'yield_info', 'created_at']
        read_only_fields = ['id', 'created_at']


class FieldSerializer(serializers.ModelSerializer):
    plantings = CropPlantingSerializer(many=True, read_only=True)
    
    class Meta:
        model = Field
        fields = ['id', 'farm', 'name', 'area_hectares', 'boundary', 'soil_ph',
                  'moisture_level', 'nutrient_content', 'plantings', 'created_at']
        read_only_fields = ['id', 'created_at']


class FarmSerializer(serializers.ModelSerializer):
    fields = FieldSerializer(many=True, read_only=True)
    weather_data = WeatherDataSerializer(many=True, read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Farm
        fields = ['id', 'user', 'user_details', 'name', 'location', 'coordinates',
                  'total_area_hectares', 'soil_type', 'climate_zone', 'fields',
                  'weather_data', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class RecommendationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendation
        fields = ['id', 'farm', 'category', 'title', 'description', 'priority',
                  'action_required_by', 'is_read', 'created_at']
        read_only_fields = ['id', 'created_at']


class InputUsageSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source='field.name', read_only=True)

    class Meta:
        model = InputUsage
        fields = [
            'id', 'field', 'field_name', 'season', 'season_year', 'resource_type',
            'quantity', 'unit', 'cost', 'application_date', 'notes',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'field_name', 'created_at', 'updated_at']


class PestDiseaseAlertSerializer(serializers.ModelSerializer):
    field_name = serializers.CharField(source='field.name', read_only=True)
    crop_name = serializers.CharField(source='crop.name', read_only=True)

    class Meta:
        model = PestDiseaseAlert
        fields = [
            'id', 'farm', 'field', 'field_name', 'crop', 'crop_name',
            'alert_type', 'risk_level', 'title', 'description', 'season',
            'triggered_weather_date', 'rainfall_mm', 'humidity_percent',
            'temperature_c', 'risk_score', 'is_acknowledged', 'created_at',
            'updated_at'
        ]
        read_only_fields = ['id', 'field_name', 'crop_name', 'created_at', 'updated_at']


class FarmDashboardSerializer(serializers.Serializer):
    """Serializer for farm dashboard summary data."""
    farm_id = serializers.IntegerField()
    farm_name = serializers.CharField()
    total_area = serializers.FloatField()
    active_crops = serializers.IntegerField()
    total_fields = serializers.IntegerField()
    recent_yield = serializers.FloatField()
    pending_recommendations = serializers.IntegerField()
    current_weather = WeatherDataSerializer()
