import { Timestamp } from "firebase-admin/firestore";

import { User } from "./user";

export interface Submission {
  id: string;
  userId?: string;
  answer?: string;
  question?: string;
  attachments?: string;
  questionType?: QuestionType;
  analysis?: IELTSAnalysis;
  readonly createdAt?: Timestamp;
  readonly updatedAt?: Timestamp;
  readonly deletedAt?: Timestamp;
  user?: User;
}

export enum QuestionType {
  Task1Academic = "task-1-academic",
  Task1General = "task-1-general",
  Task2 = "task-2",
}

export type IELTSAnalysis = {
  score: {
    totalScore: number;
    detail: {
      tr: CriteriaScore;
      cc: CriteriaScore;
      lr: CriteriaScore;
      gra: CriteriaScore;
    };
  };
  feedback: FeedbackEntry[];
};

type CriteriaScore = {
  score: number;
  comment: string;
  criteria: Record<string, number>;
};

type FeedbackEntry = {
  comments: {
    tr: string;
    cc: string;
    lr: string;
    gra: string;
  };
  rewrite: string;
  original: string;
};
