import { NextRequest, NextResponse } from "next/server";

import { JwtDecode } from "@/lib/jwt";
import logger from "@/lib/logger";

import { handleError } from "@/server/services";
import { getUserById } from "@/server/services/user.service";

import { authMiddleware } from "../auth-middleware";

import { AppResponse } from "@/types";

export async function GET(req: NextRequest & { user: JwtDecode }) {
  try {
    await authMiddleware(req);

    const user = await getUserById(req.user.uid);
    if (!user) throw new Error("User not found");

    return NextResponse.json(
      new AppResponse({
        data: user,
      }),
    );
  } catch (error: any) {
    logger.error("GET /auth/me: " + error);
    return handleError(error);
  }
}
