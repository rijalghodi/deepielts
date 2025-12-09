import Cookies from "js-cookie";

import { ACCESS_TOKEN_KEY } from "@/lib/constants";

import { CreateSubmissionBody, GetSubmissionResult } from "@/server/dto/submission.dto";
import { Submission } from "@/server/models/submission";
import { UploadedFile } from "@/server/models/upload";

import { apiGet, apiPost } from "./utils";

import { ApiResponse, PaginatedResponse } from "@/types";

export const submissionCreate = async (req: CreateSubmissionBody): Promise<ApiResponse<Submission> | undefined> => {
  return apiPost({
    endpoint: `/submissions`,
    data: req,
  });
};

// New streaming submission function
export const submissionCreateStream = async (
  req: CreateSubmissionBody,
  signal?: AbortSignal,
): Promise<ReadableStream<Uint8Array> | null> => {
  try {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("/api/submissions", {
      method: "POST",
      headers,
      body: JSON.stringify(req),
      signal, // Pass the AbortSignal to the fetch request
    });

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    return response.body;
  } catch (error) {
    console.error("Error creating streaming submission:", error);
    throw error;
  }
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
  questionTypes?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<GetSubmissionResult[]> | undefined> => {
  return apiGet<PaginatedResponse<GetSubmissionResult[]> | undefined>({
    endpoint: "/submissions",
    queryParams: {
      ...q,
    },
  });
};

export const submissionListKey = () => ["submission-list"];

/**
 * Generate PDF from submission feedback
 */
// export const submissionGeneratePDF = async (submissionId: string): Promise<ApiResponse<UploadedFile> | undefined> => {
//   return apiPost({
//     endpoint: `/submissions/${submissionId}/pdf`,
//     pathParams: { submissionId },
//   });
// };

export const submissionGeneratePDF = async (submissionId: string): Promise<ApiResponse<UploadedFile> | undefined> => {
  return apiPost({
    endpoint: `/submissions/${submissionId}/pdf`,
    pathParams: { submissionId },
  });
};

/**
 * Generate DOCX from markdown text
 */
export const submissionGenerateDOCX = async (markdown: string): Promise<Blob> => {
  try {
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch("/api/converts/md-docx", {
      method: "POST",
      headers,
      body: JSON.stringify({ markdown }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw data;
    }

    return await response.blob();
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw error;
  }
};
