"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-0 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        glow: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-glowing",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        accent: "bg-accent border text-accent-foreground hover:bg-accent-hover",
        ghost: "hover:bg-accent hover:text-foreground",
        light: "bg-primary/10 text-primary hover:bg-primary/20",
        link: "text-foreground underline-offset-4 hover:underline",
        contrast:
          "text-white bg-neutral-800 hover:bg-neutral-700 dark:bg-neutral-100 dark:text-black dark:hover:bg-neutral-300",
      },
      size: {
        default: "h-9 px-3 text-sm [&_svg]:size-4",
        sm: "h-8 rounded-md px-3 text-xs rounded-sm [&_svg]:size-3.5",
        xs: "h-7 rounded-md px-2 text-xs rounded-sm [&_svg]:size-3",
        lg: "h-10 rounded-md px-4 text-base [&_svg]:size-4",
        xl: "h-11 rounded-md px-5 text-lg [&_svg]:size-5",
        icon: "h-9 w-9 [&_svg]:size-4",
        "icon-xl": "h-11 w-11 [&_svg]:size-5",
        "icon-lg": "h-10 w-10 [&_svg]:size-5",
        "icon-sm": "h-8 w-8 text-xs rounded-sm [&_svg]:size-4",
        "icon-xs": "h-7 w-7 text-[10px] rounded-sm [&_svg]:size-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading, type = "button", ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    if (loading) {
      return (
        <button disabled className={cn(buttonVariants({ variant, size }), className)} ref={ref} type={type} {...props}>
          <Loader className="animate-spin" />
        </button>
      );
    }
    return (
      <Comp className={cn(buttonVariants({ variant, size }), className)} ref={ref} type={type} {...props}>
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
