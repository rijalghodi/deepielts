"use client";

import { User } from "@/server/models";

import { apiGet, apiPost } from "./utils";
import { AUTH_CHANGED_KEY } from "../constants/brand";

import { ApiResponse } from "@/types";

// Send email code
export const requestEmailCode = async (email: string) => {
  return apiGet({
    endpoint: "/auth/code",
    queryParams: { email },
  });
};

// Verify email code
export const verifyEmailCode = async (email: string, code: string) => {
  return apiPost<ApiResponse<User>>({
    endpoint: "/auth/code",
    data: { email, code },
  });
};

// get current user
export const getCurrentUser = async () => {
  return apiGet<ApiResponse<User>>({
    endpoint: "/auth/me",
  });
};

// login by google
export const loginByGoogle = async (idToken: string) => {
  return apiPost<ApiResponse<User>>({
    endpoint: "/auth/google",
    data: { idToken },
  });
};

// refresh token
export const refreshToken = async () => {
  return apiPost<ApiResponse<User>>({
    endpoint: "/auth/refresh",
  });
};

// logout
export const logout = async () => {
  await apiPost({ endpoint: "/auth/logout" });
  localStorage.setItem(AUTH_CHANGED_KEY, Date.now().toString());
};
