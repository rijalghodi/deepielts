import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/lib/constants";

import { AppResponse } from "@/types";

export async function POST() {
  const cookieStore = await cookies();

  const commonOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(0), // Immediately expire
  };

  cookieStore.set(ACCESS_TOKEN_KEY, "", commonOptions);
  cookieStore.set(REFRESH_TOKEN_KEY, "", commonOptions);

  return NextResponse.json(new AppResponse({ data: null, message: "Logged out" }));
}
