import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { verifyAccessToken } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname is in the protected routes
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  // Get the access token from cookies
  const authToken = request.cookies.get(ACCESS_TOKEN_KEY);

  if (!authToken) {
    // No token found, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    // Verify the JWT token
    const decoded = verifyAccessToken(authToken.value);

    // Token is valid, continue to the protected route
    if (decoded.uid) {
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    // Token is expired or invalid, redirect to home
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Any other JWT error, redirect to home
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
