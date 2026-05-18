import { get, post } from "../lib/api";
import type {
  DashboardMetrics,
  Recommendation,
  ApiResponse,
} from "../lib/types";

/**
 * Get dashboard metrics for farmer
 */
export const getDashboardMetrics = async (
  farmerId: string,
): Promise<ApiResponse<DashboardMetrics>> => {
  return get<DashboardMetrics>(`/dashboard/metrics/${farmerId}`);
};

/**
 * Get recommendations for farmer
 */
export const getRecommendations = async (
  farmerId: string,
  limit: number = 10,
): Promise<ApiResponse<Recommendation[]>> => {
  return get<Recommendation[]>(
    `/dashboard/recommendations/${farmerId}?limit=${limit}`,
  );
};

/**
 * Get recommendations for specific crop
 */
export const getCropRecommendations = async (
  cropId: string,
): Promise<ApiResponse<Recommendation[]>> => {
  return get<Recommendation[]>(`/crops/${cropId}/recommendations`);
};

/**
 * Mark recommendation as done
 */
export const markRecommendationDone = async (
  recommendationId: string,
): Promise<ApiResponse<Recommendation>> => {
  return post<Recommendation>(`/recommendations/${recommendationId}/done`, {});
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
