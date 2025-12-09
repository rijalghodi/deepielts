import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";

import { env, serverEnv } from "./lib/env";
import logger from "./lib/logger";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- CORS handling ---
  const origin = request.headers.get("origin") ?? "*";
  const allowedOrigins = serverEnv.ALLOWED_ORIGIN_CORS?.split(",").map((o) => o.trim()) ?? [];
  const isAllowedOrigin = allowedOrigins.includes(origin);

  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "*");
  response.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // --- Auth handling for protected routes ---
  const protectedRoutes = ["/dashboard", "/checkout"];
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));

  if (!isProtectedRoute) {
    return response;
  }

  const authToken = request.cookies.get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  try {
    await jwtVerify(authToken.value, new TextEncoder().encode(env.JWT_ACCESS_SECRET!));
    return response;
  } catch (error) {
    logger.error(error, "Middleware Error");

    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
