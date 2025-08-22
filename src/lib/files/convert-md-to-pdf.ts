// import PDFDocument from "pdfkit";

// export async function convertMarkdownToPDFBuffer(params: { markdown: string }): Promise<Buffer> {
//   const { markdown } = params;

//   const doc = new PDFDocument({
//     size: "A4",
//     margins: { top: 50, bottom: 50, left: 50, right: 50 },
//   });

//   const chunks: Buffer[] = [];
//   doc.on("data", (chunk) => chunks.push(chunk));

//   // Helper function to clean text from HTML tags and metadata
//   const cleanText = (text: string): string => {
//     return (
//       text
//         // Remove metadata blocks (YAML-style with --- delimiters)
//         .replace(/^---[\s\S]*?---/g, "")
//         // Remove HTML tags but preserve content
//         .replace(/<[^>]*>/g, "")
//         // Clean up extra whitespace
//         .replace(/\n\s*\n/g, "\n\n")
//         .trim()
//     );
//   };

//   // Helper function to extract blockquote sections
//   const extractBlockquotes = (text: string): Array<{ section: string; content: string }> => {
//     const blockquoteRegex = /<blockquote data-section="([^"]*)">([\s\S]*?)<\/blockquote>/g;
//     const blockquotes: Array<{ section: string; content: string }> = [];
//     let match;

//     while ((match = blockquoteRegex.exec(text)) !== null) {
//       blockquotes.push({
//         section: match[1],
//         content: match[2].trim(),
//       });
//     }

//     return blockquotes;
//   };

//   // Helper function to process headings
//   const processHeading = (text: string, level: number): void => {
//     const fontSize = Math.max(20 - level * 2, 14);
//     doc.fontSize(fontSize).font("Helvetica-Bold");
//     doc.text(text, { align: "left" });
//     doc.moveDown(0.5);
//     doc.fontSize(12).font("Helvetica");
//   };

//   // Helper function to process formatted text with bold and italic
//   const processFormattedText = (
//     text: string,
//     options: { width?: number; align?: "left" | "right" | "center" | "justify" } = {},
//   ): void => {
//     const { width = doc.page.width - 100, align = "left" } = options;

//     // Handle bold text (both **text** and <strong>text</strong>)
//     const boldRegex = /(\*\*([^*]+)\*\*|<strong[^>]*>([^<]+)<\/strong>)/g;
//     let lastIndex = 0;
//     let match: RegExpExecArray | null;

//     while ((match = boldRegex.exec(text)) !== null) {
//       // Text before match
//       if (match.index > lastIndex) {
//         const plainText = text.slice(lastIndex, match.index);
//         doc.font("Helvetica").text(plainText, { continued: true, width, align });
//       }

//       // Bold text (either **text** or <strong>text</strong>)
//       const boldText = match[2] || match[3];
//       doc.font("Helvetica-Bold").text(boldText, { continued: true, width, align });

//       lastIndex = match.index + match[0].length;
//     }

//     // Remaining text after last match
//     if (lastIndex < text.length) {
//       const remainingText = text.slice(lastIndex);
//       doc.font("Helvetica").text(remainingText, { continued: false, width, align });
//     } else {
//       // End last continued segment
//       doc.text("", { continued: false });
//     }
//   };

//   // Helper function to process lists
//   const processList = (items: string[]): void => {
//     items.forEach((item) => {
//       const bullet = "• ";
//       const cleanItem = item.replace(/^[-*•]\s/, "");

//       doc.text(bullet, {
//         align: "left",
//         continued: true,
//       });

//       // Process the item text with formatting
//       processFormattedText(cleanItem, { width: doc.page.width - 100 - 20, align: "left" });
//       doc.moveDown(0.3);
//     });
//     doc.moveDown(0.5);
//   };

//   // Helper function to process tables
//   const processTable = (tableText: string): void => {
//     const lines = tableText.split("\n").filter((line) => line.trim());

//     if (lines.length < 2) return;

//     // Find the separator line (contains only |, -, :, and spaces)
//     const separatorIndex = lines.findIndex((line) => line.match(/^[\s|:-\s]*$/));
//     if (separatorIndex === -1) return;

//     const headerLines = lines.slice(0, separatorIndex);
//     const dataLines = lines.slice(separatorIndex + 1);

//     // Process header
//     headerLines.forEach((line) => {
//       if (line.includes("|")) {
//         const cells = line
//           .split("|")
//           .map((cell) => cell.trim())
//           .filter((cell) => cell);

//         doc.fontSize(12).font("Helvetica-Bold");
//         const cellWidth = (doc.page.width - 100) / cells.length;
//         let currentX = 50;

//         cells.forEach((cell) => {
//           doc.text(cell, currentX + 2, doc.y + 2, { width: cellWidth - 5 });
//           currentX += cellWidth;
//         });

//         doc.moveDown(1);
//       }
//     });

//     // Process data rows
//     dataLines.forEach((line) => {
//       if (line.includes("|")) {
//         const cells = line
//           .split("|")
//           .map((cell) => cell.trim())
//           .filter((cell) => cell);

//         doc.fontSize(11).font("Helvetica");
//         const cellWidth = (doc.page.width - 100) / cells.length;
//         let currentX = 50;

//         cells.forEach((cell) => {
//           doc.text(cell, currentX + 2, doc.y + 2, { width: cellWidth - 5 });
//           currentX += cellWidth;
//         });

//         doc.moveDown(1);
//       }
//     });

//     doc.moveDown(0.5);
//   };

//   // Helper function to process blockquote sections
//   const processBlockquoteSection = (section: string, content: string): void => {
//     // Process section title
//     doc.fontSize(14).font("Helvetica-Bold");
//     doc.text(section.replace(/-/g, " ").toUpperCase(), { align: "left" });
//     doc.moveDown(0.5);

//     // Process content based on type
//     if (content.includes("|") && content.includes("---")) {
//       // Table content
//       processTable(content);
//     } else if (content.includes("<strong")) {
//       // Content with strong tags
//       const cleanContent = content.replace(/<strong[^>]*>([^<]+)<\/strong>/g, "**$1**");
//       processFormattedText(cleanContent);
//       doc.moveDown(0.5);
//     } else {
//       // Regular content
//       doc.fontSize(12).font("Helvetica");
//       doc.text(content, { align: "left" });
//       doc.moveDown(0.5);
//     }
//   };

//   // Title
//   doc.fontSize(24).font("Helvetica-Bold").text("IELTS Writing Feedback", { align: "center" });
//   doc.moveDown(1);
//   doc.fontSize(12).font("Helvetica").text("By Deep IELTS", { align: "center" });
//   doc.text(`${new Date().toLocaleString()}`, { align: "center" });
//   doc.moveDown(2);

//   // Extract and process blockquotes first
//   const blockquotes = extractBlockquotes(markdown);

//   // Process overall score and criteria scores first
//   const scoreBlockquotes = blockquotes.filter(
//     (bq) => bq.section === "overall-score" || bq.section === "criteria-score",
//   );

//   scoreBlockquotes.forEach((blockquote) => {
//     processBlockquoteSection(blockquote.section, blockquote.content);
//     doc.moveDown(1);
//   });

//   // Process criteria details
//   const criteriaBlockquotes = blockquotes.filter((bq) => bq.section === "criteria-detail");
//   criteriaBlockquotes.forEach((blockquote) => {
//     processBlockquoteSection(blockquote.section, blockquote.content);
//     doc.moveDown(1);
//   });

//   // Process the remaining markdown content
//   const cleanedText = cleanText(markdown);
//   const paragraphs = cleanedText.split("\n\n").filter((p) => p.trim());

//   paragraphs.forEach((paragraph) => {
//     const trimmedParagraph = paragraph.trim();
//     if (!trimmedParagraph) return;

//     // Skip if this content was already processed in blockquotes
//     if (
//       trimmedParagraph.includes("Overall Band Score") ||
//       trimmedParagraph.includes("Task Response") ||
//       trimmedParagraph.includes("Coherence & Cohesion") ||
//       trimmedParagraph.includes("Grammatical Range") ||
//       trimmedParagraph.includes("Lexical Resource")
//     ) {
//       return;
//     }

//     // Check for headings
//     if (trimmedParagraph.startsWith("#")) {
//       const level = trimmedParagraph.match(/^#+/)?.[0].length || 1;
//       const headingText = trimmedParagraph.replace(/^#+\s*/, "");
//       processHeading(headingText, level);
//       return;
//     }

//     // Check for horizontal rules
//     if (trimmedParagraph.match(/^[-*_]{3,}$/)) {
//       doc.moveDown(0.5);
//       doc.moveTo(50, doc.y);
//       doc.lineTo(doc.page.width - 50, doc.y);
//       doc.stroke();
//       doc.moveDown(0.5);
//       return;
//     }

//     // Check for lists
//     if (trimmedParagraph.match(/^[-*•]\s/)) {
//       const items = trimmedParagraph.split("\n").filter((item) => item.trim());
//       processList(items);
//       return;
//     }

//     // Check for numbered lists
//     if (trimmedParagraph.match(/^\d+\.\s/)) {
//       const items = trimmedParagraph.split("\n").filter((item) => item.trim());
//       processList(items);
//       return;
//     }

//     // Check for tables
//     if (trimmedParagraph.includes("|") && trimmedParagraph.includes("---")) {
//       processTable(trimmedParagraph);
//       return;
//     }

//     // Regular paragraph with formatting
//     doc.fontSize(12);
//     processFormattedText(trimmedParagraph, { width: doc.page.width - 100, align: "justify" });
//     doc.moveDown(0.5);
//   });

//   doc.end();

//   return new Promise((resolve, reject) => {
//     doc.on("end", () => resolve(Buffer.concat(chunks)));
//     doc.on("error", reject);
//   });
// }
