import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
// import { verifyAccessToken } from "@/lib/jwt";

import logger from "./lib/logger";
import { env } from "./lib/env";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  const authToken = request.cookies.get(ACCESS_TOKEN_KEY);

  if (!authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    await jwtVerify(authToken.value, new TextEncoder().encode(env.JWT_ACCESS_SECRET!));

    return NextResponse.next();
  } catch (error) {
    logger.error(error, "Middleware Error");

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
