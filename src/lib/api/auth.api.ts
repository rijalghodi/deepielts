"use client";

import { User } from "@/server/models";
import { ApiResponse } from "@/types";

import { AUTH_CHANGED_KEY } from "../constants/brand";
import { Subscription } from "./billing.api";
import { apiDelete, apiGet, apiPost, apiPut } from "./utils";

export const AUTH_ME_QUERY_KEY = ["auth-me"] as const;

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
  return apiGet<ApiResponse<User & { subscription: Subscription }>>({
    endpoint: "/auth/me",
  });
};

export const GET_CURRENT_USER_QUERY_KEY = ["get-current-user"] as const;

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

export const useLogout = () => {
  const logout = async () => {
    await apiPost({ endpoint: "/auth/logout" });
    localStorage.setItem(AUTH_CHANGED_KEY, Date.now().toString());
    window.location.href = "/";
  };
  return { logout };
};

export const updateUser = async (data: { name: string }) => {
  return apiPut<ApiResponse<User>>({
    endpoint: "/auth/me",
    data,
  });
};

export const deleteUserAccount = async () => {
  return apiDelete<ApiResponse<User>>({
    endpoint: "/auth/delete-account",
  });
};
