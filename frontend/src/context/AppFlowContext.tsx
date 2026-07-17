import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useAuthContext } from "./AuthContext";
import type { AppFarm, AppFlowState, NotificationPreferences } from "../lib/appFlow";
import { defaultAppFlowState, loadAppFlowState, saveAppFlowState } from "../lib/appFlow";

interface AppFlowContextType extends AppFlowState {
  activeFarm: AppFarm | null;
  addFarm: (farm: Omit<AppFarm, "id">) => AppFarm;
  completeOnboarding: (payload: {
    farm: Omit<AppFarm, "id">;
    preferences: NotificationPreferences;
  }) => AppFarm;
  setActiveFarmId: (farmId: string) => void;
  decrementRecommendationBadge: () => void;
  decrementPestBadge: () => void;
  markHarvestSubmitted: () => void;
  markPlantingCreated: () => void;
  markInputLogged: () => void;
  setWeatherUnavailable: (value: boolean) => void;
}

const AppFlowContext = createContext<AppFlowContextType | undefined>(undefined);

const farmId = (): string => {
  return `farm_${Math.random().toString(36).slice(2, 10)}`;
};

export const AppFlowProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuthContext();
  const [state, setState] = useState<AppFlowState>(defaultAppFlowState);

  useEffect(() => {
    if (!user?.id) {
      setState(defaultAppFlowState);
      return;
    }

    setState(loadAppFlowState(user.id));
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    saveAppFlowState(user.id, state);
  }, [state, user?.id]);

  const addFarm = (farm: Omit<AppFarm, "id">): AppFarm => {
    const newFarm: AppFarm = {
      id: farmId(),
      ...farm,
    };

    setState((prev) => ({
      ...prev,
      farms: [...prev.farms, newFarm],
      activeFarmId: prev.activeFarmId || newFarm.id,
    }));

    return newFarm;
  };

  const completeOnboarding = (payload: {
    farm: Omit<AppFarm, "id">;
    preferences: NotificationPreferences;
  }): AppFarm => {
    const newFarm: AppFarm = {
      id: farmId(),
      ...payload.farm,
    };

    setState((prev) => ({
      ...prev,
      onboardingCompleted: true,
      farms: prev.farms.length > 0 ? prev.farms : [newFarm],
      activeFarmId: prev.activeFarmId || newFarm.id,
      notificationPreferences: payload.preferences,
    }));

    return newFarm;
  };

  const value = useMemo<AppFlowContextType>(() => {
    return {
      ...state,
      activeFarm: state.farms.find((farm) => farm.id === state.activeFarmId) || null,
      addFarm,
      completeOnboarding,
      setActiveFarmId: (farmIdValue: string) => {
        setState((prev) => ({ ...prev, activeFarmId: farmIdValue }));
      },
      decrementRecommendationBadge: () => {
        setState((prev) => ({
          ...prev,
          unreadRecommendations: Math.max(0, prev.unreadRecommendations - 1),
        }));
      },
      decrementPestBadge: () => {
        setState((prev) => ({
          ...prev,
          unreadPestAlerts: Math.max(0, prev.unreadPestAlerts - 1),
        }));
      },
      markHarvestSubmitted: () => {
        setState((prev) => ({
          ...prev,
          activePlantings: Math.max(0, prev.activePlantings - 1),
          yieldRecords: prev.yieldRecords + 1,
        }));
      },
      markPlantingCreated: () => {
        setState((prev) => ({
          ...prev,
          activePlantings: prev.activePlantings + 1,
        }));
      },
      markInputLogged: () => {
        setState((prev) => ({
          ...prev,
          inputLogs: prev.inputLogs + 1,
        }));
      },
      setWeatherUnavailable: (valueFlag: boolean) => {
        setState((prev) => ({ ...prev, weatherUnavailable: valueFlag }));
      },
    };
  }, [state]);

  return <AppFlowContext.Provider value={value}>{children}</AppFlowContext.Provider>;
};

export const useAppFlowContext = (): AppFlowContextType => {
  const context = useContext(AppFlowContext);
  if (!context) {
    throw new Error("useAppFlowContext must be used within AppFlowProvider");
  }

  return context;
};
