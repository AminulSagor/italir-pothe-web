import { NextRequest, NextResponse } from "next/server";

const AUTH_TOKEN_KEY = "accessToken";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(AUTH_TOKEN_KEY)?.value;

  // Temporary: backend/auth not ready yet.
  // Allow admin dashboard without token for now.
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // If user visits auth page while token exists, send dashboard.
  if (pathname.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/auth/:path*"],
};
