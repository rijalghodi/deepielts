"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

import { Checkbox } from "./checkbox";

type PillGroupProps = {
  value: string[];
  onValueChange: (value: string[]) => void;
  children: React.ReactNode;
  className?: string;
};

type PillGroupItemProps = Omit<React.ComponentPropsWithoutRef<typeof Checkbox>, "checked" | "onCheckedChange"> & {
  value: string;
};

const PillGroupContext = React.createContext<{
  value: string[];
  onValueChange: (value: string[]) => void;
} | null>(null);

const PillGroup = React.forwardRef<HTMLDivElement, PillGroupProps>(
  ({ value, onValueChange, children, className, ...props }, ref) => {
    return (
      <PillGroupContext.Provider value={{ value, onValueChange }}>
        <div ref={ref} className={cn("grid gap-2", className)} {...props}>
          {children}
        </div>
      </PillGroupContext.Provider>
    );
  },
);
PillGroup.displayName = "PillGroup";

const PillGroupItem = React.forwardRef<React.ElementRef<typeof Checkbox>, PillGroupItemProps>(
  ({ className, value, ...props }, ref) => {
    const context = React.useContext(PillGroupContext);
    if (!context) {
      throw new Error("PillGroupItem must be used within a PillGroup");
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
PillGroupItem.displayName = "PillGroupItem";

export { PillGroup, PillGroupItem };
