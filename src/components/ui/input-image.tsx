import { ImageUp, Upload, X } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

import { uploadFile } from "@/lib/api";
import { cn } from "@/lib/utils";

export type InputImageProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  name?: string;
  label?: string;
  value?: string;
  error?: boolean;
  maxFileSizeMB?: number;
  onResetFile?: () => void;
  onChange?: (fileUrl?: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
};

const ACCEPT_TYPES = "image/png,image/jpeg,image/jpg,image/heic,.heic,image/svg+xml,image/webp";
const MAX_FILE_SIZE_MB = 10;

export const InputImage = React.forwardRef<HTMLInputElement, InputImageProps>(
  (
    {
      maxFileSizeMB = MAX_FILE_SIZE_MB,
      onChange,
      name,
      value,
      error,
      onResetFile,
      disabled,
      readOnly,
      placeholder = "Drag & drop image here, or click to select",
      ...props
    },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleDrop = async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0]; // Only take the first file

      // Validate file type
      const acceptTypes = ACCEPT_TYPES.split(",").map((t) => t.trim().toLowerCase());
      const extWithDot = file.name.split(".").pop()?.toLowerCase();
      const fileType = file.type.toLowerCase();

      const isAccepted = acceptTypes.includes(fileType) || (extWithDot && acceptTypes.includes(`.${extWithDot}`));

      if (!isAccepted) {
        toast.error("Only image files (PNG, JPEG, WEBP, SVG) are allowed.");
        return;
      }

      // Validate file size
      if (file.size / 1024 / 1024 > maxFileSizeMB) {
        toast.error(`File exceeds the ${maxFileSizeMB} MB limit.`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        const res = await uploadFile({
          file,
          onUploadProgress: (progress) => {
            setUploadProgress(Math.floor((progress.loaded / (progress.total || 1)) * 100));
          },
        });

        const fileUrl = res?.data?.name;
        if (fileUrl) {
          onChange?.(fileUrl);
        }
      } catch (err) {
        toast.error("Failed to upload image", { description: String((err as any)?.message) });
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleRemove = () => {
      onChange?.(undefined);
      onResetFile?.();
    };

    const handleTriggerEdit = () => {
      inputRef.current?.click();
    };

    const renderUploadLabel = (children: React.ReactNode) => (
      <label
        onClick={(e) => {
          if (disabled || readOnly) e.preventDefault();
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragEnter}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (disabled || readOnly) return;
          const files = Array.from(e.dataTransfer.files);
          handleDrop(files);
        }}
        className={cn(
          "relative border-2 border-dashed rounded-md cursor-pointer flex justify-center items-center aspect-[4/3] w-[180px] text-xs hover:bg-accent",
          error ? "border-destructive" : "border-border",
          isDragging && "border-primary bg-muted/50",
          disabled && "opacity-50",
          (disabled || readOnly) && "cursor-default",
        )}
      >
        <input
          {...props}
          ref={inputRef}
          type="file"
          accept={ACCEPT_TYPES}
          multiple={false}
          disabled={disabled || readOnly}
          onChange={async (e) => {
            const files = Array.from(e.target.files || []);
            await handleDrop(files);
            e.target.value = "";
          }}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {children}
      </label>
    );

    // Render empty file input
    if (!value && !isUploading) {
      return renderUploadLabel(
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          <ImageUp className="text-primary/90 h-7 w-7" strokeWidth={1.5} />
          <span className="text-muted-foreground text-center">{placeholder}</span>
        </div>,
      );
    }

    // Render preview
    const renderPreview = (url: string) => (
      <div className="relative group">
        <Image
          src={url}
          alt="Uploaded image"
          width={180}
          height={135}
          className="rounded-md object-cover w-full h-full"
        />
        {value && (
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="h-4 w-4" />
          </button>
        )}
        {value && (
          <button
            onClick={handleTriggerEdit}
            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center"
          >
            <span className="text-white text-sm">Click to change</span>
          </button>
        )}
      </div>
    );

    // Render uploading state
    if (isUploading) {
      return renderUploadLabel(
        <div className="flex flex-col items-center justify-center gap-2 p-4">
          <div className="relative">
            <Upload className="text-primary h-5 w-5 animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
          <span className="text-muted-foreground text-center">Uploading... {uploadProgress}%</span>
        </div>,
      );
    }

    // Render single file input with preview
    return renderUploadLabel(renderPreview(value!));
  },
);

InputImage.displayName = "InputImage";
