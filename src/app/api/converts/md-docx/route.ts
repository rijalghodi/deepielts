import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { authGetUser } from "@/app/api/auth/auth-middleware";
import { convertMdToDocx } from "@/lib/files/md-to-docx";
import logger from "@/lib/logger";
import { handleError } from "@/server/services";
import { incrementUsage, isBelowLimit } from "@/server/services/rate-limiter";
import { AppError } from "@/types/global";

const MAX_DOCX_GENERATION_PER_DAY = 30;
const GUEST_MAX_DOCX_GENERATION_PER_DAY = 5;

export async function POST(req: NextRequest) {
  try {
    const user = await authGetUser();
    const isAuthenticated = !!user?.uid;
    const dailyAttemptId = isAuthenticated
      ? `docx-generation:${user.uid}`
      : `docx-generation:${req.headers.get("x-forwarded-for")}`;
    const allowed = await isBelowLimit(
      dailyAttemptId,
      isAuthenticated ? MAX_DOCX_GENERATION_PER_DAY : GUEST_MAX_DOCX_GENERATION_PER_DAY,
    );

    logger.info(`Generating DOCX for user ${user?.uid} | dailyAttemptId: ${dailyAttemptId} | allowed: ${allowed}`);

    if (!allowed) {
      throw new AppError({
        message: isAuthenticated
          ? `Daily limit reached. Generate max ${MAX_DOCX_GENERATION_PER_DAY} docx files/day. Upgrade to get more docx files.`
          : `Daily limit reached. Generate max ${GUEST_MAX_DOCX_GENERATION_PER_DAY} docx files/day. Login to get more docx files.`,
        code: 429,
        name: isAuthenticated ? "FreeUserDailyLimitReached" : "GuestDailyLimitReached",
      });
    }

    const body = await req.json();
    const { markdown } = body;

    if (!markdown || typeof markdown !== "string") {
      throw new AppError({ message: "Markdown text is required", code: 400 });
    }

    // Convert markdown to DOCX using the library function
    const docxBuffer = await convertMdToDocx(markdown);

    await incrementUsage(dailyAttemptId);

    // Return DOCX file - convert Buffer to Uint8Array for NextResponse
    return new NextResponse(new Uint8Array(docxBuffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=file.docx",
      },
    });
  } catch (error: any) {
    logger.error(error, `POST /api/converts/md-docx`);
    Sentry.captureException(error);
    return handleError(error);
  }
}
