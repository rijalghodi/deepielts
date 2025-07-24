import { CreateSubmissionBody, GetSubmissionResult } from "@/server/dto/submission.dto";
import { Submission } from "@/server/models/submission";

import { apiGet, apiPost } from "./utils";
import { api } from "./axios";

import { ApiResponse, PaginatedResponse } from "@/types";

export const submissionCreate = async (
  userId: string,
  practiceId: string,
  req: CreateSubmissionBody,
): Promise<Submission | undefined> => {
  return apiPost({
    endpoint: `/submissions`,
    data: req,
    queryParams: { userId, practiceId },
  });
};

export const submissionGet = async (submissionId: string): Promise<ApiResponse<GetSubmissionResult> | undefined> => {
  return apiGet<ApiResponse<GetSubmissionResult> | undefined>({
    endpoint: `/submissions/${submissionId}`,
  });
};

export const submissionGetKey = (submissionId: string) => ["submission-get", submissionId];

/**
 * List all submissions. Filter by practice ID and user ID.
 */

export const submissionList = async (
  practiceId?: string,
  userId?: string,
): Promise<PaginatedResponse<GetSubmissionResult[]> | undefined> => {
  const params = new URLSearchParams();
  if (practiceId) params.append("practiceId", practiceId);
  if (userId) params.append("userId", userId);

  return apiGet<PaginatedResponse<GetSubmissionResult[]> | undefined>({
    endpoint: `/submissions?${params.toString()}`,
  });
};

export const submissionListKey = (practiceId?: string, userId?: string) => ["submission-list", practiceId, userId];

/**
 * Evaluate a submission.
 */
export const submissionEvaluate = async (submissionId: string) => {
  return apiPost<ApiResponse<any>>({
    endpoint: `/submissions/${submissionId}/evaluate`,
  });
};

export async function createSubmission(data: CreateSubmissionBody) {
  const res = await api.post("/submissions", data);
  return res.data;
}
