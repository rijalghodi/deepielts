import * as React from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.ComponentProps<"textarea"> {
  minRows?: number;
  maxRows?: number;
  plainStyle?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, plainStyle, minRows, maxRows, ...props }, ref) => {
    const internalRef = React.useRef<HTMLTextAreaElement>(null);

    // Merge refs
    const textareaRef = React.useMemo(() => {
      if (typeof ref === "function") {
        return (node: HTMLTextAreaElement | null) => {
          ref(node);
          (internalRef as any).current = node;
        };
      }
      if (ref) {
        return (node: HTMLTextAreaElement | null) => {
          if (ref) ref.current = node;
          (internalRef as any).current = node;
        };
      }
      return internalRef;
    }, [ref]);

    const adjustHeight = React.useCallback(() => {
      const textarea = internalRef.current;
      if (!textarea || (!minRows && !maxRows)) return;
      textarea.style.height = "auto";

      const computed = getComputedStyle(textarea);
      const lineHeight = Number.parseInt(computed.lineHeight);
      const paddingTop = Number.parseInt(computed.paddingTop);
      const paddingBottom = Number.parseInt(computed.paddingBottom);

      const minHeight = minRows ? lineHeight * minRows + paddingTop + paddingBottom : 0;
      const maxHeight = maxRows ? lineHeight * maxRows + paddingTop + paddingBottom : Number.POSITIVE_INFINITY;

      const newHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
      textarea.style.height = `${newHeight}px`;

      textarea.style.overflowY = textarea.scrollHeight > maxHeight ? "auto" : "hidden";
    }, [minRows, maxRows]);

    React.useEffect(() => {
      adjustHeight();
    }, [props.value, adjustHeight]);

    if (plainStyle) {
      // Only return a plain textarea, no styles or extra props except ref, className, and the rest
      return (
        <textarea
          ref={textareaRef}
          className={cn("text-sm outline-none", className)}
          rows={minRows}
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
          !minRows && !maxRows && "field-sizing-content min-h-16",
          className,
        )}
        rows={minRows}
        onInput={adjustHeight}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
