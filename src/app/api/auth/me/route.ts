import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";

import { JwtDecode } from "@/lib/jwt";
import logger from "@/lib/logger";
import { handleError } from "@/server/services";
import { getUserById, updateUser } from "@/server/services/user.service";
import { AppError, AppResponse } from "@/types";

import { authGetUser } from "../auth-middleware";

export async function GET(req: NextRequest ) {
  try {
   const user = await authGetUser();

    if (!user) throw new AppError({ message: "User not found", code: 404 });

    const userDb = await getUserById(user.uid);
    if (!userDb) throw new AppError({ message: "User not found", code: 404 });

    return NextResponse.json(
      new AppResponse({
        data: userDb,
      }),
    );
  } catch (error: any) {
    logger.error(error, "GET /auth/me");
    Sentry.captureException(error);
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await authGetUser();
    if (!authResult) {
      throw new AppError({ message: "Unauthorized", code: 401 });
    }

    const userId = authResult.uid;
    const { name } = await request.json();

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new AppError({ message: "Name is required and must be a non-empty string", code: 400 });
    }

    // Update the user's name
    await updateUser(userId, { name: name.trim() });

    return NextResponse.json(new AppResponse({ data: { name: name.trim() }, message: "Name updated successfully" }));
  } catch (error: any) {
    logger.error(error, "PUT /auth/me");
    Sentry.captureException(error);
    return handleError(error);
  }
}
