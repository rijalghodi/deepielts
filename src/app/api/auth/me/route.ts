import { NextRequest, NextResponse } from "next/server";

import { JwtDecode } from "@/lib/jwt";
import logger from "@/lib/logger";

import { handleError } from "@/server/services";
import { getUserById, updateUser } from "@/server/services/user.service";

import { authGetUser, authMiddleware } from "../auth-middleware";

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
    logger.error(error, "GET /auth/me");
    return handleError(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Authenticate the user
    const authResult = await authGetUser();
    if (!authResult) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authResult.uid;
    const { name } = await request.json();

    // Validate input
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required and must be a non-empty string" }, { status: 400 });
    }

    // Update the user's name
    await updateUser(userId, { name: name.trim() });

    return NextResponse.json({ message: "Name updated successfully", name: name.trim() }, { status: 200 });
  } catch (error) {
    console.error("Error updating name:", error);
    return NextResponse.json({ error: "Failed to update name" }, { status: 500 });
  }
}
