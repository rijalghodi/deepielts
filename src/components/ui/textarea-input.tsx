import React from "react";
import { Textarea } from "./textarea";
import { Label } from "./label";
import { cn } from "@/lib/utils";

type TextareaInputProps = {
  label?: string;
  caption?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
  variant?: "default" | "filled";
  name?: string;
};

export function TextareaInput({
  label,
  caption,
  error,
  value,
  onChange,
  variant = "default",
  name,
}: TextareaInputProps) {
  return (
    <div
      aria-invalid={!!error}
      className={cn(
        "space-y-1",
        "border border-border bg-transparent dark:bg-input shadow-xs transition-[color,box-shadow] outline-none",
        "focus-within:border-ring dark:focus-within:border dark:focus-within:bg-input/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        error && "text-destructive",
      )}
    >
      <Label htmlFor={name}>{label}</Label>
      <Textarea
        id={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(variant === "filled" && "bg-input")}
      />
      {(error || caption) && (
        <p className={cn("text-xs leading-none", error ? "text-destructive" : "text-foreground-secondary")}>
          {error ?? caption}
        </p>
      )}
    </div>
  );
}
