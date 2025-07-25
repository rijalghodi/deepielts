import * as React from "react";

import { cn } from "@/lib/utils";

import { inputVariants } from "./input";

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
          className={cn(
            "text-sm outline-none placeholder:text-muted-foreground/60",
            preventResize && "resize-none",
            className,
          )}
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
        className={cn(preventResize && "resize-none", inputVariants(), className)}
        rows={rows || minRows}
        onInput={adjustHeight}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
