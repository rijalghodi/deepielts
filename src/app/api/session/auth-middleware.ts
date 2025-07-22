import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";

const SECRET_KEY = process.env.JWT_SECRET!;

export type User = {
  uid: string;
  email: string;
  name: string;
  role: string;
};

export async function authMiddleware(req: Request) {
  const authToken = (await cookies()).get(ACCESS_TOKEN_KEY);
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(authToken.value, SECRET_KEY) as User;
    (req as any).user = decoded; // Attach user data to request
    return NextResponse.next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ error: "Token expired" }, { status: 401 });
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
