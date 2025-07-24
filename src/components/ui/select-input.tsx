"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import * as React from "react";
import { Input } from "./input";

interface SelectInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  options?: Array<{ label: string; value: string } | string>;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: boolean;
}

const SelectInput = React.forwardRef<HTMLButtonElement, SelectInputProps>(
  ({ value, onChange, placeholder, options = [], disabled, readOnly, error, ...props }, ref) => {
    if (readOnly) {
      const valueObj = options.find((option) =>
        typeof option === "string" ? option === value : option.value === value,
      );
      const valueLabel = typeof valueObj === "string" ? valueObj : valueObj?.label;

      return (
        <Input
          value={valueLabel}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          error={error}
          {...props}
        />
      );
    }

    return (
      <Select
        value={value}
        onValueChange={(currentValue) => {
          onChange?.(currentValue === value ? "" : currentValue);
        }}
        {...props}
      >
        <SelectTrigger ref={ref} disabled={disabled} className={cn(error && "border-destructive")}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option, index) => {
            const label = typeof option === "string" ? option : option.label;
            const value = typeof option === "string" ? option : option.value;
            return (
              <SelectItem key={index} value={value}>
                {label}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    );
  },
);

SelectInput.displayName = "SelectInput";

export { SelectInput };
export type { SelectInputProps };
