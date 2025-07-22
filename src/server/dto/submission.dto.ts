import { z } from "zod";

import { QuestionType, Submission } from "../models/submission";

export const createSubmissionBodySchema = z
  .object({
    answer: z.string().min(1, "Answer must be at least 1 characters"),
    question: z.string().min(1, "Question must be at least 1 characters"),
    attachments: z.array(z.string()).optional(),
    questionType: z.enum(QuestionType),
  })
  .refine(
    (data) => {
      if (data.questionType === QuestionType.Task1) {
        return data.attachments && data.attachments.length > 0;
      }
      return true;
    },
    {
      message: "Attachments are required for task 1",
      path: ["attachments"],
    },
  );

export type CreateSubmissionBody = z.infer<typeof createSubmissionBodySchema>;
export type GetSubmissionResult = Omit<Submission, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};
