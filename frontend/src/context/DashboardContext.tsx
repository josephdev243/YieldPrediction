import React, { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { DashboardMetrics, Recommendation } from "../lib/types";
import { useDashboard } from "../hooks/useDashboard";

interface DashboardContextType {
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

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined,
);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const dashboard = useDashboard();

  return (
    <DashboardContext.Provider value={dashboard}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = (): DashboardContextType => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within DashboardProvider",
    );
  }
  return context;
};
