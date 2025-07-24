import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  minRows?: number;
  maxRows?: number;
  plainStyle?: boolean;
  preventResize?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, plainStyle, minRows = 1, maxRows = 10, rows = 1, preventResize, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge external and internal refs
    const textareaRef = React.useCallback(
      (node: HTMLTextAreaElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref],
    );

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current;
      if (!textarea) return;

      const computed = getComputedStyle(textarea);
      const lineHeight = parseFloat(computed.lineHeight || "20"); // Fallback if lineHeight is not a number

      console.log(lineHeight);
      const paddingTop = parseFloat(computed.paddingTop || "0");
      const paddingBottom = parseFloat(computed.paddingBottom || "0");

      textarea.style.height = "auto";
      const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
      const maxHeight = maxRows ? lineHeight * maxRows + paddingTop + paddingBottom : Infinity;

      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [minRows, maxRows, preventResize]);

    React.useEffect(() => {
      adjustHeight();
    }, [props.value, adjustHeight]);

    React.useEffect(() => {
      adjustHeight();
    }, [props.value, adjustHeight]);

    if (plainStyle) {
      // Only return a plain textarea, no styles or extra props except ref, className, and the rest
      return (
        <textarea
          ref={textareaRef}
          className={cn("text-sm outline-none max-h-40", preventResize && "resize-none", className)}
          rows={rows || minRows}
          onInput={adjustHeight}
          {...props}
        />
      );
    }

    return (
      <textarea
        ref={textareaRef}
        data-slot="textarea"
        aria-invalid={props["aria-invalid"]}
        className={cn(
          preventResize && "resize-none",
          // Layout & Sizing
          "w-full min-w-0 rounded-md px-3 py-2 min-h-16",

          // Typography
          "text-sm",

          // Visuals
          "border border-border bg-transparent dark:bg-input shadow-xs transition-[color,box-shadow] outline-none",
          "placeholder:text-muted-foreground",

          // Focus & Error
          "focus-visible:border-ring dark:focus-visible:border dark:focus-visible:bg-muted",
          "aria-invalid:border-destructive",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",

          // Disabled
          "disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        rows={rows || minRows}
        onInput={adjustHeight}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
