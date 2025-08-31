export interface UploadedFile {
  url: string;
  originalFileName?: string;
  path?: string;
  metadata?: Record<string, string>;
}
