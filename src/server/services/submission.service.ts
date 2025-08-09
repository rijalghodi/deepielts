import { openai } from "@/lib/openai/openai";
import {
  getChartDataPrompt,
  getDetailFeedbackPrompt,
  getModelEssayPrompt,
  getScoreParsePrompt,
  getScorePrompt,
} from "@/lib/prompts/utils";

import { QuestionType } from "@/server/models/submission";

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
  onComplete?: (fullFeedback: string) => Promise<void> | void;
}): ReadableStream<Uint8Array> {
  const { signal, scoreText, questionType, question, answer, attachmentInsight, onComplete } = params;

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

            if (chunkCount >= 10) {
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
