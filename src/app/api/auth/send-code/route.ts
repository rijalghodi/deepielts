import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { generateCode, storeCode } from "@/lib/storage/email-codes";

const sendCodeSchema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = sendCodeSchema.parse(body);

    // Generate a 6-digit code
    const code = generateCode();

    // Store the code
    storeCode(email, code, 10); // 10 minutes expiry

    // TODO: Send email with the code
    // For now, we'll just log it to console
    console.log(`Email code for ${email}: ${code}`);

    return NextResponse.json({
      success: true,
      message: "Code sent to your email",
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Invalid email format",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Failed to send code",
      },
      { status: 500 }
    );
  }
}
