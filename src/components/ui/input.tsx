import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> & {
  error?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  allowedRegex?: RegExp;
  size?: "lg" | "sm" | "default";
};

export const inputVariants = cva(
  cn(
    // Padding
    "px-3 py-2 rounded-md min-w-0",

    // Border
    "border border-border shadow-xs outline-none",

    // Background
    "bg-transparent dark:bg-muted",

    // Placeholder
    "placeholder:text-muted-foreground/60",

    // Focus
    // "focus-within:border-ring/50 focus-within:ring-1 focus-within:ring-ring/40",

    // Error
    "aria-invalid:border-destructive aria-invalid:ring-destructive/70 dark:aria-invalid:ring-destructive/70",

    // Disabled
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
  ),
  {
    variants: {
      focusStyle: {
        none: "focus-within:border-border focus-within:ring-0",
        default: "focus-within:border-ring data-[state=open]:border-ring",
      },
    },
    defaultVariants: {
      focusStyle: "default",
    },
  },
);

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, error, name, leftSection, rightSection, disabled, allowedRegex, onChange, size = "default", ...props },
    ref,
  ) => {
    return (
      <div
        data-size={size}
        aria-invalid={error}
        className={cn(
          // Layout
          "flex w-full gap-1",

          // Sizing
          "data-[size=lg]:h-10 data-[size=sm]:h-8 data-[size=default]:h-9",
          "data-[size=lg]:text-base data-[size=sm]:text-sm data-[size=default]:text-sm",

          inputVariants(),
        )}
      >
        {leftSection && <div className="flex items-center justify-center pl-2">{leftSection}</div>}

        <input
          ref={ref}
          name={name}
          disabled={disabled}
          onChange={(e) => {
            if (allowedRegex && e.target.value && !allowedRegex.test(e.target.value)) return;
            onChange?.(e);
          }}
          className={cn(
            "flex-1 bg-transparent",
            "placeholder:text-placeholder",
            "focus-visible:outline-none focus-visible:ring-0",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            error && "text-destructive",
            leftSection && "pl-1",
            rightSection && "pr-1",
            className,
          )}
          {...props}
        />

        {rightSection && (
          <div className="flex items-center justify-center min-w-10 px-2 bg-inherit">{rightSection}</div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
export { Input };
