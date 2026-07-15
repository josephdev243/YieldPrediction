// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "farmer" | "extension_officer" | "admin";
  phoneNumber?: string;
  whatsappNumber?: string;
  prefersEmailNotifications?: boolean;
  prefersSmsNotifications?: boolean;
  prefersWhatsappNotifications?: boolean;
  createdAt: Date;
}

// Farmer Profile Types
export interface Farmer {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  region: string;
  totalLand: number; // in hectares
  createdAt: Date;
  updatedAt: Date;
}

// Farm/Field Types
export interface Field {
  id: string;
  farmerId: string;
  name: string;
  size: number; // in hectares
  cropType: string;
  soilType: string;
  irrigationType: "rain-fed" | "irrigated" | "mixed";
  moisture_level?: number;
  soil_ph?: number;
  nutrient_content?: number;
  location: {
    latitude: number;
    longitude: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Crop Types
export interface Crop {
  id: string;
  fieldId: string;
  name: string;
  plantingDate: Date;
  expectedHarvestDate: Date;
  variety: string;
  quantity: number;
  unit: "kg" | "tons" | "bags";
  status: "planted" | "growing" | "harvested";
  createdAt: Date;
  updatedAt: Date;
}

// Yield Tracking Types
export interface YieldRecord {
  id: string;
  cropId: string;
  harvestDate: Date;
  quantityHarvested: number;
  unit: string;
  qualityGrade: "A" | "B" | "C" | "D";
  notes: string;
  createdAt: Date;
}

export type InputResourceType =
  | "fertilizer"
  | "pesticide"
  | "water"
  | "seed"
  | "herbicide"
  | "irrigation"
  | "labour";

export type InputUsageUnit = "kg" | "liters" | "bags" | "m3";

export interface InputUsage {
  id: string;
  fieldId: string;
  fieldName?: string;
  plantingId?: string;
  plantingCrop?: string;
  season: string;
  seasonYear: number;
  resourceType: InputResourceType;
  inputName?: string;
  activeIngredient?: string;
  quantity: number;
  unit: InputUsageUnit;
  irrigationMethod?: string;
  durationMinutes?: number;
  costPerUnit?: number;
  cost?: number;
  totalCost?: number;
  applicationDate: Date;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface InputUsageSummaryRow {
  resource_type: InputResourceType;
  total_quantity: number;
  total_cost: number;
  entries: number;
}

export interface InputUsageSummary {
  filters: {
    field_id?: string;
    season?: string;
    season_year?: string;
  };
  summary: InputUsageSummaryRow[];
  totals: {
    entries: number;
    quantity: number;
    cost: number;
    actual_yield_kg?: number;
    predicted_yield_kg?: number;
    cost_per_actual_yield_kg?: number | null;
    cost_per_predicted_yield_kg?: number | null;
  };
}

export type PestAlertType = "fungal" | "disease" | "pest";

export type PestAlertRiskLevel = "low" | "medium" | "high" | "critical";

export interface PestDiseaseAlert {
  id: string;
  farmId: string;
  fieldId: string;
  fieldName?: string;
  cropId: string;
  cropName?: string;
  alertType: PestAlertType;
  riskLevel: PestAlertRiskLevel;
  title: string;
  description: string;
  season?: string;
  triggeredWeatherDate?: Date | null;
  rainfallMm: number;
  humidityPercent: number;
  temperatureC: number;
  riskScore: number;
  isAcknowledged: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// Weather Types
export interface WeatherData {
  id: string;
  fieldId: string;
  date: Date;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  windDirection: string;
  uvIndex: number;
  condition: string;
}

// Dashboard Metrics Types
export interface DashboardMetrics {
  totalYield: number;
  activeCrops: number;
  totalFields: number;
  averageYield: number;
  rainfall: number;
  predictedYield: number;
  healthScore: number;
}

// Weather Forecast Types
export interface WeatherForecast {
  date: Date;
  tempMax: number;
  tempMin: number;
  humidity: number;
  rainfall: number;
  condition: string;
}

export type IrrigationAction = "water" | "monitor" | "hold";

export interface IrrigationScheduleItem {
  date: Date;
  dayLabel: string;
  dateLabel: string;
  fieldId: string;
  fieldName: string;
  soilMoisturePercent: number;
  forecastRainfallMm: number;
  forecastTempMaxC: number;
  forecastHumidityPercent: number;
  recommendedWaterMm: number;
  action: IrrigationAction;
  priority: "high" | "medium" | "low";
  timeWindow: string;
  reason: string;
}

export interface IrrigationScheduleSummary {
  totalWaterMm: number;
  wateringDays: number;
  monitoringDays: number;
  holdDays: number;
  nextActionLabel: string;
  focusFieldName: string;
  averageMoisturePercent: number;
}

export interface IrrigationSchedule {
  items: IrrigationScheduleItem[];
  summary: IrrigationScheduleSummary;
}

// Recommendation Types
export interface Recommendation {
  id: string;
  farmId?: string;
  cropId: string;
  type: "watering" | "fertilizer" | "pest-control" | "harvesting" | "planting";
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "critical";
  actionDate: Date;
  isRead?: boolean;
  isDismissed?: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Response
export interface AuthResponse {
  token: string;
  user: User;
}
