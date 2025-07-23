"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

// Sidebar root
export function Sidebar({ className, ...props }: React.ComponentProps<"aside">) {
  return <aside className={cn("bg-muted flex flex-col w-56 min-h-screen p-4", className)} {...props} />;
}

// Content area
export function SidebarContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex-1 flex flex-col gap-2", className)} {...props} />;
}

// Footer
export function SidebarFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mt-auto pt-4", className)} {...props} />;
}

// Group
export function SidebarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mb-4", className)} {...props} />;
}

// Group content
export function SidebarGroupContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex flex-col gap-1", className)} {...props} />;
}

// Menu item
export function SidebarMenuItem({ className, ...props }: React.ComponentProps<"li">) {
  return <li className={cn("list-none", className)} {...props} />;
}

// Menu button
export function SidebarMenuButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      className={cn("w-full text-left px-3 py-2 rounded hover:bg-accent focus:bg-accent transition-colors", className)}
      {...props}
    />
  );
}

// Separator
export function SidebarSeparator({ className, ...props }: React.ComponentProps<"hr">) {
  return <hr className={cn("my-2 border-t border-border", className)} {...props} />;
}
