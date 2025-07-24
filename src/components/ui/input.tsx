import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.ComponentProps<"input"> & {
  error?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  allowedRegex?: RegExp;
  size?: "lg" | "sm" | "default";
};

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
          // Layout & Sizing
          "flex w-full min-w-0 gap-1 rounded-md px-3 py-1",
          "data-[size=lg]:h-10 data-[size=sm]:h-8 data-[size=default]:h-9",
          "data-[size=lg]:text-base data-[size=sm]:text-sm data-[size=default]:text-sm",

          // Visuals
          "border border-border bg-transparent dark:bg-input shadow-xs transition-[color,box-shadow] outline-none",
          "placeholder:text-placeholder",

          // Focus & Error
          "focus-within:border-ring dark:focus-within:border dark:focus-within:bg-input/50",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          error && "text-destructive",

          // Disabled
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
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
