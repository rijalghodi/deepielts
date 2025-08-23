import { ImageUp, Loader, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { uploadFile } from "@/lib/api";
import { cn } from "@/lib/utils";

import { ShimmeringBackground } from "./shimering-background";

export type InputImageProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value"> & {
  name?: string;
  label?: string;
  value?: string | null;
  error?: boolean;
  maxFileSizeMB?: number;
  onResetFile?: () => void;
  onChange?: (fileUrl?: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
  folder?: string;
  maxSizeMB?: number;
};

const ACCEPT_TYPES = "image/png,image/jpeg,image/jpg,image/svg+xml,image/webp";
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
      folder,
      maxSizeMB,
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
          folder,
          maxSizeMB,
        });

        const url = res?.data?.url;
        if (url) {
          onChange?.(url);
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
          "relative border rounded-md cursor-pointer flex justify-center items-center min-w-[180px] min-h-[116px] text-xs hover:bg-accent",
          error ? "border-destructive" : "border-border",
          isDragging && "border-primary bg-muted/50",
          disabled && "opacity-50",
          (disabled || readOnly) && "cursor-default",
        )}
        ref={ref as React.Ref<HTMLLabelElement>}
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
    if (isUploading) {
      return renderUploadLabel(
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          <Loader className="text-primary/90 h-7 w-7 animate-spin" />
          <span className="text-muted-foreground text-center">{`Uploading... ${uploadProgress}%`}</span>
        </div>,
      );
    }

    // Render empty file input
    if (!value) {
      return renderUploadLabel(
        <div className="flex flex-col items-center justify-center gap-3 p-4">
          <ImageUp className="text-primary/90 h-7 w-7" strokeWidth={1.5} />
          <span className="text-muted-foreground text-center">{placeholder}</span>
        </div>,
      );
    }

    // Render single file input with preview
    return renderUploadLabel(<ImagePreview url={value!} onRemove={handleRemove} onEdit={handleTriggerEdit} />);
  },
);

InputImage.displayName = "InputImage";

// Render preview
const ImagePreview = ({ url, onRemove, onEdit }: { url: string; onRemove: () => void; onEdit: () => void }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset loading state when URL changes
  useEffect(() => {
    setIsLoaded(false);
  }, [url]);

  return (
    <div className="relative group w-full h-full">
      <Image
        src={url}
        alt="Uploaded image"
        fill
        className="rounded-md object-cover"
        onLoad={() => {
          setIsLoaded(true);
        }}
      />
      {!isLoaded && <ShimmeringBackground />}
      {url && (
        <button
          onClick={onRemove}
          type="button"
          title="Remove image"
          className="absolute z-[2] top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
        </button>
      )}
      {url && (
        <button
          onClick={onEdit}
          type="button"
          title="Change image"
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center"
        >
          <span className="text-white text-sm">Click to change</span>
        </button>
      )}
    </div>
  );
};
