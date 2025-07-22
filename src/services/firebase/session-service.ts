import { jwtVerify,SignJWT } from "jose";

import { env } from "@/lib/env";

import { apiDelete, apiGet, apiPost } from "@/services/api-utils";
import { GlobalResponse } from "@/services/type";

import { Session } from "./models/session";

export const signJWT = async (session: Session) => {
  const jwtToken = await new SignJWT(session)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(new TextEncoder().encode(env.JWT_SECRET));
  return jwtToken;
};

export const verifyJwt = async (authToken: string): Promise<Session | null> => {
  if (!authToken) {
    return null;
  }

  try {
    const decoded = await jwtVerify(authToken, new TextEncoder().encode(env.JWT_SECRET), { algorithms: ["HS256"] });
    return decoded.payload as Session;
  } catch (error) {
    console.log("Failed to verify");
    console.log(error);
    return null;
  }
};

// Get session
export const getSession = async (): Promise<GlobalResponse<Session> | undefined> => {
  return apiGet({
    endpoint: "/session",
  });
};

export const getSessionKey = () => ["get-session"];

// Craete session
export const createSession = async (idToken: string) => {
  await apiPost({
    endpoint: "/session",
    data: { idToken },
  });
};

// Delete session
export const deleteSession = async () => {
  await apiDelete({ endpoint: "/session" });
};
