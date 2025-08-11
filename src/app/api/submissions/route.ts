import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

import { createSubmissionBodySchema, listSubmissionsQuerySchema } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models/submission";
import { handleError } from "@/server/services/interceptor";
import { checkDailyLimit, updateDailyAttempt } from "@/server/services/rate-limiter";
import { createSubmission, listUserSubmissions } from "@/server/services/submission.repo";
import {
  createFeedbackReadableStream,
  generateChartDataIfNeeded,
  generateScore,
  parseScoreJson,
} from "@/server/services/submission.service";

import { authGetUser, authMiddleware } from "../auth/auth-middleware";

import { AppError, AppPaginatedResponse } from "@/types/global";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const user = await authGetUser();
    const isAuthenticated = !!user?.uid;
    const dailyAttemptId = isAuthenticated ? `daily:${user.uid}` : `daily:${req.headers.get("x-forwarded-for")}`;
    const maxAttempt = isAuthenticated ? 3 : 1;
    const allowed = await checkDailyLimit(dailyAttemptId, maxAttempt);

    if (!allowed) {
      throw new AppError({
        message: isAuthenticated
          ? "Daily limit reached. You can submit up to 3 times per day."
          : "Daily limit reached. Guests can submit only once per day. Sign in to get 3 submissions daily.",
        code: 429,
      });
    }

    const body = await req.json();
    const data = createSubmissionBodySchema.parse(body);
    const { question, answer, attachment, questionType } = data;

    const attachmentInsight = await generateChartDataIfNeeded({
      questionType: questionType as QuestionType,
      attachment,
      signal: (req as any).signal,
    });

    if ((req as any).signal?.aborted) {
      throw new Error("Request cancelled");
    }

    const score = await generateScore({
      questionType: questionType as QuestionType,
      question,
      answer,
      attachmentInsight,
      signal: (req as any).signal,
    });

    let onCompleteResolve: () => void;
    const onCompletePromise = new Promise<void>((resolve) => {
      onCompleteResolve = resolve;
    });

    const readable = createFeedbackReadableStream({
      signal: (req as any).signal,
      scoreText: score,
      questionType: questionType as QuestionType,
      question,
      answer,
      attachmentInsight,
      onComplete: async (fullFeedback: string) => {
        try {
          if (!(req as any).signal?.aborted && user?.uid) {
            const parsedScore = parseScoreJson(score);

            const submission = await createSubmission({
              userId: user.uid,
              question,
              answer,
              attachment,
              questionType: questionType as QuestionType,
              score: parsedScore,
              feedback: fullFeedback,
            });

            if (!submission) {
              throw new AppError({ message: "Failed to persist submission", code: 500 });
            }

            await updateDailyAttempt(dailyAttemptId);
          }
        } finally {
          onCompleteResolve();
        }
      },
    });

    // Pipe the readable into a TransformStream so we can wait before closing
    const { readable: stream, writable } = new TransformStream();
    readable.pipeTo(writable);

    // Wait for onComplete before closing stream
    onCompletePromise.then(() => {
      // No-op here — the stream ends naturally when readable ends
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    logger.error(error, "POST /submissions");
    Sentry.captureException(error);

    if (error instanceof Error && error.message === "Request cancelled") {
      throw new AppError({ message: "Generation stopped by user", code: 499 });
    }

    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    await authMiddleware(req);

    const user = (req as any).user;

    // Parse and validate query parameters
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = listSubmissionsQuerySchema.parse(queryParams);

    const { page, limit, questionTypes } = validatedParams;

    const arrayQuestionTypes = questionTypes ? (questionTypes.split(",") as QuestionType[]) : undefined;

    // validate question types
    if (arrayQuestionTypes) {
      arrayQuestionTypes.forEach((type) => {
        if (!Object.values(QuestionType).includes(type)) {
          throw new AppError({ message: "Invalid question type", code: 400 });
        }
      });
    }

    const { submissions, totalCount } = await listUserSubmissions({
      userId: user.uid,
      page,
      limit,
      questionTypes: arrayQuestionTypes,
      withCount: page === 1,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return NextResponse.json(
      new AppPaginatedResponse({
        data: submissions,
        pagination: {
          page,
          limit,
          totalCount,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      }),
    );
  } catch (error: any) {
    logger.error(error, "GET /submissions");
    Sentry.captureException(error);
    return handleError(error);
  }
}
