import { getStorage } from "firebase-admin/storage";

export async function getSignedImageUrl(path: string) {
  const bucket = getStorage().bucket();

  if (!bucket) {
    throw new Error("Bucket not found");
  }

  const file = bucket.file(path);

  if (!file) {
    throw new Error("File not found");
  }

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 60 * 60 * 1000, // valid 1 hour
  });

  return url;
}
