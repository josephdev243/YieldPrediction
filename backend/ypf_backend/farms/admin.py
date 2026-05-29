from django.contrib import admin
from ypf_backend.farms.models import (
    Farm, Field, Crop, CropPlanting, YieldRecord, WeatherData, 
    YieldPrediction, Recommendation, InputUsage, PestDiseaseAlert
)


@admin.register(Farm)
class FarmAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'location', 'total_area_hectares', 'created_at')
    list_filter = ('climate_zone', 'created_at')
    search_fields = ('name', 'location', 'user__username')
    readonly_fields = ('coordinates',)


@admin.register(Field)
class FieldAdmin(admin.ModelAdmin):
    list_display = ('name', 'farm', 'area_hectares', 'soil_type', 'soil_ph', 'moisture_level', 'nutrient_content', 'created_at')
    list_filter = ('farm', 'created_at')
    search_fields = ('name', 'farm__name')


@admin.register(Crop)
class CropAdmin(admin.ModelAdmin):
    list_display = ('name', 'growing_period_days', 'optimal_temperature_min', 'optimal_temperature_max')
    search_fields = ('name', 'scientific_name')


@admin.register(CropPlanting)
class CropPlantingAdmin(admin.ModelAdmin):
    list_display = ('crop', 'field', 'planting_date', 'status', 'created_at')
    list_filter = ('status', 'planting_date')
    search_fields = ('crop__name', 'field__name')


@admin.register(YieldRecord)
class YieldRecordAdmin(admin.ModelAdmin):
    list_display = ('planting', 'harvest_date', 'quantity_harvested_kg', 'yield_per_hectare', 'quality_grade')
    list_filter = ('quality_grade', 'harvest_date')
    search_fields = ('planting__crop__name', 'planting__field__name')


@admin.register(WeatherData)
class WeatherDataAdmin(admin.ModelAdmin):
    list_display = ('farm', 'date', 'temperature_max', 'rainfall_mm', 'condition')
    list_filter = ('farm', 'date', 'condition')
    search_fields = ('farm__name',)


@admin.register(YieldPrediction)
class YieldPredictionAdmin(admin.ModelAdmin):
    list_display = ('planting', 'predicted_yield_kg', 'confidence_score', 'model_version', 'prediction_date')
    list_filter = ('model_version', 'prediction_date')
    search_fields = ('planting__crop__name',)


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ('title', 'farm', 'category', 'priority', 'is_read', 'created_at')
    list_filter = ('category', 'priority', 'is_read', 'created_at')
    search_fields = ('title', 'farm__name')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(InputUsage)
class InputUsageAdmin(admin.ModelAdmin):
    list_display = (
        'field', 'resource_type', 'quantity', 'unit', 'season',
        'season_year', 'application_date'
    )
    list_filter = ('resource_type', 'season', 'season_year', 'application_date')
    search_fields = ('field__name', 'field__farm__name', 'notes')
    readonly_fields = ('created_at', 'updated_at')


@admin.register(PestDiseaseAlert)
class PestDiseaseAlertAdmin(admin.ModelAdmin):
    list_display = (
        'title', 'farm', 'field', 'crop', 'alert_type', 'risk_level',
        'risk_score', 'is_acknowledged', 'created_at'
    )
    list_filter = ('alert_type', 'risk_level', 'is_acknowledged', 'created_at')
    search_fields = ('title', 'description', 'farm__name', 'field__name', 'crop__name')
    readonly_fields = ('created_at', 'updated_at')
