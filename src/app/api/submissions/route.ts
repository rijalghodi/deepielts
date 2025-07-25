import { Timestamp } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/firebase/firebase-admin";

import { createSubmissionBodySchema } from "@/server/dto/submission.dto";

import { authMiddleware } from "../auth/auth-middleware";

import { AppError, AppResponse } from "@/types/global";

export async function POST(req: NextRequest) {
  try {
    // Authenticate user
    await authMiddleware(req);
    // @ts-expect-error: user is attached to req by authMiddleware but not typed
    const user = req.user;
    if (!user?.uid) throw new AppError({ message: "Unauthorized", code: 401 });

    const body = await req.json();
    const data = createSubmissionBodySchema.parse(body);

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
    };
    await submissionRef.set(newSubmission);

    return NextResponse.json(new AppResponse({ data: newSubmission, message: "Submission created" }));
  } catch (error: any) {
    return NextResponse.json(
      new AppError({ message: error.message || "Failed to create submission", code: error.code || 500 }),
      { status: error.code || 500 },
    );
  }
}
