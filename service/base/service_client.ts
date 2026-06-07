import { service_URL } from "@/config/env";
import { removeAuthUser } from "@/utils/auth_user_util";
import { getToken, removeToken } from "@/utils/cookies_util";

type RequestOptions = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
};

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

const buildUrl = (path: string) => {
  const baseUrl = service_URL.replace(/\/$/, "");
  const endpoint = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${endpoint}`;
};

const createServiceError = (status: number, data: ApiErrorPayload) => {
  const message = Array.isArray(data.message)
    ? data.message.join(", ")
    : data.message || data.error || "Request failed";

  const error = new Error(message) as ServiceClientError;
  error.response = {
    status,
    data,
  };
  return error;
};

const request = async <T>(path: string, options: RequestOptions): Promise<T> => {
  const token = getToken();

  const response = await fetch(buildUrl(path), {
    method: options.method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let data: ApiErrorPayload | Record<string, unknown> = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || "Request failed" };
  }

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      removeAuthUser();

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/auth")
      ) {
        window.location.href = "/auth";
      }
    }

    throw createServiceError(response.status, data as ApiErrorPayload);
  }

  return data as T;
};

export const serviceClient = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PUT", body }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
