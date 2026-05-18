from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Farm(models.Model):
    """Farm model - represents a farm owned by a user."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='farm')
    name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    coordinates = models.PointField(geography=True, null=True, blank=True)  # GPS coordinates
    total_area_hectares = models.FloatField(validators=[MinValueValidator(0.1)])
    soil_type = models.CharField(max_length=100, blank=True)
    climate_zone = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Farm'
        verbose_name_plural = 'Farms'
    
    def __str__(self):
        return f"{self.name} ({self.user.get_full_name()})"


class Field(models.Model):
    """Field model - represents a specific field within a farm."""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    area_hectares = models.FloatField(validators=[MinValueValidator(0.01)])
    boundary = models.PolygonField(geography=True, null=True, blank=True)  # Field boundary polygon
    soil_ph = models.FloatField(null=True, blank=True, validators=[MinValueValidator(4.0), MaxValueValidator(9.0)])
    moisture_level = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Field'
        verbose_name_plural = 'Fields'
    
    def __str__(self):
        return f"{self.name} - {self.farm.name}"


class Crop(models.Model):
    """Crop model - represents crop types that can be grown."""
    name = models.CharField(max_length=255, unique=True)
    scientific_name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    growing_period_days = models.IntegerField(validators=[MinValueValidator(1)])
    optimal_temperature_min = models.FloatField(help_text="Celsius")
    optimal_temperature_max = models.FloatField(help_text="Celsius")
    optimal_rainfall_mm = models.FloatField(help_text="mm per season")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Crop'
        verbose_name_plural = 'Crops'
    
    def __str__(self):
        return self.name


class CropPlanting(models.Model):
    """CropPlanting model - tracks crop planting in fields."""
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='plantings')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='plantings')
    planting_date = models.DateField()
    expected_harvest_date = models.DateField()
    quantity_planted_kg = models.FloatField(validators=[MinValueValidator(0)])
    status = models.CharField(max_length=50, choices=[
        ('planned', 'Planned'),
        ('growing', 'Growing'),
        ('harvested', 'Harvested'),
        ('failed', 'Failed'),
    ], default='planned')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Crop Planting'
        verbose_name_plural = 'Crop Plantings'
    
    def __str__(self):
        return f"{self.crop.name} in {self.field.name}"


class YieldRecord(models.Model):
    """YieldRecord model - tracks harvest yields."""
    planting = models.OneToOneField(CropPlanting, on_delete=models.CASCADE, related_name='yield')
    harvest_date = models.DateField()
    quantity_harvested_kg = models.FloatField(validators=[MinValueValidator(0)])
    yield_per_hectare = models.FloatField(validators=[MinValueValidator(0)], help_text="kg/hectare")
    quality_grade = models.CharField(max_length=10, choices=[
        ('A', 'Grade A'),
        ('B', 'Grade B'),
        ('C', 'Grade C'),
    ], default='B')
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Yield Record'
        verbose_name_plural = 'Yield Records'
    
    def __str__(self):
        return f"Yield: {self.planting.crop.name} - {self.harvest_date}"


class WeatherData(models.Model):
    """WeatherData model - stores weather information by location."""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='weather_data')
    date = models.DateField()
    temperature_min = models.FloatField(help_text="Celsius")
    temperature_max = models.FloatField(help_text="Celsius")
    rainfall_mm = models.FloatField(default=0)
    humidity_percent = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    wind_speed_kmh = models.FloatField(default=0)
    condition = models.CharField(max_length=100)  # Sunny, Rainy, Cloudy, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Weather Data'
        verbose_name_plural = 'Weather Data'
        unique_together = ('farm', 'date')
    
    def __str__(self):
        return f"Weather for {self.farm.name} on {self.date}"


class YieldPrediction(models.Model):
    """YieldPrediction model - stores ML-generated predictions."""
    planting = models.ForeignKey(CropPlanting, on_delete=models.CASCADE, related_name='predictions')
    predicted_yield_kg = models.FloatField(help_text="Predicted yield in kg")
    confidence_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)])
    prediction_date = models.DateField(auto_now_add=True)
    model_version = models.CharField(max_length=50, default='v1.0')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Yield Prediction'
        verbose_name_plural = 'Yield Predictions'
    
    def __str__(self):
        return f"Prediction for {self.planting.crop.name}: {self.predicted_yield_kg}kg"


class Recommendation(models.Model):
    """Recommendation model - AI-generated farming recommendations."""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='recommendations')
    category = models.CharField(max_length=50, choices=[
        ('irrigation', 'Irrigation'),
        ('fertilizer', 'Fertilizer'),
        ('pest_control', 'Pest Control'),
        ('planting', 'Planting'),
        ('harvesting', 'Harvesting'),
    ])
    title = models.CharField(max_length=255)
    description = models.TextField()
    priority = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ], default='medium')
    action_required_by = models.DateField(null=True, blank=True)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Recommendation'
        verbose_name_plural = 'Recommendations'
        ordering = ['-priority', '-created_at']
    
    def __str__(self):
        return f"{self.category.upper()}: {self.title}"
