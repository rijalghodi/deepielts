import { cookies } from "next/headers";
import { NextRequest } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { verifyAccessToken } from "@/lib/jwt";
import logger from "@/lib/logger";

import { AppError } from "@/types";

export async function authGetUser() {
  const authToken = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    return null;
  }

  try {
    const decoded = await verifyAccessToken(authToken.value);
    return decoded;
  } catch (_error) {
    return null;
  }
}

export async function authMiddleware(req: NextRequest) {
  const authToken = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    throw new AppError({ message: "Unauthorized", code: 401 });
  }

  try {
    const decoded = await verifyAccessToken(authToken.value);
    (req as any).user = decoded; // Attach user data to request
    return null; // Return null to indicate success
  } catch (error: any) {
    logger.error(error, "authMiddleware");
    throw new AppError({ message: error?.message || "Invalid token", code: 401 });
  }
}
