import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

import { authMiddleware } from "@/app/api/auth/auth-middleware";
import { handleError } from "@/server/services";
import { generateFeedbackPDF } from "@/server/services/submission.service";

import { AppError, AppResponse } from "@/types/global";

export async function POST(req: NextRequest, context: { params: Promise<{ submissionId: string }> }) {
  try {
    await authMiddleware(req);

    const user = (req as any).user;
    const params = await context.params;
    const { submissionId } = params;

    if (!submissionId) {
      throw new AppError({ message: "Submission ID is required", code: 400 });
    }

    const generatedFile = await generateFeedbackPDF({ userId: user.uid, submissionId });

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
