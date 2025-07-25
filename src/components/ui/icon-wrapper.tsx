import React from "react";

import { cn } from "@/lib/utils";

export function IconWrapper({
  children,
  className,
  size = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: "default" | "lg" | "sm" }) {
  return (
    <div
      className={cn(
        "flex justify-center items-center rounded-full",
        "[&[data-size='default']]:w-6 [&[data-size='default']]:h-6 [&[data-size='default']]:[&_svg]:size-4",
        "[&[data-size='sm']]:w-5 [&[data-size='sm']]:h-5 [&[data-size='sm']]:[&_svg]:size-3.5",
        "[&[data-size='lg']]:w-8 [&[data-size='lg']]:h-8 [&[data-size='lg']]:[&_svg]:size-5",
        className,
      )}
      data-size={size}
      {...props}
    >
      {children}
    </div>
  );
}
