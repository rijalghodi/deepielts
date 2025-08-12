import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosProgressEvent, GenericAbortSignal } from "axios";
import { toast } from "sonner";

import { apiGet, apiPost } from "@/lib/api";

import { compressImage } from "../utils/compress-image";

import { ApiResponse } from "@/types";

export type UploadFileRequest = {
  file: File;
  type?: string;
  kind?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  signal?: GenericAbortSignal;
  folder?: string;
  maxSizeMB?: number;
};

export type UploadFileResponse = ApiResponse<{
  url: string;
  name: string;
  path: string;
  folder: string;
}>;

export const uploadFile = async ({
  file,
  onUploadProgress,
  signal,
  folder,
  maxSizeMB = 1,
}: UploadFileRequest): Promise<UploadFileResponse | undefined> => {
  const data = new FormData();

  // Compress image if it's an image
  if (file.type.startsWith("image/")) {
    file = await compressImage(file, maxSizeMB);
    data.append("file", file);
  } else {
    data.append("file", file);
  }

  if (folder) {
    data.append("folder", folder);
  }

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
