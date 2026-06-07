import { serviceClient } from "@/service/base/service_client";
import { LoginPayload, LoginResponse } from "@/types/auth/login_type";

export const login = async (payload: LoginPayload) => {
  return serviceClient.post<LoginResponse>("/auth/login", payload);
};
