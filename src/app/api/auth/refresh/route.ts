import * as Sentry from "@sentry/nextjs";
import ms, { StringValue } from "ms";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { env } from "@/lib/env";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "@/lib/jwt";
import logger from "@/lib/logger";
import { handleError } from "@/server/services";
import { AppError, AppResponse } from "@/types";

export async function POST(_: Request) {
  try {
    const refreshToken = (await cookies()).get(REFRESH_TOKEN_KEY)?.value;
    if (!refreshToken) throw new AppError({ message: "Unauthorized", code: 401 });

    const jwtDecode = await verifyRefreshToken(refreshToken);

    if (!jwtDecode) throw new AppError({ message: "Invalid token" });

    const { exp, iat, ...payload } = jwtDecode;

    // Reissue a new token
    const newAccessToken = await signAccessToken(payload);
    const newRefreshToken = await signRefreshToken(payload);

    (await cookies()).set(ACCESS_TOKEN_KEY, newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ms((env.JWT_ACCESS_EXPIRES_IN as StringValue) || "1h") / 1000,
      path: "/",
    });

    (await cookies()).set(REFRESH_TOKEN_KEY, newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ms((env.JWT_REFRESH_EXPIRES_IN as StringValue) || "60d") / 1000,
      path: "/",
    });
    return NextResponse.json(new AppResponse({ data: payload, message: "Token refreshed" }));
  } catch (error: any) {
    logger.error(error, "POST /auth/refresh");
    Sentry.captureException(error);
    return handleError(error);
  }
}
