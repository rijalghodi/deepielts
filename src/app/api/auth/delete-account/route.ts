import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import logger from "@/lib/logger";
import { handleError } from "@/server/services";
import { deleteUserAccount } from "@/server/services/user.service";
import { AppError, AppResponse } from "@/types";

import { authGetUser } from "../auth-middleware";

export async function DELETE(_request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await authGetUser();
    if (!authResult) {
      throw new AppError({ message: "Unauthorized", code: 401 });
    }

    const userId = authResult.uid;

    // Delete the user account and all associated data
    await deleteUserAccount(userId);

    return NextResponse.json(new AppResponse({ data: null, message: "Account deleted successfully" }));
  } catch (error: any) {
    logger.error(error, "DELETE /auth/delete-account");
    Sentry.captureException(error);
    return handleError(error);
  }
}
