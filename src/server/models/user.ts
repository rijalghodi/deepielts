import { Timestamp } from "firebase-admin/firestore";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: Role;
  settings?: UserSettings;
  readonly createdAt?: Timestamp;
  readonly updatedAt?: Timestamp;
}

export enum Role {
  Admin = "admin",
  User = "user",
}

export interface UserSettings {
  targetBandScore: string;
  testDate?: string; // ISO date string
  notifications?: boolean;
  language?: string;
}

export const DEFAULT_SETTINGS: UserSettings = {
  targetBandScore: "advanced",
  notifications: true,
  language: "en",
};
