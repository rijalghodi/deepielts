import { CreateSubmissionBody, GetSubmissionResult } from "@/server/dto/submission.dto";
import { Submission } from "@/server/models/submission";

import { apiGet, apiPost } from "./utils";

import { ApiResponse, PaginatedResponse } from "@/types";

export const submissionCreate = async (req: CreateSubmissionBody): Promise<ApiResponse<Submission> | undefined> => {
  return apiPost({
    endpoint: `/submissions`,
    data: req,
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
