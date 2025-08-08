"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle({ variant = "dropdown" }: { variant?: "dropdown" | "horizontal" }) {
  const [mounted, setMounted] = useState(false);
  const { setTheme, theme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  if (variant === "dropdown") {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon-sm">
            <Sun className={cn("absolute transition-all scale-0", theme === "light" && "scale-100")} />
            <Moon className={cn("absolute transition-all scale-0", theme === "dark" && "scale-100")} />
            <Monitor className={cn("absolutetransition-all scale-0", theme === "system" && "scale-100")} />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs">
            <Sun className="mr-2 h-3.5 w-3.5" />
            <span className="text-xs">Light</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs">
            <Moon className="mr-2 h-3.5 w-3.5" />
            <span>Dark</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs">
            <Monitor className="mr-2 h-3.5 w-3.5" />
            <span>System</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  if (variant === "horizontal") {
    return (
      <div className="flex items-center px-1 py-1 rounded-sm bg-muted dark:bg-background">
        <Button
          variant="ghost"
          className={cn(
            theme === "light" && "shadow-sm bg-background hover:bg-background dark:bg-accent dark:hover:bg-accent",
          )}
          size="icon-sm"
          onClick={() => setTheme("light")}
        >
          <Sun />
          <span className="sr-only">Light</span>
        </Button>

        <Button
          variant={theme === "dark" ? "accent" : "ghost"}
          className={cn(
            theme === "dark" && "shadow-sm bg-background hover:bg-background dark:bg-accent dark:hover:bg-accent",
          )}
          size="icon-sm"
          onClick={() => setTheme("dark")}
        >
          <Moon />
          <span className="sr-only">Dark</span>
        </Button>

        <Button
          variant={theme === "system" ? "accent" : "ghost"}
          className={cn(
            theme === "system" && "shadow-sm bg-background hover:bg-background dark:bg-accent dark:hover:bg-accent",
          )}
          size="icon-sm"
          onClick={() => setTheme("system")}
        >
          <Monitor />
          <span className="sr-only">System</span>
        </Button>
      </div>
    );
  }
}
