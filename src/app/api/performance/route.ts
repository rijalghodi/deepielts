import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

import { getPerformanceQuerySchema } from "@/server/dto/performance.dto";
import { QuestionType } from "@/server/models/submission";
import { handleError } from "@/server/services/interceptor";
import { getPerformance } from "@/server/services/performance.repo";

import { authMiddleware } from "../auth/auth-middleware";

import { AppResponse } from "@/types/global";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // Parse and validate query parameters
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = getPerformanceQuerySchema.parse(queryParams);

    await authMiddleware(req);

    const user = (req as any).user;

    const performance = await getPerformance({
      userId: user.uid,
      questionType: validatedParams.questionType as QuestionType | undefined,
    });

    return NextResponse.json(new AppResponse({ data: performance }));
  } catch (error: any) {
    logger.error(error, "GET /performance");
    Sentry.captureException(error);
    return handleError(error);
  }
}
