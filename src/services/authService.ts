import { post, get } from "../lib/api";
import type { User, AuthResponse, ApiResponse } from "../lib/types";
import { STORAGE_KEYS } from "../lib/constants";

/**
 * Login user with email and password
 */
export const loginUser = async (
  email: string,
  password: string,
): Promise<ApiResponse<AuthResponse>> => {
  return post<AuthResponse>("/auth/login", {
    email,
    password,
  });
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
  return post<AuthResponse>("/auth/register", {
    email,
    password,
    name,
    role,
  });
};

/**
 * Get current user
 */
/**
 * Refresh authentication token
 */
export const refreshToken = async (): Promise<ApiResponse<AuthResponse>> => {
  return post<AuthResponse>("/auth/refresh", {});
};

/**
 * Logout user
 */
export const logoutUser = async (): Promise<ApiResponse<void>> => {
  return post<void>("/auth/logout", {});
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
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
