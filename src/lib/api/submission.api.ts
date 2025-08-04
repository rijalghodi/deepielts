import { CreateSubmissionBody, GetSubmissionResult } from "@/server/dto/submission.dto";
import { QuestionType, Submission } from "@/server/models/submission";

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

export const submissionList = async (q?: {
  questionType?: QuestionType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: string;
}): Promise<PaginatedResponse<GetSubmissionResult[]> | undefined> => {
  return apiGet<PaginatedResponse<GetSubmissionResult[]> | undefined>({
    endpoint: "/submissions",
    queryParams: {
      ...q,
    },
  });
};

export const submissionListKey = (practiceId?: string, userId?: string) => ["submission-list", practiceId, userId];
