import { apiPost } from "./utils";

// Send email code
export const sendEmailCode = async (email: string) => {
  return apiPost({
    endpoint: "/auth/send-code",
    data: { email },
  });
};

// Verify email code
export const verifyEmailCode = async (email: string, code: string) => {
  return apiPost({
    endpoint: "/auth/verify-code",
    data: { email, code },
  });
};
