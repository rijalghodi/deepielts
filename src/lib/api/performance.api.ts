import { GetPerformanceQuery, GetPerformanceResult } from "@/server/dto/performance.dto";
import { ApiResponse } from "@/types";

import { apiGet } from "./utils";

export const performanceGet = async (
  q?: GetPerformanceQuery,
): Promise<ApiResponse<GetPerformanceResult> | undefined> => {
  return apiGet<ApiResponse<GetPerformanceResult>>({
    endpoint: `/performance`,
    queryParams: q ?? {},
  });
};

export const performanceGetKey = (q?: GetPerformanceQuery) => ["performance-get", q?.questionType ?? "all"];
