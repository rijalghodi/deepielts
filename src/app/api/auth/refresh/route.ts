import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { env } from "@/lib/env";
import { JwtDecode, signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import logger from "@/lib/logger";

import { handleError } from "@/server/services";

import { AppError, AppResponse } from "@/types";

export async function POST(_: Request) {
  const refreshToken = (await cookies()).get(REFRESH_TOKEN_KEY)?.value;
  if (!refreshToken) throw new AppError({ message: "Unauthorized", code: 401 });

  try {
    const jwtDecode = verifyRefreshToken(refreshToken) as JwtDecode;

    if (!jwtDecode) throw new AppError({ message: "Invalid token" });

    const { exp, iat, ...payload } = jwtDecode;

    // Reissue a new token
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    (await cookies()).set(ACCESS_TOKEN_KEY, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: env.NEXT_PUBLIC_JWT_ACCESS_EXPIRES_IN,
      path: "/",
    });

    (await cookies()).set(REFRESH_TOKEN_KEY, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: env.NEXT_PUBLIC_JWT_REFRESH_EXPIRES_IN,
      path: "/",
    });
    return NextResponse.json(new AppResponse({ data: payload, message: "Token refreshed" }));
  } catch (error: any) {
    logger.error(error, "POST /auth/refresh");
    return handleError(error);
  }
}
