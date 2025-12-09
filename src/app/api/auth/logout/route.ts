import * as Sentry from "@sentry/nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import logger from "@/lib/logger";
import { handleError } from "@/server/services";
import { AppResponse } from "@/types";

export async function POST() {
  try {
    const cookieStore = await cookies();

    const commonOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      expires: new Date(0), // Immediately expire
    };

    cookieStore.set(ACCESS_TOKEN_KEY, "", commonOptions);
    cookieStore.set(REFRESH_TOKEN_KEY, "", commonOptions);

    return NextResponse.json(new AppResponse({ data: null, message: "Logged out" }));
  } catch (error: any) {
    logger.error(error, "POST /auth/logout");
    Sentry.captureException(error);
    return handleError(error);
  }
}
