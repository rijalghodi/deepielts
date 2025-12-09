import * as Sentry from "@sentry/nextjs";

import logger from "@/lib/logger";
import { handleError } from "@/server/services";
import { AppError } from "@/types";

export const dynamic = "force-dynamic";

// A faulty API route to test Sentry's error monitoring
export function GET() {
  try {
    throw new AppError({ message: "This error is raised on the backend called by the example page.", code: 500 });
  } catch (error: any) {
    logger.error(error, "GET /sentry-example-api");
    Sentry.captureException(error);
    return handleError(error);
  }
}
