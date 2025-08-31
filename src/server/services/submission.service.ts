import { Timestamp } from "firebase-admin/firestore";

import { mdToPdfBufferViaAPI } from "@/lib/files/md-to-pdf-api";
import { db } from "@/lib/firebase/firebase-admin";
import { openai } from "@/lib/openai/openai";
import {
  getChartDataPrompt,
  getDetailFeedbackPrompt,
  getModelEssayPrompt,
  getScoreParsePrompt,
  getScorePrompt,
} from "@/lib/prompts/utils";

import { QuestionType } from "@/server/models/submission";

import { getSubmission } from "./submission.repo";
import { uploadFileToStorage } from "./upload.service";
import { UploadedFile } from "../models/upload";

import { AppError } from "@/types/global";

export async function generateChartDataIfNeeded(params: {
  questionType: QuestionType;
  attachment?: string | null;
  signal?: AbortSignal;
}): Promise<string> {
  const { questionType, attachment, signal } = params;

  if (questionType !== QuestionType.TASK_1_ACADEMIC) {
    return "None";
  }

  if (signal?.aborted) {
    throw new AppError({ message: "Request cancelled", name: "AbortError", code: 499 });
  }

  const chartDataPrompt = getChartDataPrompt();

  const generatedChartData = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: chartDataPrompt,
          },
          {
            type: "image_url",
            image_url: {
              url: attachment || "",
            },
          },
        ],
      },
    ],
  });

  return generatedChartData.choices[0].message.content || "None";
}

export async function generateScore(params: {
  questionType: QuestionType;
  question: string;
  answer: string;
  attachmentInsight: string;
  signal?: AbortSignal;
}): Promise<string> {
  const { questionType, question, answer, attachmentInsight, signal } = params;

  const scorePrompt = getScorePrompt({
    taskType: questionType,
    question,
    answer,
    attachmentInsight,
  });

  if (signal?.aborted) {
    throw new AppError({ message: "Request cancelled", name: "AbortError", code: 499 });
  }

  const generatedScore = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: false,
    messages: [{ role: "user", content: scorePrompt }],
  });

  const score = generatedScore.choices[0].message.content;
  if (!score) throw new AppError({ message: "Failed to generate score", code: 500 });
  return score;
}

export function parseScoreJson(scoreText: string): any | undefined {
  try {
    return JSON.parse(scoreText);
  } catch (_e) {
    return undefined;
  }
}

export function createFeedbackReadableStream(params: {
  signal?: AbortSignal;
  scoreText: string;
  questionType: QuestionType;
  question: string;
  answer: string;
  attachmentInsight: string;
  submissionId: string;
  onComplete?: (fullFeedback: string) => Promise<void> | void;
}): ReadableStream<Uint8Array> {
  const { signal, scoreText, questionType, question, answer, attachmentInsight, submissionId, onComplete } = params;

  const detailFeedbackPrompt = getDetailFeedbackPrompt({
    taskType: questionType,
    question,
    answer,
    attachmentInsight,
  });

  const modelEssayPrompt = getModelEssayPrompt({
    taskType: questionType,
    question,
    answer,
    attachmentInsight,
  });

  const encoder = new TextEncoder();
  let fullFeedback = "";

  return new ReadableStream<Uint8Array>({
    async start(controller) {
      const enqueue = (text: string) => controller.enqueue(encoder.encode(text));

      const streamOpenAI = async (prompt: string) => {
        if (signal?.aborted) {
          throw new AppError({ message: "Request cancelled", name: "AbortError", code: 499 });
        }

        const stream = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          stream: true,
          messages: [{ role: "system", content: prompt }],
        });

        let buffer = "";
        let chunkCount = 0;

        for await (const chunk of stream) {
          if (signal?.aborted) {
            throw new AppError({ message: "Request cancelled", name: "AbortError", code: 499 });
          }

          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            buffer += content;
            fullFeedback += content;
            chunkCount++;

            if (chunkCount >= 1) {
              enqueue(buffer);
              buffer = "";
              chunkCount = 0;
            }
          }
        }

        if (buffer) {
          enqueue(buffer);
        }
      };

      try {
        enqueue(`---\nsubmissionId: ${submissionId}\n---\n\n`);
        await streamOpenAI(getScoreParsePrompt({ score: scoreText }));
        enqueue("\n\n\n");
        fullFeedback += "\n\n\n";
        await streamOpenAI(detailFeedbackPrompt);
        enqueue("\n\n\n");
        fullFeedback += "\n\n\n";
        await streamOpenAI(modelEssayPrompt);
      } catch (error) {
        if (error instanceof Error && error.message === "Request cancelled") {
          enqueue("\n[Generation stopped by user]\n");
        } else {
          enqueue("\n[Error occurred during streaming]\n");
        }
      } finally {
        try {
          if (onComplete) {
            await onComplete(fullFeedback);
          }
        } finally {
          controller.close();
        }
      }
    },
  });
}

export async function generateFeedbackPDF(params: { userId: string; submissionId: string }): Promise<UploadedFile> {
  const { submissionId, userId } = params;

  const submission = await getSubmission(userId, submissionId);

  if (!submission) {
    throw new AppError({ message: "Submission not found", code: 404 });
  }

  if (!submission.feedback) {
    throw new AppError({ message: "No feedback available for this submission", code: 400 });
  }

  if (submission.pdfUrl) {
    return {
      url: submission.pdfUrl,
    };
  }

  const pdfInput = `## Question\n\n${submission.question}\n\n ## Your Answer\n\n${submission.answer}\n\n## Feedback\n\n${submission.feedback}`;

  const pdfBuffer = await mdToPdfBufferViaAPI(pdfInput);

  const uploadedFile = await uploadFileToStorage({
    file: pdfBuffer,
    folder: "feedback-pdfs",
    fileName: "feedback.pdf",
    contentType: "application/pdf",
    metadata: {
      submissionId,
    },
  });

  await insertPdfUrlToSubmission({
    userId,
    submissionId,
    pdfUrl: uploadedFile.url,
  });

  return uploadedFile;
}

/**
 * Insert feedback to an existing submission
 */
export async function insertPdfUrlToSubmission(params: {
  userId: string;
  submissionId: string;
  pdfUrl: string;
}): Promise<void> {
  const { userId, submissionId, pdfUrl } = params;

  try {
    const submissionRef = db.collection("users").doc(userId).collection("submissions").doc(submissionId);

    await submissionRef.update({
      pdfUrl,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw new AppError({
      message: `Failed to update submission pdfUrl: ${error instanceof Error ? error.message : "Unknown error"}`,
      code: 500,
    });
  }
}

/**
 * Insert feedback to an existing submission
 */
export async function insertFeedbackToSubmission(params: {
  userId: string;
  submissionId: string;
  feedback: string;
}): Promise<void> {
  const { userId, submissionId, feedback } = params;

  try {
    const submissionRef = db.collection("users").doc(userId).collection("submissions").doc(submissionId);

    await submissionRef.update({
      feedback,
      updatedAt: Timestamp.now(),
    });
  } catch (error) {
    throw new AppError({
      message: `Failed to update submission feedback: ${error instanceof Error ? error.message : "Unknown error"}`,
      code: 500,
    });
  }
}
