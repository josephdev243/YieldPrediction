import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./constants";
import type { ApiResponse } from "./types";

let inMemoryAccessToken: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

export const setAccessToken = (token: string | null): void => {
  inMemoryAccessToken = token;
};

export const getAccessToken = (): string | null => inMemoryAccessToken;

const refreshAccessToken = async (): Promise<string | null> => {
  if (!refreshPromise) {
    refreshPromise = axios
      .post(`${API_BASE_URL}/auth/token/refresh/`, {}, { withCredentials: true })
      .then((response) => {
        const token = response.data?.access || null;
        setAccessToken(token);
        return token;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

axiosClient.interceptors.request.use((config) => {
  if (inMemoryAccessToken) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshedToken = await refreshAccessToken();
      if (refreshedToken) {
        originalRequest.headers.Authorization = `Bearer ${refreshedToken}`;
        return axiosClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);

/**
 * Kept for backward compatibility with existing auth service calls.
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT,
): Promise<Response> => {
  return fetch(url, { ...options, signal: AbortSignal.timeout(timeout) });
};

/**
 * API request handler
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  try {
    const response = await axiosClient.request({
      url: endpoint,
      method: options.method as any,
      data: options.body ? JSON.parse(options.body as string) : undefined,
      headers: options.headers as any,
    });

    const data = response.data;
    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error: any) {
    const data = error?.response?.data;
    if (data) {
      return {
        success: false,
        error: data.error || data.detail || "An error occurred",
        message: data.message,
      };
    }

    return {
      success: false,
      error: error.message || "Network error",
    };
  }
};

/**
 * GET request
 */
export const get = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: "GET",
  });
};

/**
 * POST request
 */
export const post = async <T>(
  endpoint: string,
  body?: any,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: "POST",
    body: JSON.stringify(body),
  });
};

/**
 * PUT request
 */
export const put = async <T>(
  endpoint: string,
  body?: any,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    body: JSON.stringify(body),
  });
};

/**
 * PATCH request
 */
export const patch = async <T>(
  endpoint: string,
  body?: any,
): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
};

/**
 * DELETE request
 */
export const del = async <T>(endpoint: string): Promise<ApiResponse<T>> => {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
  });
};

/**
 * Upload file
 */
export const uploadFile = async <T>(
  endpoint: string,
  file: File,
): Promise<ApiResponse<T>> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axiosClient.post(endpoint, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data;

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Upload error",
    };
  }
};

/**
 * Handle API errors
 */
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data?.message || "Server error occurred";
  } else if (error.request) {
    // Request made but no response
    return "No response from server";
  } else {
    // Other errors
    return error.message || "An error occurred";
  }
};
