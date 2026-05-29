import type {
  Field,
  IrrigationAction,
  IrrigationSchedule,
  IrrigationScheduleItem,
  WeatherForecast,
} from "../lib/types";

const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

const roundOneDecimal = (value: number): number => {
  return Math.round(value * 10) / 10;
};

const getFieldMoisture = (field: Field, fallback: number): number => {
  const moisture = field.moisture_level;
  if (typeof moisture === "number" && !Number.isNaN(moisture)) {
    return moisture;
  }

  return fallback;
};

export const createMockIrrigationForecast = (days = 7): WeatherForecast[] => {
  const startDate = new Date();

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const rainfallPattern = [1.5, 0, 0.8, 5.2, 11.8, 0, 0.4];
    const tempPattern = [31, 32, 30, 29, 27, 28, 31];
    const humidityPattern = [46, 43, 47, 58, 78, 54, 49];
    const conditionPattern = ["Sunny", "Sunny", "Partly cloudy", "Cloudy", "Rain", "Clear", "Sunny"];

    return {
      date,
      tempMax: tempPattern[index % tempPattern.length],
      tempMin: tempPattern[index % tempPattern.length] - 9,
      humidity: humidityPattern[index % humidityPattern.length],
      rainfall: rainfallPattern[index % rainfallPattern.length],
      condition: conditionPattern[index % conditionPattern.length],
    };
  });
};

export const buildIrrigationSchedule = (
  fields: Field[],
  forecast: WeatherForecast[],
  fallbackMoisture = 58,
): IrrigationSchedule => {
  const activeFields =
    fields.length > 0
      ? fields
      : [
          {
            id: "fallback-field",
            farmerId: "fallback",
            name: "North Field",
            size: 12,
            cropType: "Maize",
            soilType: "Loamy",
            irrigationType: "irrigated" as const,
            moisture_level: fallbackMoisture,
            location: { latitude: 0, longitude: 0 },
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];

  const items: IrrigationScheduleItem[] = forecast.map((day) => {
    const targetField = activeFields.reduce((driestField, currentField) => {
      return getFieldMoisture(currentField, fallbackMoisture) < getFieldMoisture(driestField, fallbackMoisture)
        ? currentField
        : driestField;
    }, activeFields[0]);

    const soilMoisturePercent = getFieldMoisture(targetField, fallbackMoisture);
    const moistureDeficit = clamp(72 - soilMoisturePercent, 0, 40);
    const heatPressure = clamp(day.tempMax - 28, 0, 10) * 1.4;
    const humidityPressure = clamp(60 - day.humidity, 0, 25) * 0.2;
    const rainRelief = day.rainfall >= 12 ? 18 : day.rainfall >= 6 ? 10 : day.rainfall >= 3 ? 5 : 0;

    let recommendedWaterMm = roundOneDecimal(
      clamp((moistureDeficit * 0.55) + heatPressure + humidityPressure - rainRelief, 0, 28),
    );
    let action: IrrigationAction = "water";

    if (day.rainfall >= 10 && soilMoisturePercent >= 60) {
      recommendedWaterMm = 0;
      action = "hold";
    } else if (recommendedWaterMm <= 0.5) {
      recommendedWaterMm = 0;
      action = "monitor";
    }

    const priority: "high" | "medium" | "low" =
      action === "hold"
        ? "low"
        : soilMoisturePercent < 45 || recommendedWaterMm >= 10
          ? "high"
          : soilMoisturePercent < 60 || day.tempMax >= 30
            ? "medium"
            : "low";

    const timeWindow =
      action === "water"
        ? day.rainfall >= 3
          ? "05:30-07:00"
          : "06:00-08:00"
        : action === "hold"
          ? "Recheck after rain"
          : "No watering needed today";

    const reason =
      action === "hold"
        ? `Rain should replenish the profile, so delay irrigation and review the field after the shower.`
        : action === "monitor"
          ? `Moisture is holding steady, so watch ${targetField.name} and water only if conditions dry out.`
          : `Water ${targetField.name} lightly in the early morning because soil moisture is ${soilMoisturePercent}% and the forecast is dry.`;

    const dayLabel = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(day.date);
    const dateLabel = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(day.date);

    return {
      date: day.date,
      dayLabel,
      dateLabel,
      fieldId: targetField.id,
      fieldName: targetField.name,
      soilMoisturePercent,
      forecastRainfallMm: day.rainfall,
      forecastTempMaxC: day.tempMax,
      forecastHumidityPercent: day.humidity,
      recommendedWaterMm,
      action,
      priority,
      timeWindow,
      reason,
    };
  });

  const wateringDays = items.filter((item) => item.action === "water").length;
  const monitoringDays = items.filter((item) => item.action === "monitor").length;
  const holdDays = items.filter((item) => item.action === "hold").length;
  const totalWaterMm = roundOneDecimal(items.reduce((total, item) => total + item.recommendedWaterMm, 0));
  const nextAction = items.find((item) => item.action === "water") || items[0];
  const averageMoisturePercent = roundOneDecimal(
    items.reduce((total, item) => total + item.soilMoisturePercent, 0) / items.length,
  );

  return {
    items,
    summary: {
      totalWaterMm,
      wateringDays,
      monitoringDays,
      holdDays,
      nextActionLabel: nextAction
        ? `${nextAction.dayLabel}, ${nextAction.dateLabel}`
        : "No action planned",
      focusFieldName: nextAction?.fieldName || activeFields[0].name,
      averageMoisturePercent,
    },
  };
};