import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { GUEST_USER_ID } from "@/lib/constants/database";
import logger from "@/lib/logger";

import { authGetUser } from "@/app/api/auth/auth-middleware";
import { handleError } from "@/server/services";
import { incrementUsage, isBelowLimit } from "@/server/services/rate-limiter";
import { generateFeedbackPDF } from "@/server/services/submission.service";

import { AppError, AppResponse } from "@/types/global";

const MAX_PDF_GENERATION_PER_DAY = 30;
const GUEST_MAX_PDF_GENERATION_PER_DAY = 5;

export async function POST(req: NextRequest, context: { params: Promise<{ submissionId: string }> }) {
  try {
    const user = await authGetUser();
    const isAuthenticated = !!user?.uid;
    const dailyAttemptId = isAuthenticated
      ? `pdf-generation:${user.uid}`
      : `pdf-generation:${req.headers.get("x-forwarded-for")}`;
    const allowed = await isBelowLimit(
      dailyAttemptId,
      isAuthenticated ? MAX_PDF_GENERATION_PER_DAY : GUEST_MAX_PDF_GENERATION_PER_DAY,
    );

    if (!allowed) {
      throw new AppError({
        message: isAuthenticated
          ? `Daily limit reached. Generate max ${MAX_PDF_GENERATION_PER_DAY} pdfs/day. Upgrade to get more pdfs.`
          : `Daily limit reached. Generate max ${GUEST_MAX_PDF_GENERATION_PER_DAY} pdfs/day. Login to get more pdfs.`,
        code: 429,
        name: isAuthenticated ? "FreeUserDailyLimitReached" : "GuestDailyLimitReached",
      });
    }

    const params = await context.params;
    const { submissionId } = params;

    if (!submissionId) {
      throw new AppError({ message: "Submission ID is required", code: 400 });
    }

    const userId = user?.uid || GUEST_USER_ID;
    const generatedFile = await generateFeedbackPDF({ userId, submissionId });

    await incrementUsage(dailyAttemptId);

    return NextResponse.json(
      new AppResponse({
        data: generatedFile,
      }),
    );
  } catch (error: any) {
    logger.error(error, `POST /submissions/:submissionId/pdf`);
    Sentry.captureException(error);
    return handleError(error);
  }
}
