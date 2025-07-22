import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { verifyAccessToken } from "@/lib/jwt";

import { AppError } from "@/types";

export async function authMiddleware(req: NextRequest) {
  const authToken = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    return NextResponse.json(new AppError({ message: "Unauthorized" }), { status: 401 });
  }

  try {
    const decoded = verifyAccessToken(authToken.value);
    (req as any).user = decoded; // Attach user data to request
    return NextResponse.next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(new AppError({ message: "Token expired" }), { status: 401 });
    }
    return NextResponse.json(new AppError({ message: "Invalid token" }), { status: 401 });
  }
}
