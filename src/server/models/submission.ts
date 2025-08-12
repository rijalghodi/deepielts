import { Timestamp } from "firebase-admin/firestore";

import { User } from "./user";

export interface Submission {
  id: string;
  answer?: string;
  question?: string;
  attachment?: string;
  questionType?: QuestionType;
  score?: IELTSScore;
  feedback?: string;
  pdfUrl?: string;
  readonly createdAt?: Timestamp;
  readonly updatedAt?: Timestamp;
  readonly deletedAt?: Timestamp;
  user?: User;
}

export enum QuestionType {
  TASK_1_ACADEMIC = "task-1-academic",
  TASK_1_GENERAL = "task-1-general",
  TASK_2 = "task-2",
}

export type IELTSScore = {
  OVR: number;
  "PC-1": number;
  "PC-2": number;
  "PC-3": number;
  TR: number;
  "TR-0": number;
  "TR-1": number;
  "TR-2": number;
  "TR-3": number;
  CC: number;
  "CC-0": number;
  "CC-1": number;
  "CC-2": number;
  "CC-3": number;
  "CC-4": number;
  "CC-5": number;
  LR: number;
  "LR-0": number;
  "LR-1": number;
  "LR-2": number;
  "LR-3": number;
  GRA: number;
  "GRA-0": number;
  "GRA-1": number;
  "GRA-2": number;
  "GRA-3": number;
};
