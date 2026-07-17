import { useState, useCallback, useEffect } from "react";
import type { User } from "../lib/types";
import {
  loginUser,
  registerUser,
  logoutUser,
  getAuthToken,
  saveAuthToken,
  refreshToken,
  clearAuthStorage,
  saveCurrentUser,
  getCurrentUserFromStorage,
} from "../services/authService";

interface UseAuthReturn {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role: string,
    phone?: string,
  ) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

/**
 * Custom hook for authentication
 */
export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize from storage on mount
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = getCurrentUserFromStorage();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
      setIsLoading(false);
      return;
    }

    const bootstrapSession = async () => {
      const refreshed = await refreshToken();
      if (refreshed.success && refreshed.data?.token) {
        setToken(refreshed.data.token);
        if (refreshed.data.user) {
          setUser(refreshed.data.user);
        }
      }
      setIsLoading(false);
    };

    void bootstrapSession();
  }, []);

  useEffect(() => {
    const onSessionExpired = () => {
      clearAuthStorage();
      setToken(null);
      setUser(null);
    };

    window.addEventListener("auth:session-expired", onSessionExpired);
    return () => {
      window.removeEventListener("auth:session-expired", onSessionExpired);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await loginUser(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.error || "Login failed");
      }

      const { token: newToken, user: newUser } = response.data;

      saveAuthToken(newToken);
      saveCurrentUser(newUser);
      setToken(newToken);
      setUser(newUser);
    } catch (err: any) {
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const registerWithPhone = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: string,
      phone?: string,
    ) => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await registerUser(email, password, name, role, phone);

        if (!response.success || !response.data) {
          throw new Error(response.error || "Registration failed");
        }

        const { token: newToken, user: newUser } = response.data;

        saveAuthToken(newToken);
        saveCurrentUser(newUser);
        setToken(newToken);
        setUser(newUser);
      } catch (err: any) {
        const errorMessage = err.message || "Registration failed";
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(() => {
    void logoutUser();
    clearAuthStorage();
    setUser(null);
    setToken(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    error,
    login,
    register: registerWithPhone,
    logout,
    clearError,
  };
};
