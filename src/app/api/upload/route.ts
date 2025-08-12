import * as Sentry from "@sentry/nextjs";
import { NextResponse } from "next/server";

import logger from "@/lib/logger";

import { handleError } from "@/server/services/interceptor";
import { incrementDailyUsage, isBelowDailyLimit } from "@/server/services/rate-limiter";
import { uploadFileToStorage } from "@/server/services/upload.service";

import { authGetUser } from "../auth/auth-middleware";

import { AppError, AppResponse } from "@/types";

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const MAX_FILE_UPLOAD_PER_DAY = 1;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) ?? "commons";

    if (!file) {
      throw new AppError({ message: "Missing 'file' in form data", code: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new AppError({ message: `File size exceeds ${MAX_FILE_SIZE} bytes`, code: 400 });
    }

    // Check daily limit
    const user = await authGetUser();
    const isAuthenticated = !!user?.uid;
    const dailyAttemptId = isAuthenticated
      ? `file-upload:${user.uid}`
      : `file-upload:${req.headers.get("x-forwarded-for")}`;
    const allowed = await isBelowDailyLimit(dailyAttemptId, MAX_FILE_UPLOAD_PER_DAY);

    if (!allowed) {
      throw new AppError({
        message: `Daily limit reached. Upload max ${MAX_FILE_UPLOAD_PER_DAY} files/day.`,
        code: 429,
      });
    }

    const uploadedFile = await uploadFileToStorage({
      file: Buffer.from(await file.arrayBuffer()),
      folder,
      contentType: file.type,
      fileName: file.name,
    });

    await incrementDailyUsage(dailyAttemptId);

    return NextResponse.json(
      new AppResponse({
        data: uploadedFile,
      }),
    );
  } catch (error) {
    logger.error(error, "POST /upload");
    Sentry.captureException(error);
    return handleError(error);
  }
}
