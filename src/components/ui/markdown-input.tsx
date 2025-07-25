import { MDXEditorMethods } from "@mdxeditor/editor";
import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Label } from "@/components/ui/label";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { ScrollArea } from "@/components/ui/scroll-area";

const inputVariants = cva("", {
  variants: {
    error: {
      true: "border-destructive",
      false: "border-input focus-within:border-ring",
    },
  },
  defaultVariants: {
    error: false,
  },
});

export type MarkdownInputProps = {
  label?: React.ReactNode;
  caption?: React.ReactNode;
  error?: string; // Allow passing a string as an error message
  name?: string;
  value?: string; // Controlled value
  onChange?: (value: string) => void; // Handle text change
  className?: string;
  maxHeight?: string | number;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
};

function MarkdownInput({
  label,
  caption,
  error,
  name,
  value,
  maxHeight,
  onChange,
  editorRef,
  className,
}: MarkdownInputProps) {
  console.log(value);
  return (
    <div className="space-y-1">
      {/* Label */}
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className={cn("border border-input rounded-md overflow-clip", inputVariants({ error: !!error }))}>
        <ScrollArea className="max-h-[200px]">
          <MarkdownEditor markdown={value} onChange={onChange} editorRef={editorRef} className={className} />
        </ScrollArea>
      </div>
      {(error || caption) && (
        <p className={cn("text-xs leading-none", error ? "text-destructive" : "text-foreground-secondary")}>
          {error ?? caption}
        </p>
      )}
    </div>
  );
}

MarkdownInput.displayName = "MarkdownInput";

export { MarkdownInput };
