import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { admin, db } from "@/lib/firebase";
import { isCodeValid, removeCode } from "@/lib/storage/email-codes";

import { signJWT } from "@/server/services/session.service";

const verifyCodeSchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code } = verifyCodeSchema.parse(body);

    // Check if code is valid
    if (!isCodeValid(email, code)) {
      return NextResponse.json(
        {
          error: "Invalid or expired code",
        },
        { status: 400 }
      );
    }

    // Code is valid, remove it from storage
    removeCode(email);

    // Check if user exists in Firestore
    const userQuery = await db.collection("users").where("email", "==", email).limit(1).get();

    let uid: string;
    let userData: any;

    if (userQuery.empty) {
      // User doesn't exist, create new user
      const userRecord = await admin.auth().createUser({
        email,
        emailVerified: true,
      });

      uid = userRecord.uid;

      // Create user document in Firestore
      const newUser = {
        email,
        name: email.split("@")[0], // Use email prefix as default name
        role: "user",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await db.collection("users").doc(uid).set(newUser);
      userData = newUser;
    } else {
      // User exists, get their data
      const userDoc = userQuery.docs[0];
      uid = userDoc.id;
      userData = userDoc.data();
    }

    // Create JWT token
    const jwtToken = await signJWT({
      uid,
      email,
      name: userData.name,
      role: userData.role,
      isVerified: userData.isVerified,
    });

    // Set JWT in HttpOnly cookie
    (await cookies()).set(ACCESS_TOKEN_KEY, jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        uid,
        email,
        name: userData.name,
        role: userData.role,
        isVerified: userData.isVerified,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid input format",
        },
        { status: 400 }
      );
    }

    console.error("Verify code error:", error);
    return NextResponse.json(
      {
        error: "Failed to verify code",
      },
      { status: 500 }
    );
  }
}
