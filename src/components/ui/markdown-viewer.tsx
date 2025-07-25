"use client";

import {
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  quotePlugin,
  thematicBreakPlugin,
} from "@mdxeditor/editor";
import { FC } from "react";

import { cn } from "@/lib/utils";

interface EditorProps {
  value?: string;
  className?: string;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
export const MarkdownViewer: FC<EditorProps> = ({ value, className }) => {
  return (
    <MDXEditor
      markdown={value ?? ""}
      plugins={[
        headingsPlugin({
          allowedHeadingLevels: [1, 2, 3],
        }),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
      ]}
      className={cn(className)}
      readOnly={true}
    />
  );
};
