export const AUTH_TOKEN_KEY = "access_token";

export const setToken = (token: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24}; SameSite=Lax`;
};

export const getToken = (): string | null => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`${AUTH_TOKEN_KEY}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
};

export const removeToken = () => {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
};
