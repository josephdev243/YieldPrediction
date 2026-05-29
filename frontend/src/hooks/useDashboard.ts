import { useState, useCallback, useEffect } from "react";
import type { DashboardMetrics, Recommendation } from "../lib/types";
import {
  getDashboardMetrics,
  getRecommendations,
  markRecommendationDone,
  dismissRecommendation,
  calculateHealthScore,
  getHealthScoreStatus,
  getMockDashboardMetrics,
} from "../services/dashboardService";

interface UseDashboardReturn {
  metrics: DashboardMetrics | null;
  recommendations: Recommendation[];
  isLoading: boolean;
  error: string | null;
  healthScore: number;
  healthStatus: string;
  fetchMetrics: (farmerId: string) => Promise<void>;
  fetchRecommendations: (farmerId: string) => Promise<void>;
  completedRecommendation: (recommendationId: string) => Promise<void>;
  dismissedRecommendation: (recommendationId: string) => Promise<void>;
  loadMockData: () => void;
  clearError: () => void;
}

/**
 * Custom hook for dashboard data management
 */
export const useDashboard = (): UseDashboardReturn => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthScore, setHealthScore] = useState(0);
  const [healthStatus, setHealthStatus] = useState("fair");

  // Recalculate health score when metrics change
  useEffect(() => {
    if (metrics) {
      const score = calculateHealthScore(metrics);
      setHealthScore(score);
      setHealthStatus(getHealthScoreStatus(score));
    }
  }, [metrics]);

  const fetchMetrics = useCallback(async (farmerId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getDashboardMetrics(farmerId);

      if (!response.success || !response.data) {
        // Fall back to mock data if API fails
        const mockData = getMockDashboardMetrics();
        setMetrics(mockData);
        return;
      }

      setMetrics(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching metrics");
      // Still load mock data as fallback
      const mockData = getMockDashboardMetrics();
      setMetrics(mockData);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecommendations = useCallback(async (farmerId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await getRecommendations(farmerId);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to fetch recommendations");
      }

      setRecommendations(response.data);
    } catch (err: any) {
      setError(err.message || "Error fetching recommendations");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completedRecommendation = useCallback(
    async (recommendationId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await markRecommendationDone(recommendationId);

        if (!response.success) {
          throw new Error(response.error || "Failed to mark as done");
        }

        setRecommendations((prev) =>
          prev.filter((r) => r.id !== recommendationId),
        );
      } catch (err: any) {
        setError(err.message || "Error completing recommendation");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const dismissedRecommendation = useCallback(
    async (recommendationId: string) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await dismissRecommendation(recommendationId);

        if (!response.success) {
          throw new Error(response.error || "Failed to dismiss");
        }

        setRecommendations((prev) =>
          prev.filter((r) => r.id !== recommendationId),
        );
      } catch (err: any) {
        setError(err.message || "Error dismissing recommendation");
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const loadMockData = useCallback(() => {
    const mockMetrics = getMockDashboardMetrics();
    setMetrics(mockMetrics);

    // Create more realistic mock recommendations
    const mockRecommendations: Recommendation[] = [
      {
        id: "1",
        cropId: "crop-1",
        type: "watering",
        title: "Water your maize field",
        description:
          "Soil moisture is low. Schedule irrigation for tomorrow morning.",
        priority: "high",
        actionDate: new Date(Date.now() + 86400000),
        createdAt: new Date(),
      },
      {
        id: "2",
        cropId: "crop-2",
        type: "fertilizer",
        title: "Apply fertilizer",
        description:
          "Nitrogen levels are decreasing. Apply NPK 20-10-10 fertilizer.",
        priority: "medium",
        actionDate: new Date(Date.now() + 172800000),
        createdAt: new Date(),
      },
      {
        id: "3",
        cropId: "crop-1",
        type: "pest-control",
        title: "Check for pests",
        description:
          "Recent warm weather may increase pest activity. Inspect crops.",
        priority: "low",
        actionDate: new Date(),
        createdAt: new Date(),
      },
    ];

    setRecommendations(mockRecommendations);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    metrics,
    recommendations,
    isLoading,
    error,
    healthScore,
    healthStatus,
    fetchMetrics,
    fetchRecommendations,
    completedRecommendation,
    dismissedRecommendation,
    loadMockData,
    clearError,
  };
};
