import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  cn(
    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    "[&[data-size='lg']]:px-3 [&[data-size='lg']]:py-1 [&[data-size='lg']]:text-sm",
  ),
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        light: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "",
        "outline-light": "text-primary hover:bg-primary/20 border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  size?: "default" | "lg";
}

function Badge({ className, variant, size = "default", ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} data-size={size} {...props} />;
}

export { Badge, badgeVariants };
