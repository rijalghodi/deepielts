import jwt from "jsonwebtoken";

import { env } from "./env";

const ACCESS_SECRET = env.JWT_ACCESS_SECRET!;
const REFRESH_SECRET = env.JWT_REFRESH_SECRET!;

export type JwtPayload = {
  uid: string;
  email: string;
  name: string;
  role: string;
  isVerified: boolean;
};

export type JwtDecode = JwtPayload & {
  exp: number;
  iat: number;
};

export const signAccessToken = (payload: JwtPayload) =>
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: env.NEXT_PUBLIC_JWT_ACCESS_EXPIRES_IN as any });

export const verifyAccessToken = (token: string) => jwt.verify(token, ACCESS_SECRET) as JwtDecode;

export const signRefreshToken = (payload: JwtPayload) =>
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: env.NEXT_PUBLIC_JWT_REFRESH_EXPIRES_IN as any });

export const verifyRefreshToken = (token: string) => jwt.verify(token, REFRESH_SECRET) as JwtDecode;
