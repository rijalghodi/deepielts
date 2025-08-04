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
  Task1Academic = "task1Academic",
  Task1General = "task1General",
  Task2 = "task2",
}

export type IELTSAnalysis = {
  score: {
    totalScore: number;
    scores: {
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
  subCriteria: Record<string, number>;
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
