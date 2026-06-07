import { NextRequest, NextResponse } from "next/server";

const AUTH_TOKEN_KEY = "access_token";

function decodeJwtPayload(token: string) {
  try {
    const [, payload] = token.split(".");
    if (!payload) return null;

    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "=",
    );

    return JSON.parse(atob(padded)) as { role?: string; exp?: number };
  } catch {
    return null;
  }
}

function isExpired(exp?: number) {
  if (!exp) return false;
  return exp <= Math.floor(Date.now() / 1000);
}

function clearToken(response: NextResponse) {
  response.cookies.set(AUTH_TOKEN_KEY, "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;
  const payload = token ? decodeJwtPayload(token) : null;
  const isAdmin = String(payload?.role || "").toLowerCase() === "admin";
  const isValidAdminToken = Boolean(token && payload && !isExpired(payload.exp) && isAdmin);

  if (pathname.startsWith("/admin") && !isValidAdminToken) {
    return clearToken(NextResponse.redirect(new URL("/auth", request.url)));
  }

  if (pathname.startsWith("/auth") && isValidAdminToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (pathname.startsWith("/auth") && token && !isValidAdminToken) {
    return clearToken(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
