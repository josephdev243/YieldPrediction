import { get, post } from "../lib/api";
import type { ApiResponse, PestDiseaseAlert, PestAlertRiskLevel, PestAlertType } from "../lib/types";

interface RawPestDiseaseAlert {
  id: string;
  farm: string;
  field: string;
  field_name?: string;
  crop: string;
  crop_name?: string;
  alert_type: PestAlertType;
  risk_level: PestAlertRiskLevel;
  title: string;
  description: string;
  season?: string;
  triggered_weather_date?: string | null;
  rainfall_mm: number;
  humidity_percent: number;
  temperature_c: number;
  risk_score: number;
  is_acknowledged: boolean;
  created_at: string;
  updated_at?: string;
}

const toAlert = (item: RawPestDiseaseAlert): PestDiseaseAlert => ({
  id: item.id,
  farmId: item.farm,
  fieldId: item.field,
  fieldName: item.field_name,
  cropId: item.crop,
  cropName: item.crop_name,
  alertType: item.alert_type,
  riskLevel: item.risk_level,
  title: item.title,
  description: item.description,
  season: item.season,
  triggeredWeatherDate: item.triggered_weather_date
    ? new Date(item.triggered_weather_date)
    : null,
  rainfallMm: item.rainfall_mm,
  humidityPercent: item.humidity_percent,
  temperatureC: item.temperature_c,
  riskScore: item.risk_score,
  isAcknowledged: item.is_acknowledged,
  createdAt: new Date(item.created_at),
  updatedAt: item.updated_at ? new Date(item.updated_at) : undefined,
});

export const getPestDiseaseAlerts = async (params?: {
  farmId?: string;
  fieldId?: string;
  riskLevel?: PestAlertRiskLevel;
  alertType?: PestAlertType;
}): Promise<ApiResponse<PestDiseaseAlert[]>> => {
  const query = new URLSearchParams();

  if (params?.farmId) query.set("farm", params.farmId);
  if (params?.fieldId) query.set("field", params.fieldId);
  if (params?.riskLevel) query.set("risk_level", params.riskLevel);
  if (params?.alertType) query.set("alert_type", params.alertType);

  const suffix = query.toString() ? `?${query.toString()}` : "";
  const response = await get<RawPestDiseaseAlert[]>(`/pest-alerts/feed/${suffix}`);

  if (!response.success || !response.data) {
    return { success: false, error: response.error, message: response.message };
  }

  return {
    success: true,
    message: response.message,
    data: response.data.map(toAlert),
  };
};

export const generatePestDiseaseAlerts = async (
  farmId: string,
): Promise<ApiResponse<PestDiseaseAlert[]>> => {
  const response = await post<{ generated: number; alerts: RawPestDiseaseAlert[] }>(
    "/pest-alerts/generate/",
    { farm_id: farmId },
  );

  if (!response.success || !response.data) {
    return { success: false, error: response.error, message: response.message };
  }

  return {
    success: true,
    message: response.message,
    data: response.data.alerts.map(toAlert),
  };
};

export const acknowledgePestDiseaseAlert = async (
  alertId: string,
): Promise<ApiResponse<void>> => {
  return post<void>(`/pest-alerts/${alertId}/acknowledge/`, {});
};
