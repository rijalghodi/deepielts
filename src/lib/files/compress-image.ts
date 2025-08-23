import imageCompression from "browser-image-compression";

export const compressImage = async (file: File, maxSizeMB = 1, setProgress?: (p: number) => void): Promise<File> => {
  // Only compress file PNG, JPEG, and WEBP
  const supportedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

  if (!supportedTypes.includes(file.type)) {
    throw new Error("Unsupported file type");
  }

  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: file.type ?? "image/jpg",
    onProgress: (progress: number) => {
      if (setProgress) setProgress(progress);
    },
  };

  const compressed = await imageCompression(file, options);
  return new File([compressed], file.name, { type: file.type });
};

// export async function compressImage(file: File, maxSizeMB = 1): Promise<File> {
//   const supportedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

//   if (!supportedTypes.includes(file.type)) {
//     throw new Error("Unsupported file type");
//   }
//   const img = document.createElement("img");
//   img.src = URL.createObjectURL(file);
//   await img.decode(); // Wait until loaded

//   const canvas = document.createElement("canvas");
//   const ctx = canvas.getContext("2d");

//   canvas.width = img.width;
//   canvas.height = img.height;
//   ctx?.drawImage(img, 0, 0);

//   return new Promise((resolve) => {
//     canvas.toBlob((blob) => resolve(new File([blob as Blob], file.name, { type: file.type })), "image/jpeg", maxSizeMB);
//   });
// }
