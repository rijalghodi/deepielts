import { OpenAI } from "openai";

import { env } from "../env";
import { getPrompt } from "../prompts/utils";

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export async function aiScore(data: { question: string; answer: string }) {
  const prompt = getPrompt("score", {
    question: data.question,
    answer: data.answer,
  });

  return await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    stream: true,
    messages: [{ role: "system", content: prompt }],
  });
}
