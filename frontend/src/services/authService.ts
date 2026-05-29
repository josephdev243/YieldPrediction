import { post, get, fetchWithTimeout } from "../lib/api";
import type { User, AuthResponse, ApiResponse } from "../lib/types";
import { API_BASE_URL, STORAGE_KEYS } from "../lib/constants";
import { clearFarmerData } from "./farmerService";

const fetchCurrentUser = async (
  token: string,
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/users/profile/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.detail || "Failed to load user profile",
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to load user profile",
    };
  }
};

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  const tokenResponse = await post<{ access: string; refresh: string }>(
    "/auth/token/",
    {
      username: email,
      password,
    },
  );

  if (!tokenResponse.success || !tokenResponse.data?.access) {
    return {
      success: false,
      error: tokenResponse.error || "Login failed",
      message: tokenResponse.message,
    };
  }

  const profileResponse = await fetchCurrentUser(tokenResponse.data.access);

  if (!profileResponse.success || !profileResponse.data) {
    return {
      success: false,
      error: profileResponse.error || "Login failed",
      message: profileResponse.message,
    };
  }

  return {
    success: true,
    data: {
      token: tokenResponse.data.access,
      user: profileResponse.data,
    },
    message: "Login successful",
  };
};

/**
 * Register new user
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: string,
): Promise<ApiResponse<AuthResponse>> => {
  const registerResponse = await post<{ user: User; message: string }>(
    "/users/register/",
    {
      email,
      first_name: name,
      last_name: "",
      password,
      password_confirm: password,
      role,
    },
  );

  if (!registerResponse.success) {
    return {
      success: false,
      error: registerResponse.error || "Registration failed",
      message: registerResponse.message,
    };
  }

  return loginUser(email, password);
};

/**
 * Get current user
 */
/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  return {
    success: false,
    error: "Refresh token flow is not implemented",
  };
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<ApiResponse<void>> => {
  clearAuthStorage();
  return {
    success: true,
    message: "Logged out successfully",
  };
};

/**
 * Request password reset
 */
export const requestPasswordReset = async (
  email: string,
): Promise<ApiResponse<{ message: string }>> => {
  return post<{ message: string }>("/auth/forgot-password", { email });
};

/**
 * Reset password with token
 */
export const resetPassword = async (
  token: string,
  newPassword: string,
): Promise<ApiResponse<{ message: string }>> => {
  return post<{ message: string }>("/auth/reset-password", {
    token,
    newPassword,
  });
};

/**
 * Validate email
 */
export const validateEmail = async (
  email: string,
): Promise<ApiResponse<{ valid: boolean }>> => {
  return get<{ valid: boolean }>(`/auth/validate-email?email=${email}`);
};

/**
 * Local storage helpers
 */
export const saveAuthToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const saveCurrentUser = (user: User): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
};

export const getCurrentUserFromStorage = (): User | null => {
  const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return user ? JSON.parse(user) : null;
};

export const removeCurrentUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

export const clearAuthStorage = (): void => {
  removeAuthToken();
  removeCurrentUser();
  clearFarmerData();
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
