import { Timestamp } from "firebase-admin/firestore";

import { User } from "./user";

export interface Submission {
  id: string;
  userId?: string;
  answer?: string;
  question?: string;
  attachments?: string[];
  questionType?: QuestionType;
  readonly createdAt?: Timestamp;
  readonly updatedAt?: Timestamp;
  readonly deletedAt?: Timestamp;

  user?: User;
}

export enum QuestionType {
  Task1 = "task_1",
  Task2 = "task_2",
}
