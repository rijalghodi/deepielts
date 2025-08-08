import { z } from "zod";

import { QuestionType, Submission } from "../models/submission";

export const createSubmissionBodySchema = z.object({
  answer: z.string().min(1, "Answer must be at least 1 characters"),
  question: z.string().min(1, "Question must be at least 1 characters"),
  attachment: z.string().optional(),
  questionType: z.enum(Object.values(QuestionType) as [string, ...string[]]),
});
// .refine(
//   (data) => {
//     if (data.questionType === QuestionType.TASK_1_ACADEMIC) {
//       return data.attachment;
//     }
//     return true;
//   },
//   {
//     message: "Attachments are required for task 1",
//     path: ["attachments"],
//   },
// );

export type CreateSubmissionBody = z.infer<typeof createSubmissionBodySchema>;
export type GetSubmissionResult = Omit<Submission, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};
