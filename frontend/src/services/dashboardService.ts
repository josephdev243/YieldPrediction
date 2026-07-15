import { get, post } from "../lib/api";
import type {
  DashboardMetrics,
  Recommendation,
  ApiResponse,
} from "../lib/types";

interface RawFarmDashboard {
  farm_id: string;
  farm_name: string;
  total_area: number;
  active_crops: number;
  total_fields: number;
  recent_yield: number | null;
  pending_recommendations: number;
  current_weather?: {
    rainfall_mm: number;
  } | null;
}

interface RawRecommendation {
  id: string;
  farm: string;
  category: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low" | "critical";
  action_required_by?: string | null;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
}

const mapDashboardMetrics = (payload: RawFarmDashboard): DashboardMetrics => ({
  totalYield: payload.recent_yield ?? 0,
  activeCrops: payload.active_crops,
  totalFields: payload.total_fields,
  averageYield: payload.recent_yield ?? 0,
  rainfall: payload.current_weather?.rainfall_mm ?? 0,
  predictedYield: Math.max((payload.recent_yield ?? 0) * 1.12, 0),
  healthScore: Math.min(100, 55 + payload.active_crops * 4 + payload.total_fields * 2),
});

/**
 * Get dashboard metrics for farmer
 */
export const getDashboardMetrics = async (
  farmerId: string,
): Promise<ApiResponse<DashboardMetrics>> => {
  const response = await get<RawFarmDashboard>(`/farms/${farmerId}/dashboard/`);

  if (!response.success || !response.data) {
    return {
      success: false,
      error: response.error,
      message: response.message,
    };
  }

  return {
    success: true,
    message: response.message,
    data: mapDashboardMetrics(response.data),
  };
};

/**
 * Get recommendations for farmer
 */
export const getRecommendations = async (
  farmerId: string,
  limit: number = 10,
): Promise<ApiResponse<Recommendation[]>> => {
  const response = await get<RawRecommendation[]>(
    `/recommendations/?farm=${farmerId}&ordering=-created_at&page_size=${limit}`,
  );

  if (!response.success || !response.data) {
    return { success: false, error: response.error, message: response.message };
  }

  return {
    success: true,
    message: response.message,
    data: response.data.map((item) => ({
      id: item.id,
      farmId: item.farm,
      cropId: item.category,
      type: item.category === "irrigation" ? "watering" : item.category === "pest_control" ? "pest-control" : item.category as Recommendation["type"],
      title: item.title,
      description: item.description,
      priority: item.priority === "critical" ? "high" : item.priority,
      actionDate: item.action_required_by ? new Date(item.action_required_by) : new Date(item.created_at),
      isRead: item.is_read,
      isDismissed: item.is_dismissed,
      createdAt: new Date(item.created_at),
    })),
  };
};

/**
 * Get recommendations for specific crop
 */
export const getCropRecommendations = async (
  cropId: string,
): Promise<ApiResponse<Recommendation[]>> => {
  return getRecommendations(cropId);
};

/**
 * Mark recommendation as done
 */
export const markRecommendationDone = async (
  recommendationId: string,
): Promise<ApiResponse<Recommendation>> => {
  return post<Recommendation>(`/recommendations/${recommendationId}/mark_read/`, {});
};

/**
 * Dismiss recommendation
 */
export const dismissRecommendation = async (
  recommendationId: string,
): Promise<ApiResponse<void>> => {
  return post<void>(`/recommendations/${recommendationId}/dismiss`, {});
};

/**
 * Get dashboard summary
 */
export const getDashboardSummary = async (
  farmerId: string,
): Promise<ApiResponse<any>> => {
  return get<any>(`/dashboard/summary/${farmerId}`);
};

/**
 * Get farm health score
 */
export const getFarmHealthScore = async (
  farmerId: string,
): Promise<ApiResponse<{ score: number; status: string }>> => {
  return get<{ score: number; status: string }>(
    `/dashboard/health-score/${farmerId}`,
  );
};

/**
 * Calculate health score based on metrics
 */
export const calculateHealthScore = (metrics: DashboardMetrics): number => {
  let score = 0;

  // Yield contribution (40%)
  const yieldScore = Math.min(metrics.averageYield / 5, 1) * 40;

  // Active crops contribution (25%)
  const cropsScore = Math.min(metrics.activeCrops / 10, 1) * 25;

  // Fields contribution (20%)
  const fieldsScore = Math.min(metrics.totalFields / 5, 1) * 20;

  // Rainfall contribution (15%)
  const rainfallScore = Math.min(metrics.rainfall / 100, 1) * 15;

  score = yieldScore + cropsScore + fieldsScore + rainfallScore;

  return Math.min(score, 100);
};

/**
 * Get health score status
 */
export const getHealthScoreStatus = (
  score: number,
): "excellent" | "good" | "fair" | "poor" => {
  if (score >= 80) return "excellent";
  if (score >= 60) return "good";
  if (score >= 40) return "fair";
  return "poor";
};

/**
 * Get mock dashboard metrics (for testing)
 */
export const getMockDashboardMetrics = (): DashboardMetrics => {
  return {
    totalYield: 2.45,
    activeCrops: 6,
    totalFields: 4,
    averageYield: 2.45,
    rainfall: 85,
    predictedYield: 2.8,
    healthScore: 78,
  };
};

/**
 * Generate performance insights
 */
export const generatePerformanceInsights = (
  metrics: DashboardMetrics,
): string[] => {
  const insights: string[] = [];

  if (metrics.predictedYield > metrics.totalYield) {
    insights.push(
      `Your predicted yield (${metrics.predictedYield.toFixed(2)} tons) is higher than current yield.`,
    );
  }

  if (metrics.activeCrops > 5) {
    insights.push(
      "You have multiple active crops. Ensure proper resource allocation.",
    );
  }

  if (metrics.rainfall < 50) {
    insights.push("Low rainfall this season. Consider irrigation support.");
  }

  if (metrics.healthScore > 80) {
    insights.push(
      "Your farm is performing excellently! Keep up the good practices.",
    );
  }

  return insights;
};
