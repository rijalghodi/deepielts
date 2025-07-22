import { Timestamp } from "firebase-admin/firestore";

import { User } from "./user";

export interface Evaluation {
  comment?: string;
  revised?: string;
  original?: string;
}

export interface Submission {
  id: string;
  practiceId?: string;
  userId?: string;
  answer?: string;
  question?: string;
  attachments?: string[];
  questionType?: QuestionType;
  evaluation?: Evaluation;
  readonly createdAt?: Timestamp;
  readonly updatedAt?: Timestamp;
  readonly deletedAt?: Timestamp;

  user?: User;
}

export enum QuestionType {
  Task1 = "task_1",
  Task2 = "task_2",
}
