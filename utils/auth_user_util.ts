import type { LoginUser } from "@/types/auth/login_type";
import { decodeJwtPayload } from "@/storage/jwt_decoder";
import { getToken } from "@/utils/cookies_util";

export const AUTH_USER_KEY = "auth_user";

export type AuthUser = Pick<
  LoginUser,
  "id" | "fullName" | "email" | "phone" | "role" | "profilePhotoFileId"
>;

export const setAuthUser = (user: AuthUser) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};

export const getStoredAuthUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const user = localStorage.getItem(AUTH_USER_KEY);
  if (!user) return null;

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    localStorage.removeItem(AUTH_USER_KEY);
    return null;
  }
};

export const getAuthUser = (): AuthUser | null => {
  const storedUser = getStoredAuthUser();
  if (storedUser) return storedUser;

  const token = getToken();
  const payload = token ? decodeJwtPayload(token) : null;

  if (!payload) return null;

  return {
    id: payload.id || payload.sub || "",
    fullName: payload.fullName || "Admin",
    email: payload.email || null,
    phone: payload.phone || null,
    role: payload.role || "admin",
    profilePhotoFileId: null,
  };
};

export const removeAuthUser = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_USER_KEY);
};

export const formatUserRole = (role?: string | null) => {
  if (!role) return "Admin";

  return role
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};
