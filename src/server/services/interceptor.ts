import { NextResponse } from "next/server";
import { z } from "zod";

import { AppError } from "@/types";

export const handleError = (error: any): NextResponse => {
  if (error instanceof AppError) {
    return NextResponse.json(error, { status: error.code ?? 500 });
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(new AppError({ message: error.message }), { status: 400 });
  }

  return NextResponse.json(new AppError({ message: error.message }), { status: 422 });
};
