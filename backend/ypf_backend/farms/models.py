from django.contrib.gis.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator

User = get_user_model()


class Farm(models.Model):
    """Farm model - represents a farm owned by a user."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='farms')
    extension_officers = models.ManyToManyField(
        User,
        related_name='assigned_farms',
        blank=True,
    )
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
        owner_name = self.user.get_full_name() or self.user.email
        return f"{self.name} ({owner_name})"


class Field(models.Model):
    """Field model - represents a specific field within a farm."""
    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='fields')
    name = models.CharField(max_length=255)
    area_hectares = models.FloatField(validators=[MinValueValidator(0.01)])
    boundary = models.PolygonField(geography=True, null=True, blank=True)  # Field boundary polygon
    soil_ph = models.FloatField(null=True, blank=True, validators=[MinValueValidator(4.0), MaxValueValidator(9.0)])
    moisture_level = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    nutrient_content = models.FloatField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Nutrient content score (%)'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    soil_type = models.CharField(max_length=100)
    
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
    planting = models.OneToOneField(CropPlanting, on_delete=models.CASCADE, related_name='planting_yields')
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
    predicted_yield_per_hectare = models.FloatField(
        default=0,
        help_text="Predicted yield per hectare in kg"
    )
    estimated_harvest_date = models.DateField(null=True, blank=True)
    confidence_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(1)])
    feature_importance = models.JSONField(default=dict, blank=True)
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
    is_dismissed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Recommendation'
        verbose_name_plural = 'Recommendations'
        ordering = ['-priority', '-created_at']
    
    def __str__(self):
        return f"{self.category.upper()}: {self.title}"


class InputUsage(models.Model):
    """Tracks farming inputs used per field and season."""
    RESOURCE_FERTILIZER = 'fertilizer'
    RESOURCE_PESTICIDE = 'pesticide'
    RESOURCE_HERBICIDE = 'herbicide'
    RESOURCE_IRRIGATION = 'irrigation'
    RESOURCE_SEED = 'seed'
    RESOURCE_LABOUR = 'labour'

    UNIT_KG = 'kg'
    UNIT_LITERS = 'liters'
    UNIT_BAGS = 'bags'
    UNIT_CUBIC_METERS = 'm3'

    RESOURCE_CHOICES = [
        (RESOURCE_FERTILIZER, 'Fertilizer'),
        (RESOURCE_PESTICIDE, 'Pesticide'),
        (RESOURCE_HERBICIDE, 'Herbicide'),
        (RESOURCE_IRRIGATION, 'Irrigation'),
        (RESOURCE_SEED, 'Seed'),
        (RESOURCE_LABOUR, 'Labour'),
    ]

    UNIT_CHOICES = [
        (UNIT_KG, 'Kilograms (kg)'),
        (UNIT_LITERS, 'Liters'),
        (UNIT_BAGS, 'Bags'),
        (UNIT_CUBIC_METERS, 'Cubic meters (m3)'),
    ]

    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='input_usages')
    planting = models.ForeignKey(
        CropPlanting,
        on_delete=models.SET_NULL,
        related_name='input_usages',
        null=True,
        blank=True,
    )
    season = models.CharField(max_length=50, help_text='e.g. Long Rains, Dry Season')
    season_year = models.PositiveIntegerField()
    resource_type = models.CharField(max_length=20, choices=RESOURCE_CHOICES)
    input_name = models.CharField(max_length=255, blank=True)
    active_ingredient = models.CharField(max_length=255, blank=True)
    quantity = models.FloatField(validators=[MinValueValidator(0.0)])
    unit = models.CharField(max_length=20, choices=UNIT_CHOICES)
    irrigation_method = models.CharField(max_length=100, blank=True)
    duration_minutes = models.PositiveIntegerField(null=True, blank=True)
    cost_per_unit = models.FloatField(validators=[MinValueValidator(0.0)], null=True, blank=True)
    cost = models.FloatField(validators=[MinValueValidator(0.0)], null=True, blank=True)
    total_cost = models.FloatField(validators=[MinValueValidator(0.0)], null=True, blank=True)
    application_date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Input Usage'
        verbose_name_plural = 'Input Usages'
        ordering = ['-application_date', '-created_at']
        indexes = [
            models.Index(fields=['field', 'season_year', 'season']),
            models.Index(fields=['resource_type']),
        ]

    def __str__(self):
        return (
            f"{self.get_resource_type_display()} - {self.field.name} "
            f"({self.season} {self.season_year})"
        )


class PestDiseaseAlert(models.Model):
    """Actionable pest and disease alert generated from weather and crop context."""
    ALERT_FUNGAL = 'fungal'
    ALERT_DISEASE = 'disease'
    ALERT_PEST = 'pest'

    RISK_LOW = 'low'
    RISK_MEDIUM = 'medium'
    RISK_HIGH = 'high'
    RISK_CRITICAL = 'critical'

    ALERT_TYPE_CHOICES = [
        (ALERT_FUNGAL, 'Fungal Risk'),
        (ALERT_DISEASE, 'Disease Risk'),
        (ALERT_PEST, 'Pest Pressure'),
    ]

    RISK_LEVEL_CHOICES = [
        (RISK_LOW, 'Low'),
        (RISK_MEDIUM, 'Medium'),
        (RISK_HIGH, 'High'),
        (RISK_CRITICAL, 'Critical'),
    ]

    farm = models.ForeignKey(Farm, on_delete=models.CASCADE, related_name='pest_disease_alerts')
    field = models.ForeignKey(Field, on_delete=models.CASCADE, related_name='pest_disease_alerts')
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE, related_name='pest_disease_alerts')
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField()
    season = models.CharField(max_length=50, blank=True)
    triggered_weather_date = models.DateField(null=True, blank=True)
    rainfall_mm = models.FloatField(default=0)
    humidity_percent = models.IntegerField(default=0)
    temperature_c = models.FloatField(default=0)
    risk_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    is_acknowledged = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Pest Disease Alert'
        verbose_name_plural = 'Pest Disease Alerts'
        ordering = ['-risk_score', '-created_at']
        indexes = [
            models.Index(fields=['farm', 'is_acknowledged', 'risk_level']),
            models.Index(fields=['alert_type', 'risk_level']),
        ]

    def __str__(self):
        return f"{self.get_alert_type_display()} - {self.crop.name} ({self.risk_level})"
