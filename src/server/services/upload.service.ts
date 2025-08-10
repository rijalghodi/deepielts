import sharp from "sharp";

import logger from "@/lib/logger";

export async function compressImage(file: File, maxSizeMB: number = 1): Promise<Buffer> {
  try {
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      throw new Error("File is not an image");
    }

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    // If file is already under the limit, return original
    if (file.size <= maxSizeBytes) {
      const arrayBuffer = await file.arrayBuffer();
      return Buffer.from(arrayBuffer);
    }

    // Convert file to buffer for sharp processing
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Compress image with quality adjustment
    let quality = 80; // Start with 80% quality
    let compressedBuffer: Buffer = buffer;

    while (compressedBuffer.length > maxSizeBytes && quality > 10) {
      compressedBuffer = await sharp(buffer).jpeg({ quality }).png({ quality }).webp({ quality }).toBuffer();

      quality -= 10; // Reduce quality if still too large
    }

    // If still too large after compression, resize the image
    if (compressedBuffer.length > maxSizeBytes) {
      compressedBuffer = await sharp(buffer)
        .resize(800, 600, { fit: "inside", withoutEnlargement: true })
        .jpeg({ quality: 70 })
        .toBuffer();
    }

    logger.info(`Image compressed from ${file.size} bytes to ${compressedBuffer.length} bytes`);
    return compressedBuffer;
  } catch (error) {
    logger.error(error, "Image compression failed");
    // Fallback to original file if compression fails
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
}
