export interface UploadedFile {
  url: string;
  originalFileName?: string;
  path?: string;
  folder?: string;
  metadata?: Record<string, string>;
}
