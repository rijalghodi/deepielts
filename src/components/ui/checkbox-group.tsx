"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Checkbox } from "./checkbox";

type CheckboxGroupProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
};

type CheckboxGroupItemProps = Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, "checked" | "onCheckedChange"> & {
  value: string;
};

const CheckboxGroupContext = React.createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
} | null>(null);

const CheckboxGroup = React.forwardRef<HTMLDivElement, CheckboxGroupProps>(
  ({ value, onValueChange, children, className, ...props }, ref) => {
    return (
      <CheckboxGroupContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </CheckboxGroupContext.Provider>
    );
  },
);
CheckboxGroup.displayName = "CheckboxGroup";

const CheckboxGroupItem = React.forwardRef<React.ElementRef<typeof Checkbox>, CheckboxGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(CheckboxGroupContext);
    if (!context) {
      throw new Error("CheckboxGroupItem must be used within a CheckboxGroup");
    }
    const checked = context.value.includes(value);
    const handleCheckedChange = (checked: boolean) => {
      if (checked) {
        context.onValueChange([...context.value, value]);
      } else {
        context.onValueChange(context.value.filter((v) => v !== value));
      }
    };
    return (
      <div className={cn("flex flex-row items-center gap-2 text-sm", className)}>
        <Checkbox ref={ref} checked={checked} onCheckedChange={handleCheckedChange} {...props} />
        <span>{props.children}</span>
      </div>
    );
  },
);
CheckboxGroupItem.displayName = "CheckboxGroupItem";

export { CheckboxGroup, CheckboxGroupItem };
