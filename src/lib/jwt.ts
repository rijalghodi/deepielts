import { jwtVerify, SignJWT } from "jose";

import { env } from "./env";

const ACCESS_SECRET = new TextEncoder().encode(env.JWT_ACCESS_SECRET!);
const REFRESH_SECRET = new TextEncoder().encode(env.JWT_REFRESH_SECRET!);

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

export const signAccessToken = async (payload: JwtPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_ACCESS_EXPIRES_IN!) // e.g., "1h"
    .sign(ACCESS_SECRET);
};

export const verifyAccessToken = async (token: string): Promise<JwtDecode> => {
  const { payload } = await jwtVerify(token, ACCESS_SECRET, {
    algorithms: ["HS256"],
  });
  return payload as JwtDecode;
};

export const signRefreshToken = async (payload: JwtPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(env.JWT_REFRESH_EXPIRES_IN!) // e.g., "60d"
    .sign(REFRESH_SECRET);
};

export const verifyRefreshToken = async (token: string): Promise<JwtDecode> => {
  const { payload } = await jwtVerify(token, REFRESH_SECRET, {
    algorithms: ["HS256"],
  });
  return payload as JwtDecode;
};
