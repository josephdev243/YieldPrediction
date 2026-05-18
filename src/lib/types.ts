// User & Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: "farmer" | "operator" | "admin";
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

// Recommendation Types
export interface Recommendation {
  id: string;
  cropId: string;
  type: "watering" | "fertilizer" | "pest-control" | "harvesting" | "planting";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionDate: Date;
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
