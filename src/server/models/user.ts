export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: Role;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export enum Role {
  Admin = "admin",
  User = "user",
}
