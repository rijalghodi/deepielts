"use client";

import { cn } from "@/lib/utils";
import {
  BlockTypeSelect,
  BoldItalicUnderlineToggles,
  InsertThematicBreak,
  ListsToggle,
  MDXEditor,
  MDXEditorMethods,
  Separator,
  UndoRedo,
  headingsPlugin,
  listsPlugin,
  markdownShortcutPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
} from "@mdxeditor/editor";
import { FC } from "react";

interface EditorProps {
  markdown?: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  onChange?: (e: string) => void;
  className?: string;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
export const MarkdownEditor: FC<EditorProps> = ({ markdown, editorRef, onChange, className }) => {
  return (
    <MDXEditor
      onChange={onChange}
      ref={editorRef}
      markdown={markdown ?? ""}
      plugins={[
        headingsPlugin({
          allowedHeadingLevels: [1, 2, 3],
        }),
        quotePlugin(),
        listsPlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        toolbarPlugin({
          toolbarClassName: "my-classname",
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <Separator />
              <BoldItalicUnderlineToggles />
              <Separator />
              <ListsToggle options={["number", "bullet"]} />
              <Separator />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
      className={cn(className)}
    />
  );
};
