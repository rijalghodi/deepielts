import { Timestamp } from "firebase-admin/firestore";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: Role;
  readonly createdAt?: Timestamp;
  readonly updatedAt?: Timestamp;
}

export enum Role {
  Admin = "admin",
  User = "user",
}
