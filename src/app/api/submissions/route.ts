import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/firebase/firebase-admin";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";

import { authMiddleware } from "../auth/auth-middleware";

import { AppError, AppResponse } from "@/types/global";
import { env } from "@/lib/env";

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
