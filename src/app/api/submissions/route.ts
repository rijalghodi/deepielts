import { Query } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { db } from "@/lib/firebase/firebase-admin";
import logger from "@/lib/logger";
import { openai } from "@/lib/openai/openai";
import { getDetailFeedbackPrompt, getModelEssayPrompt, getScoreParsePrompt, getScorePrompt } from "@/lib/prompts/utils";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models/submission";
import { handleError } from "@/server/services/interceptor";

import { authMiddleware } from "../auth/auth-middleware";

import { AppError, AppPaginatedResponse } from "@/types/global";

// Query parameter schema for filtering and sorting
const getSubmissionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  questionType: z.enum(Object.values(QuestionType) as [string, ...string[]]).optional(),
  sortBy: z.enum(["createdAt", "analysis.score"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse; // Return the error response from auth middleware
    }

    // @ts-expect-error: user is attached to req by authMiddleware but not typed
    const user = req.user;
    if (!user?.uid) throw new AppError({ message: "Unauthorized", code: 401 });

    const body = await req.json();
    const data = createSubmissionBodySchema.parse(body);

    const { question, answer, attachment, questionType } = data;

    const scorePrompt = getScorePrompt({
      taskType: questionType,
      question,
      answer,
      attachment,
    });

    const detailFeedbackPrompt = getDetailFeedbackPrompt({
      taskType: questionType,
      question,
      answer,
      attachment,
    });

    const modelEssayPrompt = getModelEssayPrompt({
      taskType: questionType,
      question,
      answer,
      attachment,
    });

    // Generate score json
    const generatedScore = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      stream: false,
      messages: [{ role: "system", content: scorePrompt }],
    });

    const scoreJson = generatedScore.choices[0].message.content;

    if (!scoreJson) throw new AppError({ message: "Failed to generate score", code: 500 });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        async function streamOpenAI(prompt: string) {
          const stream = await openai.chat.completions.create({
            model: "gpt-4",
            stream: true,
            messages: [{ role: "system", content: prompt }],
          });

          for await (const chunk of stream) {
            const content = chunk.choices?.[0]?.delta?.content;
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        }

        // Parse score json
        await streamOpenAI(getScoreParsePrompt({ scoreJson }));

        // Optional separator between score json and detail feedback
        controller.enqueue(encoder.encode("\n---\n"));

        // Generate detail feedback
        await streamOpenAI(detailFeedbackPrompt);

        // Optional separator between detail feedback and model essay
        controller.enqueue(encoder.encode("\n---\n"));

        // Generate model essay
        await streamOpenAI(modelEssayPrompt);

        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    logger.error("POST /submissions: " + error);
    return handleError(error);
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    const authResponse = await authMiddleware(req);
    if (authResponse instanceof NextResponse) {
      return authResponse; // Return the error response from auth middleware
    }

    // @ts-expect-error: user is attached to req by authMiddleware but not typed
    const user = req.user;
    if (!user?.uid) throw new AppError({ message: "Unauthorized", code: 401 });

    // Parse and validate query parameters
    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());
    const validatedParams = getSubmissionsQuerySchema.parse(queryParams);

    const { page, limit, questionType, sortBy, sortDir } = validatedParams;

    // Calculate offset for pagination
    const offset = (page - 1) * limit;

    // Build the query
    const submissionsRef = db.collection("users").doc(user.uid).collection("submissions");
    let query: Query = submissionsRef;

    // Apply questionType filter if provided
    if (questionType) {
      query = query.where("questionType", "==", questionType);
    }

    // Apply sorting
    if (sortBy === "analysis.score") {
      // For analysis.score, we need to sort by the nested field
      query = query.orderBy("analysis.score.totalScore", sortDir);
    } else {
      // Default sorting by createdAt
      query = query.orderBy("createdAt", sortDir);
    }

    // Apply pagination
    query = query.offset(offset).limit(limit);

    // Execute the query
    const submissionsSnapshot = await query.get();

    // Get total count for pagination metadata
    let totalCount = 0;
    if (page === 1) {
      // Only count total if we're on the first page (for performance)
      const countQuery = db.collection("users").doc(user.uid).collection("submissions");
      const countSnapshot = questionType
        ? await countQuery.where("questionType", "==", questionType).get()
        : await countQuery.get();
      totalCount = countSnapshot.size;
    }

    // Convert Firestore documents to plain objects
    const submissions = submissionsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
      };
    });

    // Calculate pagination metadata
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
    logger.error("GET /submissions: " + error);
    return handleError(error);
  }
}
