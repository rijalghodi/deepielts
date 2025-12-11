import { convertMarkdownToDocx, downloadDocx } from "@mohtasham/md-to-docx";

/**
 * Converts markdown text to DOCX buffer
 * Supports tables, headings, lists, bold, paragraphs with styling adapted from ai-output.css
 *
 * @param markdown - The markdown string to convert
 * @returns Promise<Buffer> - The DOCX file as a buffer
 */
export async function convertMdToDocx(markdown: string): Promise<Buffer> {
  const blob = await convertMarkdownToDocx(markdown);
  return Buffer.from(await blob.arrayBuffer());
}
