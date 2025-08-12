import { Timestamp } from "firebase-admin/firestore";

import { db } from "@/lib/firebase/firebase-admin";
import { openai } from "@/lib/openai/openai";
import { getChartDataPrompt, getDetailFeedbackPrompt, getModelEssayPrompt, getScorePrompt } from "@/lib/prompts/utils";
import { convertFeedbackToPDFBuffer } from "@/lib/utils/convert-feedback-to-pdf";

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
    throw new Error("Request cancelled");
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
    throw new Error("Request cancelled");
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
          throw new Error("Request cancelled");
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
            throw new Error("Request cancelled");
          }

          const content = chunk.choices?.[0]?.delta?.content;
          if (content) {
            buffer += content;
            fullFeedback += content;
            chunkCount++;

            if (chunkCount >= 4) {
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
        // await streamOpenAI(getScoreParsePrompt({ score: scoreText }));
        // enqueue("\n\n\n");
        // fullFeedback += "\n\n\n";
        // await streamOpenAI(detailFeedbackPrompt);
        // enqueue("\n\n\n");
        // fullFeedback += "\n\n\n";
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

  const pdfBuffer = await convertFeedbackToPDFBuffer({
    feedbackText: submission.feedback,
    submissionId,
  });

  const uploadedFile = await uploadFileToStorage({
    file: pdfBuffer,
    folder: "feedback-pdfs",
    fileName: `${submissionId}.pdf`,
    contentType: "application/pdf",
    metadata: {
      submissionId,
    },
  });

  return uploadedFile;
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

// export async function convertFeedbackToPDF2(params: {
//   feedbackText: string;
//   submissionId: string;
//   fileName?: string;
// }): Promise<string> {
//   const { feedbackText, submissionId, fileName = "feedback" } = params;

//   try {
//     // Create a new PDF document
//     const doc = new PDFDocument({
//       size: "A4",
//       margins: {
//         top: 50,
//         bottom: 50,
//         left: 50,
//         right: 50,
//       },
//     });

//     // Collect PDF chunks
//     const chunks: Buffer[] = [];
//     doc.on("data", (chunk) => chunks.push(chunk));

//     // Add title
//     doc.fontSize(24).font("Helvetica-Bold").text("IELTS Writing Feedback", { align: "center" }).moveDown(2);

//     // Add submission ID
//     doc.fontSize(12).font("Helvetica").text(`Submission ID: ${submissionId}`).moveDown(1);

//     // Add timestamp
//     doc.text(`Generated on: ${new Date().toLocaleString()}`).moveDown(2);

//     // Add feedback content
//     doc.fontSize(14).font("Helvetica-Bold").text("Feedback Analysis").moveDown(1);

//     // Split feedback into paragraphs and add them
//     const paragraphs = feedbackText.split("\n\n").filter((p) => p.trim());

//     paragraphs.forEach((paragraph) => {
//       if (paragraph.trim()) {
//         // Check if it's a heading (starts with # or is all caps)
//         if (paragraph.startsWith("#") || paragraph.toUpperCase() === paragraph) {
//           doc
//             .fontSize(16)
//             .font("Helvetica-Bold")
//             .text(paragraph.replace(/^#+\s*/, ""))
//             .moveDown(0.5);
//         } else {
//           doc
//             .fontSize(12)
//             .font("Helvetica")
//             .text(paragraph, {
//               width: doc.page.width - 100,
//               align: "justify",
//             })
//             .moveDown(0.5);
//         }
//       }
//     });

//     // Finalize the PDF
//     doc.end();

//     // Wait for the PDF to be generated
//     return new Promise((resolve, reject) => {
//       doc.on("end", async () => {
//         try {
//           const pdfBuffer = Buffer.concat(chunks);

//           // Generate unique filename
//           const timestamp = Date.now();
//           const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9]/g, "_");
//           const pdfFileName = `${sanitizedFileName}_${submissionId}_${timestamp}.pdf`;

//           // Upload to Firebase Storage
//           const bucket = storage.bucket(env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
//           const file = bucket.file(`feedback-pdfs/${pdfFileName}`);

//           await file.save(pdfBuffer, {
//             metadata: {
//               contentType: "application/pdf",
//               metadata: {
//                 submissionId,
//                 generatedAt: new Date().toISOString(),
//                 originalFileName: fileName,
//               },
//             },
//           });

//           // Make the file publicly accessible and get the download URL
//           await file.makePublic();
//           const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;

//           resolve(publicUrl);
//         } catch (error) {
//           reject(
//             new AppError({
//               message: `Failed to upload PDF to Firebase: ${error instanceof Error ? error.message : "Unknown error"}`,
//               code: 500,
//             }),
//           );
//         }
//       });

//       doc.on("error", (error) => {
//         reject(
//           new AppError({
//             message: `Failed to generate PDF: ${error.message}`,
//             code: 500,
//           }),
//         );
//       });
//     });
//   } catch (error) {
//     throw new AppError({
//       message: `Failed to create PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
//       code: 500,
//     });
//   }
// }
