import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";
import { env } from "@/lib/env";
import { JwtPayload, signAccessToken, signRefreshToken } from "@/lib/jwt";
import logger from "@/lib/logger";

import { VerifyCodeEmail } from "@/components/emails/verify-code.email";

import { handleError } from "@/server/services";
import { isCodeValid, removeCode } from "@/server/services";
import { createUserWithEmail, getUserByEmail } from "@/server/services/user.service";
import { generateCode, storeCode } from "@/server/services/verify-code.service";

import { AppError, AppResponse } from "@/types";

const resend = new Resend(env.RESEND_API_KEY);

export async function GET(req: NextRequest) {
  try {
    const email = z.string().email().parse(req.nextUrl.searchParams.get("email"));

    // Generate a 6-digit code
    const code = generateCode();

    // Store the code
    await storeCode(email, code, 10); // 10 minutes expiry

    const { error } = await resend.emails.send({
      from: "Deep IELTS <noreply@rijalghodi.xyz>",
      to: [email],
      subject: "Code Verification",
      react: VerifyCodeEmail({ code }),
    });

    if (error) {
      throw new AppError({ message: error.message, code: 500 });
    }

    return NextResponse.json(new AppResponse({ data: null, message: "Code sent" }));
  } catch (error: any) {
    logger.error(error, "GET /auth/code");
    return handleError(error);
  }
}

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = verifyCodeSchema.parse(body);

    // Check if code is valid
    const isValid = await isCodeValid(email, code);
    if (!isValid) {
      throw new AppError({ message: "Invalid or expired code", code: 400 });
    }

    // Code is valid, remove it from storage
    await removeCode(email);

    // Check if user exists in Firestore
    let userData: any;
    let uid: string;
    const user = await getUserByEmail(email);
    if (!user) {
      // User doesn't exist, create new user
      const newUser = await createUserWithEmail(email);
      uid = newUser.id!;
      userData = newUser;
    } else {
      // User exists
      uid = user.id!;
      userData = user;
    }

    const userPayload: JwtPayload = {
      uid,
      email,
      name: userData.name,
      role: userData.role,
      isVerified: userData.isVerified,
    };

    // Create JWT token
    const jwtToken = signAccessToken(userPayload);

    // Set JWT in HttpOnly cookie
    (await cookies()).set(ACCESS_TOKEN_KEY, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: env.NEXT_PUBLIC_JWT_ACCESS_EXPIRES_IN,
      path: "/",
    });

    const refreshToken = signRefreshToken(userPayload);

    (await cookies()).set(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: env.NEXT_PUBLIC_JWT_REFRESH_EXPIRES_IN,
      path: "/",
    });

    userData.accessToken = jwtToken;
    userData.accessTokenExpiresAt = new Date(Date.now() + (env.NEXT_PUBLIC_JWT_ACCESS_EXPIRES_IN || 0) * 1000);
    userData.refreshToken = refreshToken;
    userData.refreshTokenExpiresAt = new Date(Date.now() + (env.NEXT_PUBLIC_JWT_REFRESH_EXPIRES_IN || 0) * 1000);

    return NextResponse.json(new AppResponse({ data: userData, message: "Code verified" }));
  } catch (error: any) {
    logger.error(error, "POST /auth/code");
    return handleError(error);
  }
}
