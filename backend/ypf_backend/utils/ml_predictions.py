import logging
from datetime import datetime
from pathlib import Path
import re

import joblib
import numpy as np
import pandas as pd
from django.db.models import Avg, Count, Sum
from django.conf import settings
from sklearn.ensemble import RandomForestRegressor

from ypf_backend.farms.models import CropPlanting, InputUsage, WeatherData, YieldPrediction, YieldRecord

logger = logging.getLogger(__name__)

MIN_TRAINING_RECORDS_PER_CROP = 20

FEATURE_COLUMNS = [
    "area_hectares",
    "soil_ph",
    "moisture_level",
    "temp_avg",
    "total_rainfall",
    "fertilizer_quantity",
    "growing_days",
]

MODEL_FILE_PATTERN = re.compile(r"^rf_(?P<crop>[a-z0-9_]+)_v(?P<version>\d+)\.pkl$")


def _model_dir() -> Path:
    model_dir = Path(getattr(settings, "ML_MODEL_DIR", settings.BASE_DIR / "ml_models"))
    model_dir.mkdir(parents=True, exist_ok=True)
    return model_dir


def _slugify_crop_name(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", (name or "crop").strip().lower()).strip("_") or "crop"


def _next_model_file(crop_name: str) -> Path:
    crop_slug = _slugify_crop_name(crop_name)
    existing_versions = []
    for file_path in _model_dir().glob(f"rf_{crop_slug}_v*.pkl"):
        match = MODEL_FILE_PATTERN.match(file_path.name)
        if match:
            existing_versions.append(int(match.group("version")))
    next_version = (max(existing_versions) + 1) if existing_versions else 1
    return _model_dir() / f"rf_{crop_slug}_v{next_version}.pkl"


def _latest_model_file(crop_name: str) -> Path | None:
    crop_slug = _slugify_crop_name(crop_name)
    candidates = []
    for file_path in _model_dir().glob(f"rf_{crop_slug}_v*.pkl"):
        match = MODEL_FILE_PATTERN.match(file_path.name)
        if match:
            candidates.append((int(match.group("version")), file_path))
    if not candidates:
        return None
    return sorted(candidates, key=lambda item: item[0])[-1][1]


class YieldPredictionModel:
    """Random Forest yield model with feature importance output."""

    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=200, random_state=42)
        self.is_trained = False
        self.feature_importance = {}
        self.training_size = 0
        self.feature_columns = []
        self.model_version = "rf-v1"

    def prepare_training_data(self, crop_id=None):
        queryset = YieldRecord.objects.select_related("planting__field__farm", "planting__crop")
        if crop_id:
            queryset = queryset.filter(planting__crop_id=crop_id)

        rows = []
        for yield_record in queryset:
            planting = yield_record.planting
            field = planting.field

            weather = WeatherData.objects.filter(
                farm=field.farm,
                date__gte=planting.planting_date,
                date__lte=yield_record.harvest_date,
            )
            if not weather.exists():
                continue

            weather_avg = weather.aggregate(
                avg_temp_min=Avg("temperature_min"),
                avg_temp_max=Avg("temperature_max"),
                total_rainfall=Sum("rainfall_mm"),
                avg_humidity=Avg("humidity_percent"),
            )

            rows.append(
                {
                    "area_hectares": field.area_hectares,
                    "soil_ph": field.soil_ph or 6.5,
                    "moisture_level": field.moisture_level or 50,
                    "temp_avg": (
                        ((weather_avg.get("avg_temp_min") or 20) + (weather_avg.get("avg_temp_max") or 30)) / 2
                    ),
                    "total_rainfall": weather_avg.get("total_rainfall") or 500,
                    "fertilizer_quantity": (
                        InputUsage.objects.filter(
                            planting=planting,
                            resource_type=InputUsage.RESOURCE_FERTILIZER,
                        ).aggregate(total=Sum("quantity"))["total"]
                        or 0
                    ),
                    "growing_days": (yield_record.harvest_date - planting.planting_date).days,
                    "crop_type": planting.crop.name,
                    "yield_per_hectare": yield_record.yield_per_hectare,
                }
            )

        if not rows:
            return None
        return pd.DataFrame(rows)

    def train(self, crop_id=None):
        df = self.prepare_training_data(crop_id)
        if df is None or df.empty:
            logger.warning("Insufficient data for training")
            return False

        self.training_size = len(df)
        if self.training_size < MIN_TRAINING_RECORDS_PER_CROP:
            logger.info(
                "Skipping crop %s model training due to low records (%s < %s)",
                crop_id,
                self.training_size,
                MIN_TRAINING_RECORDS_PER_CROP,
            )
            return False

        x = pd.get_dummies(df[FEATURE_COLUMNS + ["crop_type"]], columns=["crop_type"], dtype=float)
        y = df["yield_per_hectare"]

        try:
            self.model.fit(x, y)
            self.is_trained = True
            self.feature_columns = list(x.columns)
            self.feature_importance = {
                feature: round(float(importance), 4)
                for feature, importance in zip(self.feature_columns, self.model.feature_importances_)
            }
            return True
        except Exception as exc:
            logger.error("Error training model: %s", exc)
            return False

    def predict(self, planting):
        if not self.is_trained:
            return None

        field = planting.field
        weather = WeatherData.objects.filter(
            farm=field.farm,
            date__gte=planting.planting_date,
        )

        if not weather.exists():
            logger.warning("No weather data found for planting %s", planting.id)
            return None

        weather_avg = weather.aggregate(
            avg_temp_min=Avg("temperature_min"),
            avg_temp_max=Avg("temperature_max"),
            total_rainfall=Sum("rainfall_mm"),
            avg_humidity=Avg("humidity_percent"),
        )

        days_elapsed = max((datetime.now().date() - planting.planting_date).days, 1)
        features = np.array(
            [
                [
                    field.area_hectares,
                    field.soil_ph or 6.5,
                    field.moisture_level or 50,
                    (
                        ((weather_avg.get("avg_temp_min") or 20) + (weather_avg.get("avg_temp_max") or 30))
                        / 2
                    ),
                    weather_avg.get("total_rainfall") or 500,
                    (
                        InputUsage.objects.filter(
                            planting=planting,
                            resource_type=InputUsage.RESOURCE_FERTILIZER,
                        ).aggregate(total=Sum("quantity"))["total"]
                        or 0
                    ),
                    days_elapsed,
                ]
            ]
        )

        feature_row = {
            "area_hectares": features[0][0],
            "soil_ph": features[0][1],
            "moisture_level": features[0][2],
            "temp_avg": features[0][3],
            "total_rainfall": features[0][4],
            "fertilizer_quantity": features[0][5],
            "growing_days": features[0][6],
            "crop_type": planting.crop.name,
        }

        x_row = pd.get_dummies(pd.DataFrame([feature_row]), columns=["crop_type"], dtype=float)
        for column in self.feature_columns:
            if column not in x_row.columns:
                x_row[column] = 0
        x_row = x_row[self.feature_columns]

        try:
            predicted_per_hectare = float(self.model.predict(x_row)[0])
            predicted_per_hectare = max(predicted_per_hectare, 0)
            predicted_yield_kg = predicted_per_hectare * field.area_hectares

            # A simple confidence proxy that improves with training sample size.
            confidence = min(0.98, max(0.45, 0.45 + (self.training_size / 100)))

            return {
                "predicted_yield_kg": round(predicted_yield_kg, 2),
                "predicted_yield_per_hectare": round(predicted_per_hectare, 2),
                "confidence": round(confidence, 2),
                "feature_importance": self.feature_importance,
                "estimated_harvest_date": planting.expected_harvest_date,
            }
        except Exception as exc:
            logger.error("Error making prediction: %s", exc)
            return None

    def save(self, model_file: Path):
        payload = {
            "model": self.model,
            "feature_columns": self.feature_columns,
            "feature_importance": self.feature_importance,
            "training_size": self.training_size,
            "saved_at": datetime.utcnow().isoformat(),
            "model_version": model_file.stem,
        }
        joblib.dump(payload, model_file)
        self.model_version = model_file.stem

    def load(self, model_file: Path) -> bool:
        try:
            payload = joblib.load(model_file)
            self.model = payload["model"]
            self.feature_columns = payload.get("feature_columns", [])
            self.feature_importance = payload.get("feature_importance", {})
            self.training_size = payload.get("training_size", 0)
            self.model_version = payload.get("model_version", model_file.stem)
            self.is_trained = True
            return True
        except Exception as exc:
            logger.error("Failed to load model %s: %s", model_file, exc)
            return False


def _load_or_train_crop_model(crop_id: int, crop_name: str) -> YieldPredictionModel | None:
    model = YieldPredictionModel()
    latest_file = _latest_model_file(crop_name)

    record_count = YieldRecord.objects.filter(planting__crop_id=crop_id).count()
    if record_count < MIN_TRAINING_RECORDS_PER_CROP and latest_file is None:
        return None

    should_retrain = record_count >= MIN_TRAINING_RECORDS_PER_CROP and (
        latest_file is None or record_count % MIN_TRAINING_RECORDS_PER_CROP == 0
    )

    if should_retrain:
        if not model.train(crop_id=crop_id):
            return None
        model_file = _next_model_file(crop_name)
        model.save(model_file)
        return model

    if latest_file and model.load(latest_file):
        return model

    return None


def generate_yield_predictions_for_farm(farm_id):
    """Generate predictions for active plantings on a farm using per-crop models."""

    try:
        active_plantings = CropPlanting.objects.filter(field__farm_id=farm_id, status__in=["growing"])
        if not active_plantings.exists():
            return True

        crop_models = {}

        for planting in active_plantings.select_related("field", "crop"):
            if planting.crop_id not in crop_models:
                crop_models[planting.crop_id] = _load_or_train_crop_model(
                    planting.crop_id,
                    planting.crop.name,
                )

            model = crop_models[planting.crop_id]
            if not model:
                continue

            prediction_data = model.predict(planting)
            if not prediction_data:
                continue

            YieldPrediction.objects.create(
                planting=planting,
                predicted_yield_kg=prediction_data["predicted_yield_kg"],
                predicted_yield_per_hectare=prediction_data["predicted_yield_per_hectare"],
                estimated_harvest_date=prediction_data["estimated_harvest_date"],
                confidence_score=prediction_data["confidence"],
                feature_importance=prediction_data["feature_importance"],
                model_version=model.model_version,
            )

        return True
    except Exception as exc:
        logger.error("Error generating predictions for farm %s: %s", farm_id, exc)
        return False
