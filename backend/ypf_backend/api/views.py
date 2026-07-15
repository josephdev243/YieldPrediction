from datetime import date

from django.contrib.auth import get_user_model
from django.db.models import Avg, Count, Q, Sum
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from ypf_backend.api.serializers import (
    CropPlantingSerializer,
    CropSerializer,
    FarmSerializer,
    FieldSerializer,
    InputUsageSerializer,
    PestDiseaseAlertSerializer,
    RecommendationSerializer,
    UserRegistrationSerializer,
    UserSerializer,
    WeatherDataSerializer,
    YieldPredictionSerializer,
    YieldRecordSerializer,
)
from ypf_backend.farms.models import (
    Crop,
    CropPlanting,
    Farm,
    Field,
    InputUsage,
    PestDiseaseAlert,
    Recommendation,
    WeatherData,
    YieldPrediction,
    YieldRecord,
)

User = get_user_model()


def _farm_scope_for_user(user):
    if user.is_staff or user.role == "admin":
        return Farm.objects.all()
    if user.role == "extension_officer":
        return Farm.objects.filter(Q(extension_officers=user) | Q(user=user)).distinct()
    return Farm.objects.filter(user=user)


class UserViewSet(viewsets.ModelViewSet):
    """User management endpoints."""

    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request):
        """User registration endpoint."""
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                {
                    "user": UserSerializer(user).data,
                    "message": "User registered successfully",
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get current user profile."""
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class FarmViewSet(viewsets.ModelViewSet):
    """Farm management endpoints."""

    queryset = Farm.objects.all()
    serializer_class = FarmSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["user", "climate_zone"]
    search_fields = ["name", "location"]

    def get_queryset(self):
        return _farm_scope_for_user(self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=["get"])
    def dashboard(self, request, pk=None):
        """Get farm dashboard summary."""
        farm = self.get_object()
        active_crops = CropPlanting.objects.filter(
            field__farm=farm,
            status__in=["planned", "growing"],
        ).count()
        recent_yield = YieldRecord.objects.filter(planting__field__farm=farm).aggregate(
            avg_yield=Avg("yield_per_hectare")
        )["avg_yield"]
        pending_recommendations = Recommendation.objects.filter(
            farm=farm,
            is_read=False,
            is_dismissed=False,
        ).count()
        current_weather = WeatherData.objects.filter(farm=farm).order_by("-date").first()

        data = {
            "farm_id": farm.id,
            "farm_name": farm.name,
            "total_area": farm.total_area_hectares,
            "active_crops": active_crops,
            "total_fields": farm.fields.count(),
            "recent_yield": recent_yield,
            "pending_recommendations": pending_recommendations,
            "current_weather": WeatherDataSerializer(current_weather).data if current_weather else None,
        }
        return Response(data)


class FieldViewSet(viewsets.ModelViewSet):
    """Field management endpoints."""

    queryset = Field.objects.all()
    serializer_class = FieldSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["farm"]

    def get_queryset(self):
        return Field.objects.filter(farm__in=_farm_scope_for_user(self.request.user))


class CropViewSet(viewsets.ReadOnlyModelViewSet):
    """Crop information endpoints (read-only)."""

    queryset = Crop.objects.all()
    serializer_class = CropSerializer
    permission_classes = [IsAuthenticated]
    search_fields = ["name", "scientific_name"]


class CropPlantingViewSet(viewsets.ModelViewSet):
    """Crop planting management."""

    queryset = CropPlanting.objects.all()
    serializer_class = CropPlantingSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["field", "crop", "status"]

    def get_queryset(self):
        return CropPlanting.objects.filter(field__farm__in=_farm_scope_for_user(self.request.user))

    @action(detail=True, methods=["post"])
    def mark_harvested(self, request, pk=None):
        """Mark a crop planting as harvested."""
        planting = self.get_object()
        planting.status = "harvested"
        planting.save(update_fields=["status", "updated_at"])
        return Response({"status": "marked as harvested"})


class YieldRecordViewSet(viewsets.ModelViewSet):
    """Yield record management."""

    queryset = YieldRecord.objects.all()
    serializer_class = YieldRecordSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["planting", "quality_grade"]

    def get_queryset(self):
        return YieldRecord.objects.filter(
            planting__field__farm__in=_farm_scope_for_user(self.request.user)
        )

    @action(detail=False, methods=["get"])
    def analytics(self, request):
        """Get yield analytics."""
        yields = self.get_queryset()
        stats = {
            "total_harvested_kg": yields.aggregate(Sum("quantity_harvested_kg"))["quantity_harvested_kg__sum"] or 0,
            "average_yield_per_hectare": yields.aggregate(Avg("yield_per_hectare"))["yield_per_hectare__avg"] or 0,
            "total_records": yields.count(),
        }
        return Response(stats)


class WeatherDataViewSet(viewsets.ReadOnlyModelViewSet):
    """Weather data endpoints."""

    queryset = WeatherData.objects.all()
    serializer_class = WeatherDataSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["farm", "date"]
    ordering = ["-date"]

    def get_queryset(self):
        return WeatherData.objects.filter(farm__in=_farm_scope_for_user(self.request.user))

    @action(detail=False, methods=["get"])
    def forecast(self, request):
        """Get weather forecast for farms."""
        farm_id = request.query_params.get("farm_id")
        if farm_id:
            farm = _farm_scope_for_user(request.user).filter(id=farm_id).first()
            if not farm:
                return Response({"error": "Farm not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"farm_id": farm.id, "forecast": []})
        return Response({"error": "farm_id required"}, status=status.HTTP_400_BAD_REQUEST)


class YieldPredictionViewSet(viewsets.ReadOnlyModelViewSet):
    """Yield prediction endpoints."""

    queryset = YieldPrediction.objects.all()
    serializer_class = YieldPredictionSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["planting"]

    def get_queryset(self):
        return YieldPrediction.objects.filter(
            planting__field__farm__in=_farm_scope_for_user(self.request.user)
        )


class RecommendationViewSet(viewsets.ModelViewSet):
    """Recommendation endpoints."""

    queryset = Recommendation.objects.all()
    serializer_class = RecommendationSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["farm", "category", "priority", "is_read", "is_dismissed"]

    def get_queryset(self):
        return Recommendation.objects.filter(
            farm__in=_farm_scope_for_user(self.request.user),
            is_dismissed=False,
        )

    @action(detail=True, methods=["post"])
    def mark_read(self, request, pk=None):
        """Mark a recommendation as read."""
        recommendation = self.get_object()
        recommendation.is_read = True
        recommendation.save(update_fields=["is_read", "updated_at"])
        return Response({"status": "marked as read"})

    @action(detail=True, methods=["post"])
    def dismiss(self, request, pk=None):
        """Dismiss a recommendation from active feed."""
        recommendation = self.get_object()
        recommendation.is_dismissed = True
        recommendation.is_read = True
        recommendation.save(update_fields=["is_dismissed", "is_read", "updated_at"])
        return Response({"status": "dismissed"})


class InputUsageViewSet(viewsets.ModelViewSet):
    """Input usage tracking endpoints."""

    queryset = InputUsage.objects.all()
    serializer_class = InputUsageSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["field", "planting", "resource_type", "season", "season_year", "unit"]
    search_fields = ["field__name", "field__farm__name", "notes", "season", "input_name", "active_ingredient"]
    ordering = ["-application_date", "-created_at"]

    def get_queryset(self):
        return (
            InputUsage.objects.filter(field__farm__in=_farm_scope_for_user(self.request.user))
            .select_related("field", "field__farm", "planting", "planting__crop")
        )

    @action(detail=False, methods=["get"])
    def seasonal_summary(self, request):
        """Summarize input usage by resource type for a season."""
        queryset = self.get_queryset()
        field_id = request.query_params.get("field_id")
        season = request.query_params.get("season")
        season_year = request.query_params.get("season_year")

        if field_id:
            queryset = queryset.filter(field_id=field_id)
        if season:
            queryset = queryset.filter(season=season)
        if season_year:
            queryset = queryset.filter(season_year=season_year)

        summary_by_resource = (
            queryset.values("resource_type")
            .annotate(total_quantity=Sum("quantity"), total_cost=Sum("total_cost"), entries=Count("id"))
            .order_by("resource_type")
        )

        totals = queryset.aggregate(entries=Count("id"), quantity=Sum("quantity"), cost=Sum("total_cost"))
        total_cost = totals["cost"] or 0

        actual_yield = YieldRecord.objects.filter(planting__input_usages__in=queryset).aggregate(
            total=Sum("quantity_harvested_kg")
        )["total"] or 0

        predicted_yield = YieldPrediction.objects.filter(planting__input_usages__in=queryset).aggregate(
            total=Sum("predicted_yield_kg")
        )["total"] or 0

        return Response(
            {
                "filters": {
                    "field_id": field_id,
                    "season": season,
                    "season_year": season_year,
                },
                "summary": summary_by_resource,
                "totals": {
                    "entries": totals["entries"] or 0,
                    "quantity": totals["quantity"] or 0,
                    "cost": total_cost,
                    "actual_yield_kg": actual_yield,
                    "predicted_yield_kg": predicted_yield,
                    "cost_per_actual_yield_kg": round(total_cost / actual_yield, 2) if actual_yield else None,
                    "cost_per_predicted_yield_kg": round(total_cost / predicted_yield, 2) if predicted_yield else None,
                },
            }
        )


class PestDiseaseAlertViewSet(viewsets.ModelViewSet):
    """Actionable pest and disease alerts for farmers."""

    queryset = PestDiseaseAlert.objects.all()
    serializer_class = PestDiseaseAlertSerializer
    permission_classes = [IsAuthenticated]
    filterset_fields = ["farm", "field", "crop", "alert_type", "risk_level", "is_acknowledged"]
    search_fields = ["title", "description", "field__name", "crop__name", "season"]
    ordering = ["-risk_score", "-created_at"]

    def get_queryset(self):
        return PestDiseaseAlert.objects.filter(
            farm__in=_farm_scope_for_user(self.request.user)
        ).select_related("farm", "field", "crop")

    def _season_label(self, weather_date):
        if not weather_date:
            return ""
        month = weather_date.month
        if month in (3, 4, 5):
            return "Long Rains"
        if month in (10, 11, 12):
            return "Short Rains"
        return "Dry Season"

    def _crop_risk_profile(self, crop):
        crop_name = (crop.name or "").lower()

        if any(keyword in crop_name for keyword in ("rice", "leafy", "vegetable", "tomato", "potato")):
            return {"fungal_bonus": 12, "disease_bonus": 10, "pest_bonus": 4}

        if any(keyword in crop_name for keyword in ("bean", "pea", "soy", "groundnut")):
            return {"fungal_bonus": 8, "disease_bonus": 10, "pest_bonus": 6}

        if any(keyword in crop_name for keyword in ("maize", "corn", "sorghum", "millet", "cassava")):
            return {"fungal_bonus": 6, "disease_bonus": 6, "pest_bonus": 12}

        return {"fungal_bonus": 5, "disease_bonus": 5, "pest_bonus": 5}

    def _classify_alert(self, field, crop, weather):
        humidity = weather.humidity_percent if weather else (field.moisture_level or 0)
        rainfall = weather.rainfall_mm if weather else 0
        temperature = weather.temperature_max if weather else 0
        moisture = field.moisture_level or 0
        season = self._season_label(weather.date if weather else None)
        crop_risk = self._crop_risk_profile(crop)
        wet_season = season in ("Long Rains", "Short Rains")

        fungal_risk = humidity >= (80 - min(crop_risk["fungal_bonus"] // 3, 6)) and rainfall >= (
            12 - min(crop_risk["fungal_bonus"] // 2, 6)
        )
        fungal_risk = fungal_risk and 18 <= temperature <= 30 and wet_season

        if fungal_risk:
            return {
                "alert_type": PestDiseaseAlert.ALERT_FUNGAL,
                "risk_level": PestDiseaseAlert.RISK_CRITICAL if humidity >= 90 else PestDiseaseAlert.RISK_HIGH,
                "title": f"Fungal pressure rising in {field.name}",
                "description": (
                    f"{season or 'Current'} conditions are favoring fungal spread in {crop.name}. "
                    "High humidity and rainfall increase infection pressure, so scout leaf surfaces and tighten canopy airflow."
                ),
            }

        disease_risk = humidity >= (72 - min(crop_risk["disease_bonus"] // 3, 5)) and rainfall >= 8
        disease_risk = disease_risk and (wet_season or moisture >= 35)

        if disease_risk:
            return {
                "alert_type": PestDiseaseAlert.ALERT_DISEASE,
                "risk_level": PestDiseaseAlert.RISK_HIGH if moisture >= 40 else PestDiseaseAlert.RISK_MEDIUM,
                "title": f"Disease watch for {crop.name}",
                "description": (
                    f"{season or 'Seasonal'} moisture and humidity indicate elevated disease pressure on {field.name}. "
                    "Check leaf spots, blight symptoms, and canopy airflow before symptoms expand."
                ),
            }

        pest_risk = temperature >= 28 and humidity <= (58 - min(crop_risk["pest_bonus"] // 4, 8)) and moisture <= 35
        pest_risk = pest_risk or (not wet_season and temperature >= 30 and moisture <= 40)

        if pest_risk:
            return {
                "alert_type": PestDiseaseAlert.ALERT_PEST,
                "risk_level": PestDiseaseAlert.RISK_HIGH if moisture <= 25 else PestDiseaseAlert.RISK_MEDIUM,
                "title": f"Pest pressure risk on {field.name}",
                "description": (
                    f"Hot, drier conditions can increase pest activity for {crop.name}, especially outside the main rains. "
                    "Inspect stems and undersides of leaves and plan targeted control if needed."
                ),
            }

        return None

    def _generate_for_farm(self, farm):
        weather = WeatherData.objects.filter(farm=farm).order_by("-date").first()
        plantings = CropPlanting.objects.filter(
            field__farm=farm,
            status__in=["planned", "growing"],
        ).select_related("field", "crop")

        created_alerts = []
        for planting in plantings:
            alert_data = self._classify_alert(planting.field, planting.crop, weather)
            if not alert_data:
                continue

            humidity = weather.humidity_percent if weather else (planting.field.moisture_level or 0)
            rainfall = weather.rainfall_mm if weather else 0
            temperature = weather.temperature_max if weather else 0
            season = self._season_label(weather.date if weather else None)

            risk_score = min(
                100,
                round(
                    (humidity * 0.35)
                    + (rainfall * 2.0)
                    + max(0, 32 - abs(24 - temperature)) * 1.5
                    + max(0, 60 - (planting.field.moisture_level or 0)) * 0.8,
                    0,
                ),
            )

            alert, _ = PestDiseaseAlert.objects.update_or_create(
                farm=farm,
                field=planting.field,
                crop=planting.crop,
                alert_type=alert_data["alert_type"],
                triggered_weather_date=weather.date if weather else None,
                defaults={
                    "risk_level": alert_data["risk_level"],
                    "title": alert_data["title"],
                    "description": alert_data["description"],
                    "season": season,
                    "rainfall_mm": rainfall,
                    "humidity_percent": humidity,
                    "temperature_c": temperature,
                    "risk_score": risk_score,
                    "is_acknowledged": False,
                },
            )
            created_alerts.append(alert)

        return created_alerts

    def _farm_scope(self, request, farm_id=None):
        farms = _farm_scope_for_user(request.user)
        if farm_id:
            farms = farms.filter(id=farm_id)
        return farms

    @action(detail=False, methods=["get"])
    def feed(self, request):
        """Return the current alert feed for the authenticated farmer."""
        farm_id = request.query_params.get("farm_id")
        farms = self._farm_scope(request, farm_id=farm_id)

        for farm in farms:
            self._generate_for_farm(farm)

        queryset = self.get_queryset().filter(farm__in=farms)

        serializer = self.get_serializer(queryset[:20], many=True)
        return Response(serializer.data)

    @action(detail=False, methods=["post"])
    def generate(self, request):
        """Generate alerts from current farm weather and crop context."""
        farm_id = request.data.get("farm_id") or request.query_params.get("farm_id")
        farms = self._farm_scope(request, farm_id=farm_id)

        if not farms.exists():
            if farm_id:
                return Response({"error": "Farm not found"}, status=status.HTTP_404_NOT_FOUND)
            return Response({"error": "No farm found for authenticated user"}, status=status.HTTP_404_NOT_FOUND)

        alerts = []
        for farm in farms:
            alerts.extend(self._generate_for_farm(farm))

        return Response(
            {"generated": len(alerts), "alerts": self.get_serializer(alerts, many=True).data},
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def acknowledge(self, request, pk=None):
        """Mark an alert as acknowledged."""
        alert = self.get_object()
        alert.is_acknowledged = True
        alert.save(update_fields=["is_acknowledged", "updated_at"])
        return Response({"status": "acknowledged"})
