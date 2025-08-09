import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { verifyAccessToken } from "@/lib/jwt";

import { AppError } from "@/types";

export async function authGetUser() {
  const authToken = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    return null;
  }

  try {
    const decoded = verifyAccessToken(authToken.value);
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return null;
    }
    return null;
  }
}

export async function authMiddleware(req: NextRequest) {
  const authToken = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    throw new AppError({ message: "Unauthorized", code: 401 });
  }

  try {
    const decoded = verifyAccessToken(authToken.value);
    (req as any).user = decoded; // Attach user data to request
    return null; // Return null to indicate success
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError({ message: "Token expired", code: 401 });
    }
    throw new AppError({ message: "Invalid token", code: 401 });
  }
}
