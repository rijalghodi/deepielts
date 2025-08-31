import * as Sentry from "@sentry/nextjs";
import ms, { StringValue } from "ms";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { env } from "@/lib/env";
import { auth, db } from "@/lib/firebase";
import { signAccessToken, signRefreshToken } from "@/lib/jwt";
import logger from "@/lib/logger";

import { handleError } from "@/server/services";

import { AppError, AppResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();
    if (!idToken) throw new AppError({ message: "Missing token", code: 400 });

    // Verify Firebase ID token
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user role from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    let userData = userDoc.data();

    if (!userData) {
      // Create new user
      const newUser = {
        email: decodedToken.email as string,
        name: decodedToken?.name ?? decodedToken.email?.split("@")[0] ?? "User",
        role: "user",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("users").doc(uid).set(newUser);
      userData = newUser;
    }

    const jwtToken = await signAccessToken({
      uid,
      email: decodedToken.email as string,
      name: userData.name,
      role: userData.role,
      isVerified: userData?.isVerified,
    });

    // Set JWT in HttpOnly cookie
    (await cookies()).set(ACCESS_TOKEN_KEY, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ms((env.JWT_ACCESS_EXPIRES_IN as StringValue) || "1h") / 1000,
      path: "/",
    });

    const refreshToken = await signRefreshToken({
      uid,
      email: decodedToken.email as string,
      name: userData.name,
      role: userData.role,
      isVerified: userData?.isVerified,
    });

    (await cookies()).set(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: ms((env.JWT_REFRESH_EXPIRES_IN as StringValue) || "60d") / 1000,
      path: "/",
    });

    return NextResponse.json(new AppResponse({ data: true }));
  } catch (error: any) {
    logger.error(error, "POST /auth/google");
    Sentry.captureException(error);
    return handleError(error);
  }
}
