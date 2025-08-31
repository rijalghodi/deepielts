import { v4 as uuidv4 } from "uuid";

import { GUEST_USER_ID } from "@/lib/constants/database";
import { storage } from "@/lib/firebase";

import { UploadedFile } from "../models/upload";

export async function uploadFileToStorage(params: {
  userId?: string;
  file: Buffer;
  folder?: string;
  fileName?: string;
  contentType?: string;
  metadata?: Record<string, string>;
}): Promise<UploadedFile> {
  const { userId, file, folder, fileName, contentType, metadata } = params;

  const resolvedUserId = userId || GUEST_USER_ID;

  const bucket = storage.bucket("gs://deep-ielts-7f8fa.firebasestorage.app");

  const originalName = fileName || "file";
  const extFromName = originalName.includes(".") ? originalName.split(".").pop() : undefined;
  const extFromType = contentType ? contentType.split("/")[1] : undefined;
  const extension = (extFromName || extFromType || "bin").replace(/^\./, "");
  const baseName = originalName.replace(/\.[^/.]+$/, "");
  const uniqueFileName = `${baseName || "file"}_${uuidv4()}.${extension}`;

  const path = folder ? `${resolvedUserId}/${folder}/${uniqueFileName}` : uniqueFileName;
  const newFile = bucket.file(path);

  await newFile.save(file, {
    contentType: contentType || "application/octet-stream",
    metadata: {
      firebaseStorageDownloadTokens: uuidv4(),
      ...metadata,
    },
  });

  const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
    newFile.name,
  )}?alt=media`;

  return {
    url: publicUrl,
    originalFileName: fileName || "",
    path: newFile.name,
    folder,
  };
}

// export async function compressImage(file: File, maxSizeMB: number = 1): Promise<Buffer> {
//   try {
//     // Check if file is an image
//     if (!file.type.startsWith("image/")) {
//       throw new Error("File is not an image");
//     }

//     const maxSizeBytes = maxSizeMB * 1024 * 1024;

//     // If file is already under the limit, return original
//     if (file.size <= maxSizeBytes) {
//       const arrayBuffer = await file.arrayBuffer();
//       return Buffer.from(arrayBuffer);
//     }

//     // Convert file to buffer for sharp processing
//     const arrayBuffer = await file.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);

//     // Compress image with quality adjustment
//     let quality = 80; // Start with 80% quality
//     let compressedBuffer: Buffer = buffer;

//     while (compressedBuffer.length > maxSizeBytes && quality > 10) {
//       compressedBuffer = await sharp(buffer).jpeg({ quality }).png({ quality }).webp({ quality }).toBuffer();

//       quality -= 10; // Reduce quality if still too large
//     }

//     // If still too large after compression, resize the image
//     if (compressedBuffer.length > maxSizeBytes) {
//       compressedBuffer = await sharp(buffer)
//         .resize(800, 600, { fit: "inside", withoutEnlargement: true })
//         .jpeg({ quality: 70 })
//         .toBuffer();
//     }

//     return compressedBuffer;
//   } catch (error) {
//     logger.error(error, "Image compression failed");
//     // Fallback to original file if compression fails
//     const arrayBuffer = await file.arrayBuffer();
//     return Buffer.from(arrayBuffer);
//   }
// }
