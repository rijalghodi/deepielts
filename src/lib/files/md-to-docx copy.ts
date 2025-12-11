import HTMLtoDOCX from "html-to-docx";
import { remark } from "remark";
import remarkHtml from "remark-html";

export interface MdToDocxOptions {
  /**
   * Font family for the document
   * @default "Arial"
   */
  font?: string;
  /**
   * Base font size in points
   * @default 11
   */
  fontSize?: number;
  /**
   * Enable page numbers
   * @default true
   */
  pageNumber?: boolean;
  /**
   * Enable footer
   * @default true
   */
  footer?: boolean;
}

/**
 * Converts markdown text to DOCX buffer
 * Supports tables, headings, lists, bold, paragraphs with styling adapted from ai-output.css
 *
 * @param markdown - The markdown string to convert
 * @param options - Optional configuration for the DOCX output
 * @returns Promise<Buffer> - The DOCX file as a buffer
 */
export async function convertMdToDocx(markdown: string, options: MdToDocxOptions = {}): Promise<Buffer> {
  const { font = "Arial", fontSize = 11, pageNumber = true, footer = true } = options;

  // Convert markdown to HTML
  const processed = await remark().use(remarkHtml).process(markdown);
  const html = String(processed);

  // Create styled HTML with CSS adapted from ai-output.css
  const styledHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          /* Base styles */
          body {
            font-family: ${font}, sans-serif;
            font-size: ${fontSize}pt;
            line-height: 1.6;
            margin: 1in;
            color: #000000;
          }

          /* Paragraph styles */
          p {
            margin-top: 8pt;
            margin-bottom: 8pt;
            line-height: 1.6;
          }

          /* Heading styles - adapted from ai-output.css */
          h1, h2, h3, h4, h5, h6 {
            font-family: ${font}, sans-serif;
            margin-top: 12pt;
            margin-bottom: 6pt;
            font-weight: bold;
          }

          /* H2 - Primary heading (text-xl font-semibold) */
          h2 {
            font-size: 16pt;
            font-weight: 600;
            color: #2563eb; /* primary color approximation */
            margin-top: 20pt;
            margin-bottom: 12pt;
          }

          /* H3 - Secondary heading with background (bg-primary/10) */
          h3 {
            font-size: 14pt;
            font-weight: 600;
            color: #2563eb;
            background-color: #dbeafe; /* primary/10 approximation */
            padding: 8pt 12pt;
            border-left: 3pt solid #2563eb;
            margin-top: 16pt;
            margin-bottom: 12pt;
          }

          /* H4 - Tertiary heading (uppercase) */
          h4 {
            font-size: 12pt;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 12pt;
            margin-bottom: 10pt;
          }

          /* H5 - Small heading (uppercase) */
          h5 {
            font-size: 11pt;
            font-weight: 600;
            text-transform: uppercase;
            margin-top: 12pt;
            margin-bottom: 8pt;
          }

          h6 {
            font-size: 10pt;
            font-weight: 600;
            margin-top: 10pt;
            margin-bottom: 6pt;
          }

          /* Table styles - adapted from ai-output.css */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8pt;
            margin-bottom: 8pt;
            border: 1pt solid #d1d5db;
          }

          table th {
            background-color: #f3f4f6; /* muted background */
            border: 1pt solid #d1d5db;
            padding: 8pt;
            font-weight: 600;
            text-align: left;
          }

          table td {
            border: 1pt solid #d1d5db;
            padding: 8pt;
            text-align: left;
          }

          table tr:nth-child(even) {
            background-color: #f9fafb; /* muted background for even rows */
          }

          /* List styles - adapted from ai-output.css */
          ul {
            margin-top: 8pt;
            margin-bottom: 8pt;
            padding-left: 24pt;
            list-style-type: disc;
          }

          ol {
            margin-top: 8pt;
            margin-bottom: 8pt;
            padding-left: 24pt;
          }

          li {
            margin-bottom: 6pt;
            line-height: 1.6;
          }

          /* Nested lists */
          ul ul, ol ul {
            margin-top: 4pt;
            margin-bottom: 4pt;
          }

          /* Bold and emphasis */
          strong, b {
            font-weight: bold;
          }

          em, i {
            font-style: italic;
          }

          /* Horizontal rule */
          hr {
            border: none;
            border-top: 1pt solid #d1d5db;
            margin-top: 12pt;
            margin-bottom: 12pt;
          }

          /* Code and preformatted text */
          code {
            font-family: 'Courier New', monospace;
            background-color: #f3f4f6;
            padding: 2pt 4pt;
            font-size: ${fontSize - 1}pt;
          }

          pre {
            font-family: 'Courier New', monospace;
            background-color: #f3f4f6;
            padding: 8pt;
            margin-top: 8pt;
            margin-bottom: 8pt;
            border: 1pt solid #d1d5db;
            overflow-x: auto;
          }

          pre code {
            background-color: transparent;
            padding: 0;
          }

          /* Blockquote */
          blockquote {
            margin: 8pt 0;
            padding-left: 12pt;
            border-left: 3pt solid #d1d5db;
            color: #4b5563;
          }

          /* Links */
          a {
            color: #2563eb;
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  // Convert HTML to DOCX
  const docxBuffer = await HTMLtoDOCX(styledHtml, null, {
    table: { row: { cantSplit: true } },
    footer,
    pageNumber,
    font,
    fontSize,
  });

  return docxBuffer as Buffer;
}
