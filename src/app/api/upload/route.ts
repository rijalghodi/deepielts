import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { storage } from "@/lib/firebase/firebase-admin";
import logger from "@/lib/logger";

import { handleError } from "@/server/services/interceptor";
import { compressImage } from "@/server/services/upload.service";

import { AppResponse } from "@/types";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = formData.get("folder") as string | null;

    if (!file) {
      return NextResponse.json({ error: "Missing 'file' in form data" }, { status: 400 });
    }

    const bucket = storage.bucket("gs://deep-ielts-7f8fa.firebasestorage.app");

    const originalName = (file as any).name || "file";
    const extFromName = originalName.includes(".") ? originalName.split(".").pop() : undefined;
    const extFromType = file.type ? file.type.split("/")[1] : undefined;
    const extension = (extFromName || extFromType || "bin").replace(/^\./, "");
    const baseName = originalName.replace(/\.[^/.]+$/, "");
    const uniqueFileName = `${baseName || "file"}_${uuidv4()}.${extension}`;

    // Compress image if it's an image file
    let buffer: Buffer;
    if (file.type.startsWith("image/")) {
      buffer = await compressImage(file, 1); // Compress to max 1MB
    } else {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }

    const path = folder ? `${folder}/${uniqueFileName}` : uniqueFileName;
    const newFile = bucket.file(path);

    await newFile.save(buffer, {
      contentType: file.type || "application/octet-stream",
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      newFile.name,
    )}?alt=media`;

    return NextResponse.json(
      new AppResponse({
        data: { url: publicUrl, name: uniqueFileName, path: newFile.name, folder },
      }),
    );
  } catch (error) {
    logger.error(error, "POST /upload");
    return handleError(error);
  }
}
