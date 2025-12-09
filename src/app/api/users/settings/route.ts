import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { TARGET_BAND_SCORE } from "@/lib/constants/band-scores";
import logger from "@/lib/logger";
import { handleError } from "@/server/services/interceptor";
import { updateUserSettings } from "@/server/services/settings.service";
import { AppError, AppResponse } from "@/types/global";

import { authGetUser } from "../../auth/auth-middleware";

export const runtime = "nodejs";

export async function PUT(req: NextRequest) {
  try {
    const user = await authGetUser();
    if (!user?.uid) {
      throw new AppError({ message: "Unauthorized", code: 401 });
    }

    const body = await req.json();

    const { targetBandScore, testDate, language } = body;

    if (targetBandScore !== undefined && !TARGET_BAND_SCORE.some((score) => score.value === targetBandScore)) {
      throw new AppError({ message: "Invalid target band score", code: 400 });
    }

    // Validate testDate if provided
    if (testDate !== undefined && typeof testDate === "string") {
      const date = new Date(testDate);
      if (isNaN(date.getTime())) {
        throw new AppError({ message: "Invalid test date format", code: 400 });
      }
    }

    const settings = await updateUserSettings(user.uid, {
      targetBandScore,
      testDate,
      language,
    });

    console.log("settings", settings);

    return NextResponse.json(new AppResponse({ data: settings }));
  } catch (error: any) {
    logger.error(error, "PUT /users/settings");
    Sentry.captureException(error);
    return handleError(error);
  }
}
