import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

import { authMiddleware } from "@/app/api/auth/auth-middleware";
import { handleError } from "@/server/services";
import { getSubmission } from "@/server/services/submission.repo";

export async function GET(req: NextRequest, { params }: { params: { submissionId: string } }) {
  try {
    // Authenticate user
    await authMiddleware(req);

    const user = (req as any).user;
    const { submissionId } = params;

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const submission = await getSubmission(user.uid, submissionId);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    return NextResponse.json({ data: submission });
  } catch (error: any) {
    logger.error(error, `GET /submissions/${params.submissionId}`);
    Sentry.captureException(error);
    return handleError(error);
  }
}
