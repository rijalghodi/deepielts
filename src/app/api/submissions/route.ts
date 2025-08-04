import { Query, Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { env } from "@/lib/env";
import { db } from "@/lib/firebase/firebase-admin";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";
import { QuestionType } from "@/server/models/submission";

import { authMiddleware } from "../auth/auth-middleware";

import { AppError, AppPaginatedResponse, AppResponse } from "@/types/global";

const DIFY_API_KEY = env.DIFY_API_KEY;
const DIFY_WORKFLOW_URL = env.NEXT_PUBLIC_DIFY_WORKFLOW_URL;

async function analyzeWithDify(question: string, userAnswer: string) {
  if (!DIFY_API_KEY) {
    throw new Error("Dify API key not configured");
  }

  try {
    console.log("question", question);
    console.log("userAnswer", userAnswer);
    const response = await fetch(DIFY_WORKFLOW_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${DIFY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          question: question,
          userAnswer: userAnswer,
        },
        response_mode: "blocking",
        user: "user_1234567890",
      }),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error(`Dify API error: ${response.status} ${response.statusText} ${response.body}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Dify analysis error:", error);
    throw new Error(`Failed to analyze submission with Dify: ${error}`);
  }
}

// Query parameter schema for filtering and sorting
const getSubmissionsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  questionType: z.enum(QuestionType).optional(),
  sortBy: z.enum(["createdAt", "analysis.score"]).default("createdAt"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    await authMiddleware(req);
    // @ts-expect-error: user is attached to req by authMiddleware but not typed
    const user = req.user;
    if (!user?.uid) throw new AppError({ message: "Unauthorized", code: 401 });

    const body = await req.json();
    const data = createSubmissionBodySchema.parse(body);

    const difyAnalysisResult = await analyzeWithDify(data.question, data.answer);

    console.log("difyAnalysisResult", difyAnalysisResult);

    const analysisResult = difyAnalysisResult.data.outputs;

    // Create submission in Firestore under /users/{{userId}}/submissions
    const submissionsRef = db.collection("users").doc(user.uid).collection("submissions");
    const submissionRef = submissionsRef.doc();
    const now = Timestamp.now();
    const newSubmission = {
      ...data,
      id: submissionRef.id,
      userId: user.uid,
      createdAt: now,
      updatedAt: now,
      analysis: analysisResult,
    };
    await submissionRef.set(newSubmission);

    return NextResponse.json(
      new AppResponse({
        data: newSubmission,
        message: "Submission created and analyzed",
      }),
    );
  } catch (error: any) {
    return NextResponse.json(
      new AppError({ message: error.message || "Failed to create submission", code: error.code || 500 }),
      { status: error.code || 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Authenticate user
    await authMiddleware(req);
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
    return NextResponse.json(
      new AppError({ message: error.message || "Failed to get submissions", code: error.code || 500 }),
      { status: error.code || 500 },
    );
  }
}
