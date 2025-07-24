import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import type { AxiosProgressEvent, GenericAbortSignal } from "axios";

import { toast } from "sonner";
import { ApiResponse } from "@/types";
import { apiGet, apiPost } from "@/lib/api";

export type UploadFileRequest = {
  file: File;
  type?: string;
  kind?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: GenericAbortSignal;
  is_convert?: boolean;
};

export type UploadFileResponse = ApiResponse<{
  name: string;
}>;

export const uploadFile = async ({
  file,
  onUploadProgress,
  signal,
  is_convert = false,
}: UploadFileRequest): Promise<UploadFileResponse | undefined> => {
  const data = new FormData();

  const isHeic = file.name.toLowerCase().endsWith(".heic");

  const mimeType = isHeic ? "image/heic" : file.type;
  const typedFile = new File([file], file.name, { type: mimeType });

  data.append("is_convert", is_convert ? "true" : "");
  data.append("file", typedFile);
  return apiPost<UploadFileResponse, UploadFileRequest>({
    endpoint: "/upload",
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
    signal,
  });
};

// Upload Hook

export const useUploadFile = (
  options?: UseMutationOptions<UploadFileResponse | undefined, Error, UploadFileRequest, unknown>,
) => {
  const { mutateAsync, isPending, error } = useMutation({
    mutationFn: uploadFile,
    onError: (error) => {
      toast.error("Failed to upload file", {
        description: error?.message,
      });
    },
    ...options,
  });

  return {
    uploadFile: mutateAsync,
    isPending,
    error,
  };
};

// Download File

export const getFile = async (filename: string) => {
  const response = await apiGet<ApiResponse<{ url: string }>>({
    endpoint: "/files",
    queryParams: {
      filename,
    },
  });
  return response?.data?.url || null;
};
