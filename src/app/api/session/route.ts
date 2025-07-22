import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";
import { admin, db } from "@/lib/firebase";

import { signJWT, verifyJwt } from "@/server/services/session.service";

import { authMiddleware, User } from "./auth-middleware";

import { AppResponse } from "@/types";

export async function GET(req: NextRequest & { user: User }) {
  try {
    await authMiddleware(req);
    // Fetch user role from Firestore
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    const userData = userDoc.data();
    if (!userData) throw new Error("User not found");
    return NextResponse.json(new AppResponse(userData));
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: "Missing token" }, { status: 400 });

    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // Fetch user role from Firestore
    const userDoc = await db.collection("users").doc(uid).get();
    const userData = userDoc.data();
    if (!userData) throw new Error("User not found");

    const jwtToken = await signJWT({
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
      maxAge: 60 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ message: `Invalid token: ${String(error?.message)}` }, { status: 401 });
  }
}

export async function DELETE() {
  (await cookies()).delete(ACCESS_TOKEN_KEY);
  return NextResponse.json({ success: true });
}

export async function PUT(_: Request) {
  const oldToken = (await cookies()).get(ACCESS_TOKEN_KEY)?.value;
  if (!oldToken) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = await verifyJwt(oldToken);

    if (!decoded) return NextResponse.json({ error: "Invalid token" });

    // Reissue a new token
    const newToken = await signJWT({
      uid: decoded?.uid,
      email: decoded?.email,
      name: decoded?.name,
      role: decoded?.role,
      isVerified: decoded?.isVerified,
    });

    (await cookies()).set(ACCESS_TOKEN_KEY, newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
