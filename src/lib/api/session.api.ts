import { Session } from "@/server/models/session";

import { apiDelete, apiGet, apiPost } from "./utils";

import { ApiResponse } from "@/types/global";

// Get session
export const getSession = async () => {
  return apiGet<ApiResponse<Session>>({
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
