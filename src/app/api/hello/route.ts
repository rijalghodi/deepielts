import { NextResponse } from "next/server";

import { AppResponse } from "@/types";

export async function GET() {
  return NextResponse.json(new AppResponse({ data: "Hello, world!" }));
}
