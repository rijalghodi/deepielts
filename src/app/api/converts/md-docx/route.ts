import * as Sentry from "@sentry/nextjs";
import HTMLtoDOCX from "html-to-docx";
import { NextRequest, NextResponse } from "next/server";
import { remark } from "remark";
import remarkHtml from "remark-html";

import logger from "@/lib/logger";

import { authGetUser } from "@/app/api/auth/auth-middleware";
import { handleError } from "@/server/services";
import { incrementUsage, isBelowLimit } from "@/server/services/rate-limiter";

import { AppError } from "@/types/global";

const MAX_DOCX_GENERATION_PER_DAY = 30;
const GUEST_MAX_DOCX_GENERATION_PER_DAY = 5;

export async function POST(req: NextRequest) {
  try {
    const user = await authGetUser();
    const isAuthenticated = !!user?.uid;
    const dailyAttemptId = isAuthenticated
      ? `docx-generation:${user.uid}`
      : `docx-generation:${req.headers.get("x-forwarded-for")}`;
    const allowed = await isBelowLimit(
      dailyAttemptId,
      isAuthenticated ? MAX_DOCX_GENERATION_PER_DAY : GUEST_MAX_DOCX_GENERATION_PER_DAY,
    );

    logger.info(`Generating DOCX for user ${user?.uid} | dailyAttemptId: ${dailyAttemptId} | allowed: ${allowed}`);

    if (!allowed) {
      throw new AppError({
        message: isAuthenticated
          ? `Daily limit reached. Generate max ${MAX_DOCX_GENERATION_PER_DAY} docx files/day. Upgrade to get more docx files.`
          : `Daily limit reached. Generate max ${GUEST_MAX_DOCX_GENERATION_PER_DAY} docx files/day. Login to get more docx files.`,
        code: 429,
        name: isAuthenticated ? "FreeUserDailyLimitReached" : "GuestDailyLimitReached",
      });
    }

    const body = await req.json();
    const { markdown } = body;

    if (!markdown || typeof markdown !== "string") {
      throw new AppError({ message: "Markdown text is required", code: 400 });
    }

    // Convert markdown to HTML
    const processed = await remark().use(remarkHtml).process(markdown);
    const html = String(processed);

    // Wrap HTML with styling
    const styledHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 11pt;
              line-height: 1.6;
              margin: 1in;
            }
            p {
              margin-bottom: 12pt;
            }
            h1, h2, h3, h4, h5, h6 {
              font-family: Arial, sans-serif;
              margin-top: 12pt;
              margin-bottom: 6pt;
            }
            h1 { font-size: 18pt; }
            h2 { font-size: 16pt; }
            h3 { font-size: 14pt; }
            h4 { font-size: 12pt; }
            ul, ol {
              margin-bottom: 12pt;
            }
            li {
              margin-bottom: 6pt;
            }
          </style>
        </head>
        <body>
          ${html}
        </body>
      </html>
    `;

    // Convert HTML to DOCX
    const docxBuffer = await HTMLtoDOCX(styledHtml, null, {
      table: { row: { cantSplit: true } },
      footer: true,
      pageNumber: true,
      font: "Arial",
      fontSize: 11,
    });

    await incrementUsage(dailyAttemptId);

    // Return DOCX file (Buffer can be passed directly to NextResponse)
    return new NextResponse(docxBuffer, {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": "attachment; filename=file.docx",
      },
    });
  } catch (error: any) {
    logger.error(error, `POST /api/converts/md-docx`);
    Sentry.captureException(error);
    return handleError(error);
  }
}
