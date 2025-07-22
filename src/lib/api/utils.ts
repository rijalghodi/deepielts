import type { AxiosProgressEvent, GenericAbortSignal } from "axios";

import { api } from "@/lib/api/axios";

// Utility function to build query strings
const buildQueryString = (params: Record<string, string | number | boolean>) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.append(key, value.toString());
    }
  }
  return searchParams.toString();
};

// Utility function to build path with dynamic parameters
const buildPathWithParams = (endpoint: string, pathParams?: Record<string, string | number>) => {
  if (!pathParams) return endpoint;
  return Object.entries(pathParams).reduce((path, [key, value]) => {
    return path.replace(`:${key}`, encodeURIComponent(value.toString()));
  }, endpoint);
};

type APIRequest<Q = Record<string, any>, P = Record<string, any>> = {
  endpoint: string; // Base endpoint
  pathParams?: P; // Parameters in the path (e.g., /user/:id)
  queryParams?: Q; // Query parameters (e.g., ?filter=active)
  data?: any; // Body payload for POST/PUT
  headers?: Record<string, any>; // Headers
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: GenericAbortSignal;
};

// Generic API Method
const apiRequest = async <T, Q = Record<string, any>, P = Record<string, any>>(
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  { endpoint, pathParams, queryParams, data, headers, onUploadProgress, signal }: APIRequest<Q, P>,
): Promise<T | undefined> => {
  const path = buildPathWithParams(endpoint, pathParams as any);
  const queryString = queryParams ? `?${buildQueryString(queryParams)}` : "";

  const url = `${path}${queryString}`;

  try {
    const response = await api?.request<T>({
      method,
      url,
      data, // For POST/PUT methods
      headers,
      onUploadProgress,
      signal,
    });

    return response?.data;
  } catch (error) {
    throw (error as any)?.response?.data;
  }
};

// API method wrappers
export const apiGet = async <T, Q = Record<string, any>, P = Record<string, any>>(
  req: APIRequest<Q, P>,
): Promise<T | undefined> => apiRequest<T, Q, P>("GET", req);

export const apiPost = async <T, Q = Record<string, any>, P = Record<string, any>>(
  req: APIRequest<Q, P>,
): Promise<T | undefined> => apiRequest<T, Q, P>("POST", req);

export const apiPut = async <T, Q = Record<string, any>, P = Record<string, any>>(
  req: APIRequest<Q, P>,
): Promise<T | undefined> => apiRequest<T, Q, P>("PUT", req);

export const apiPatch = async <T, Q = Record<string, any>, P = Record<string, any>>(
  req: APIRequest<Q, P>,
): Promise<T | undefined> => apiRequest<T, Q, P>("PATCH", req);

export const apiDelete = async <T, Q = Record<string, any>, P = Record<string, any>>(
  req: APIRequest<Q, P>,
): Promise<T | undefined> => apiRequest<T, Q, P>("DELETE", req);
