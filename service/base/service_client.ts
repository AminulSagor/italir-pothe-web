import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import { service_URL } from "@/config/env";
import { removeAuthUser } from "@/utils/auth_user_util";
import { getToken, removeToken } from "@/utils/cookies_util";

type ApiErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export type ServiceClientError = Error & {
  response?: {
    status: number;
    data: ApiErrorPayload;
  };
};

const getErrorMessage = (payload?: ApiErrorPayload) => {
  if (!payload) return "Request failed";

  if (Array.isArray(payload.message)) return payload.message.join(", ");

  return payload.message || payload.error || "Request failed";
};

const createServiceError = (
  status: number,
  data: ApiErrorPayload,
): ServiceClientError => {
  const error = new Error(getErrorMessage(data)) as ServiceClientError;

  error.response = {
    status,
    data,
  };

  return error;
};

const apiClient = axios.create({
  baseURL: service_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const status = error.response?.status || 500;
    const data = error.response?.data || {
      message: error.message || "Request failed",
      statusCode: status,
    };

    if (status === 401) {
      removeToken();
      removeAuthUser();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth")
      ) {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(createServiceError(status, data));
  },
);

export const serviceClient = {
  get: async <T>(path: string) => {
    const response = await apiClient.get<T>(path);
    return response.data;
  },
  post: async <T>(path: string, body?: unknown) => {
    const response = await apiClient.post<T>(path, body);
    return response.data;
  },
  patch: async <T>(path: string, body?: unknown) => {
    const response = await apiClient.patch<T>(path, body);
    return response.data;
  },
  put: async <T>(path: string, body?: unknown) => {
    const response = await apiClient.put<T>(path, body);
    return response.data;
  },
  delete: async <T>(path: string) => {
    const response = await apiClient.delete<T>(path);
    return response.data;
  },
};
