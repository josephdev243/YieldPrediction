import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from "./constants";
import type { ApiResponse } from "./types";

/**
 * Custom fetch wrapper with timeout and error handling
 */
export const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request timeout after ${timeout}ms`);
    }
    throw error;
  }
};

/**
 * API request handler
 */
export const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  } as Record<string, string>;

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "An error occurred",
        message: data.message,
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
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetchWithTimeout(url, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "Upload failed",
      };
    }

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
