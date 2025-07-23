import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

export const inputVariants = cva(
  "flex justify-between gap-1 items-stretch h-9 w-full bg-inherit rounded-sm transition-colors disabled:opacity-50 [&_svg]:size-4 overflow-clip focus-within:border-primary",
  {
    variants: {
      error: {
        true: "border-destructive focus-within:border-destructive",
        false: "border-input",
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

export type InputProps = React.ComponentProps<"input"> & {
  error?: boolean;
  leftSection?: React.ReactNode;
  rightSection?: React.ReactNode;
  allowedRegex?: RegExp;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, name, leftSection, rightSection, disabled, allowedRegex, onChange, ...props }, ref) => {
    return (
      <div className={cn(inputVariants({ error: !!error }), className)}>
        <div className="flex flex-1 gap-1 items-stretch">
          {leftSection && <div className="flex justify-center items-center pl-2">{leftSection}</div>}
          <input
            name={name}
            className={cn(
              "flex-1 px-3 focus-visible:outline-none border-none bg-accent",
              "placeholder:text-muted-foreground/50 text-sm",
              "disabled:cursor-default",
              "peer w-full",
              error && "text-destructive",
              leftSection && "pl-1",
              rightSection && "pr-1",
            )}
            ref={ref}
            {...props}
            disabled={disabled}
            onChange={(e) => {
              if (allowedRegex && e.target.value) {
                if (!allowedRegex.test(e.target.value)) return;
              }
              onChange?.(e);
            }}
          />
        </div>
        {rightSection && (
          <div className="flex justify-center items-center min-w-10 px-2 bg-inherit">{rightSection}</div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
