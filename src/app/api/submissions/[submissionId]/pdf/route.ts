import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";

import { authMiddleware } from "@/app/api/auth/auth-middleware";
import { handleError } from "@/server/services";
import { getSubmission, updateSubmissionPDFUrl } from "@/server/services/submission.repo";
import { convertFeedbackToPDF } from "@/server/services/submission.service";

export async function POST(req: NextRequest, context: { params: Promise<{ submissionId: string }> }) {
  try {
    // Authenticate user
    await authMiddleware(req);

    const user = (req as any).user;
    const params = await context.params;
    const submissionId = params.submissionId;

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
    }

    const submission = await getSubmission(user.uid, submissionId);

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Check if submission has feedback
    if (!submission.feedback) {
      return NextResponse.json({ error: "No feedback available for this submission" }, { status: 400 });
    }

    // Check if PDF already exists
    if (submission.pdfUrl) {
      return NextResponse.json({
        success: true,
        data: {
          pdfUrl: submission.pdfUrl,
          submissionId,
          fileName: `feedback_${submissionId}`,
          isExisting: true,
        },
      });
    }

    // Get request body for optional filename
    const { fileName } = await req.json().catch(() => ({}));

    // Convert feedback to PDF and upload to Firebase Storage
    const pdfUrl = await convertFeedbackToPDF({
      feedbackText: submission.feedback,
      submissionId,
      fileName: fileName || `feedback_${submissionId}`,
    });

    // Store the PDF URL in the submission
    await updateSubmissionPDFUrl(user.uid, submissionId, pdfUrl);

    return NextResponse.json({
      success: true,
      data: {
        pdfUrl,
        submissionId,
        fileName: fileName || `feedback_${submissionId}`,
        isExisting: false,
      },
    });
  } catch (error: any) {
    logger.error(error, `POST /submissions/:submissionId/pdf`);
    Sentry.captureException(error);
    return handleError(error);
  }
}
