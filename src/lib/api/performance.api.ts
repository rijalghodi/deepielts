import { GetPerformanceQuery, GetPerformanceResult } from "@/server/dto/performance.dto";

import { apiGet } from "./utils";

import { ApiResponse } from "@/types";

export const performanceGet = async (
  q?: GetPerformanceQuery,
): Promise<ApiResponse<GetPerformanceResult> | undefined> => {
  return apiGet<ApiResponse<GetPerformanceResult>>({
    endpoint: `/performance`,
    queryParams: q ?? {},
  });
};

export const performanceGetKey = (q?: GetPerformanceQuery) => ["performance-get", q?.questionType ?? "all"];
