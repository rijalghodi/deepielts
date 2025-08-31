import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { GUEST_USER_ID } from "@/lib/constants/database";
import logger from "@/lib/logger";

import { createSubmissionBodySchema, listSubmissionsQuerySchema } from "@/server/dto/submission.dto";
import { QuestionType, Submission } from "@/server/models/submission";
import { handleError } from "@/server/services/interceptor";
import { incrementUsage, isBelowLimit } from "@/server/services/rate-limiter";
import { createSubmission, listUserSubmissions } from "@/server/services/submission.repo";
import {
  createFeedbackReadableStream,
  generateChartDataIfNeeded,
  generateScore,
  insertFeedbackToSubmission,
  parseScoreJson,
} from "@/server/services/submission.service";
import { getSubscriptionByUserId } from "@/server/services/subscription.repo";

import { authGetUser, authMiddleware } from "../auth/auth-middleware";

import { AppError, AppPaginatedResponse } from "@/types/global";
export const runtime = "nodejs";

const MAX_SUBMISSIONS_PER_DAY = 4;
const GUEST_MAX_SUBMISSIONS_PER_DAY = 2;
const PRO_MAX_SUBMISSIONS_PER_DAY = 20;

export async function POST(req: NextRequest) {
  try {
    const user = await authGetUser();
    const isAuthenticated = !!user?.uid;
    const subscription = isAuthenticated ? await getSubscriptionByUserId(user?.uid) : null;

    const submitDailyId = isAuthenticated
      ? `submit-daily:${user.uid}`
      : `submit-daily:${req.headers.get("x-forwarded-for")}`;
    const maxSubmissions = isAuthenticated
      ? subscription?.status.toLowerCase() === "active"
        ? PRO_MAX_SUBMISSIONS_PER_DAY
        : MAX_SUBMISSIONS_PER_DAY
      : GUEST_MAX_SUBMISSIONS_PER_DAY;

    const allowed = await isBelowLimit(submitDailyId, maxSubmissions);

    if (!allowed) {
      throw new AppError({
        message: isAuthenticated
          ? `Daily limit reached. Free users can submit up to ${maxSubmissions} times per day. Upgrade to get more submissions.`
          : `Daily limit reached. Guests can submit only ${GUEST_MAX_SUBMISSIONS_PER_DAY} times per day. Login to get more submissions.`,
        code: 429,
        name: isAuthenticated ? "FreeUserDailyLimitReached" : "GuestDailyLimitReached",
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

    let submission: Submission | null = null;
    const userId = user?.uid || GUEST_USER_ID;

    const parsedScore = parseScoreJson(score);
    submission = await createSubmission({
      userId,
      question,
      answer,
      attachment: attachment || undefined,
      questionType: questionType as QuestionType,
      score: parsedScore,
    });

    if (!submission) {
      throw new AppError({ message: "Failed to persist submission", code: 500 });
    }

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
      submissionId: submission?.id || "temp",
      onComplete: async (fullFeedback: string) => {
        try {
          if (!(req as any).signal?.aborted && submission) {
            // Insert the generated feedback to the submission
            await insertFeedbackToSubmission({
              userId,
              submissionId: submission.id,
              feedback: fullFeedback,
            });
          }
        } finally {
          onCompleteResolve();
          await incrementUsage(submitDailyId);
        }
      },
    });

    const { readable: stream, writable } = new TransformStream();
    const pipePromise = readable.pipeTo(writable);

    onCompletePromise.finally(() => pipePromise.catch(() => {}));

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
