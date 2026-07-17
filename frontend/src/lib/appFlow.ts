export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface AppFarm {
  id: string;
  name: string;
  location: string;
  gps: string;
  area: number;
}

export interface AppFlowState {
  onboardingCompleted: boolean;
  farms: AppFarm[];
  activeFarmId: string | null;
  notificationPreferences: NotificationPreferences;
  unreadPestAlerts: number;
  unreadRecommendations: number;
  activePlantings: number;
  inputLogs: number;
  yieldRecords: number;
  weatherUnavailable: boolean;
}

export const defaultAppFlowState: AppFlowState = {
  onboardingCompleted: false,
  farms: [],
  activeFarmId: null,
  notificationPreferences: {
    email: true,
    sms: true,
    whatsapp: false,
  },
  unreadPestAlerts: 2,
  unreadRecommendations: 3,
  activePlantings: 0,
  inputLogs: 0,
  yieldRecords: 0,
  weatherUnavailable: false,
};

const appFlowStorageKey = (userId: string): string => `ypf_app_flow_${userId}`;

export const loadAppFlowState = (userId: string): AppFlowState => {
  const raw = localStorage.getItem(appFlowStorageKey(userId));
  if (!raw) {
    return defaultAppFlowState;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AppFlowState>;
    return {
      ...defaultAppFlowState,
      ...parsed,
      notificationPreferences: {
        ...defaultAppFlowState.notificationPreferences,
        ...(parsed.notificationPreferences || {}),
      },
      farms: Array.isArray(parsed.farms) ? parsed.farms : [],
    };
  } catch {
    return defaultAppFlowState;
  }
};

export const saveAppFlowState = (userId: string, state: AppFlowState): void => {
  localStorage.setItem(appFlowStorageKey(userId), JSON.stringify(state));
};

export const hasCompletedOnboarding = (userId: string): boolean => {
  return loadAppFlowState(userId).onboardingCompleted;
};

export const buildReturnTo = (pathname: string, search: string, hash: string): string => {
  return `${pathname}${search}${hash}`;
};
