import { z } from "zod";

import { QuestionType } from "../models/submission";

export const getPerformanceQuerySchema = z.object({
  questionType: z.enum(Object.values(QuestionType) as [string, ...string[]]).optional(),
});

export type GetPerformanceQuery = z.infer<typeof getPerformanceQuerySchema>;

export type PerformanceScore = {
  date: string | null;
  OVR: number;
  TR: number;
  CC: number;
  LR: number;
  GRA: number;
};

export type GetPerformanceResult = {
  count: number;
  lastScore: PerformanceScore;
  highestScore: PerformanceScore;
  scoreTimeline: PerformanceScore[];
};
