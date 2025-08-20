import PDFDocument from "pdfkit";

// import fs from "fs";
// import path from "path";

// export const runtime = "nodejs";

export async function convertMarkdownToPDFBuffer(params: { markdown: string }): Promise<Buffer> {
  const { markdown } = params;

  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
  });

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  // Helper function to clean text from HTML tags and metadata
  const cleanText = (text: string): string => {
    return (
      text
        // Remove metadata blocks (YAML-style with --- delimiters)
        .replace(/^---[\s\S]*?---/g, "")
        // Convert HTML tags to markdown equivalents
        .replace(/<strong[^>]*>(.*?)<\/strong>/g, "**$1**")
        .replace(/<b[^>]*>(.*?)<\/b>/g, "**$1**")
        .replace(/<em[^>]*>(.*?)<\/em>/g, "*$1*")
        .replace(/<i[^>]*>(.*?)<\/i>/g, "*$1*")
        .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/g, "$1")
        .replace(/<div[^>]*>(.*?)<\/div>/g, "$1")
        .replace(/<p[^>]*>(.*?)<\/p>/g, "$1")
        .replace(/<br[^>]*>/g, "\n")
        .replace(/<hr[^>]*>/g, "\n---\n")
        // Remove any remaining HTML tags
        .replace(/<[^>]*>/g, "")
        // Remove markdown code blocks
        .replace(/```[\s\S]*?```/g, "")
        // Remove inline code
        .replace(/`([^`]*)`/g, "$1")
        // Clean up extra whitespace
        .replace(/\n\s*\n/g, "\n\n")
        .trim()
    );
  };

  // Helper function to process markdown headings
  const processHeading = (text: string, level: number): void => {
    const fontSize = Math.max(18 - level * 2, 12);
    doc.fontSize(fontSize).font("Helvetica-Bold");
    doc.text(text, { align: "left" });
    doc.moveDown(0.5);
    doc.fontSize(12).font("Helvetica");
  };

  const processFormattedText = (
    text: string,
    options: { width?: number; align?: "left" | "right" | "center" | "justify" } = {},
  ): void => {
    const { width = doc.page.width - 100, align = "justify" } = options;

    // Regex matches either **bold** or *italic*
    const regex = /(\*\*(.+?)\*\*|\*(.+?)\*)/g;

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        const plainText = text.slice(lastIndex, match.index);
        doc.font("Helvetica").text(plainText, { continued: true, width, align });
      }

      if (match[0].startsWith("**")) {
        // Bold text
        doc.font("Helvetica-Bold").text(match[2], { continued: true, width, align });
      } else {
        // Italic text
        doc.font("Helvetica-Oblique").text(match[3], { continued: true, width, align });
      }

      lastIndex = match.index + match[0].length;
    }

    // Remaining text after last match
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex);
      doc.font("Helvetica").text(remainingText, { continued: false, width, align });
    } else {
      // End last continued segment
      doc.text("", { continued: false });
    }
  };

  // Helper function to process lists
  const processList = (items: string[]): void => {
    items.forEach((item) => {
      const bullet = "• ";
      const cleanItem = item.replace(/^[-*•]\s/, "");

      doc.text(bullet, {
        align: "left",
        continued: true,
      });

      // Process the item text with formatting
      processFormattedText(cleanItem);
      doc.moveDown(0.3);
    });
    doc.moveDown(0.5);
  };

  // Helper function to process tables
  const processTable = (tableText: string): void => {
    const lines = tableText.split("\n").filter((line) => line.trim());

    lines.forEach((line, index) => {
      if (line.includes("|")) {
        const cells = line
          .split("|")
          .map((cell) => cell.trim())
          .filter((cell) => cell);

        // Skip separator lines (lines with only dashes and pipes)
        if (line.match(/^[\s|:-\s]*$/)) {
          return;
        }

        if (index === 0) {
          // Header row
          doc.fontSize(12).font("Helvetica-Bold");
        } else {
          doc.fontSize(11).font("Helvetica");
        }

        const cellWidth = (doc.page.width - 100) / cells.length;
        let currentX = 50;
        const currentY = doc.y;

        cells.forEach((cell) => {
          // Draw cell border
          // doc
          //   .strokeColor("#000000")
          //   .rect(currentX, currentY, cellWidth - 5, 20)
          //   .stroke();

          doc.text(cell, currentX + 2, currentY + 2, { width: cellWidth - 5 });
          currentX += cellWidth;
        });

        doc.moveDown(1);

        if (index === 0) {
          doc.fontSize(11).font("Helvetica");
        }
      }
    });
    doc.moveDown(0.5);
  };

  // Title
  doc.fontSize(24).font("Helvetica-Bold").text("IELTS Writing Feedback", { align: "center" });
  doc.moveDown(1);
  doc.fontSize(12).font("Helvetica").text("By Deep IELTS", { align: "center" });
  doc.text(`${new Date().toLocaleString()}`, { align: "center" });

  doc.moveDown(2);

  // Process the cleaned feedback text
  const cleanedText = cleanText(markdown);
  console.log("cleanedText", cleanedText);
  const paragraphs = cleanedText.split("\n\n").filter((p) => p.trim());

  console.log("paragraphs", paragraphs);

  paragraphs.forEach((paragraph) => {
    const trimmedParagraph = paragraph.trim();

    if (!trimmedParagraph) return;

    // Check for headings
    if (trimmedParagraph.startsWith("#")) {
      const level = trimmedParagraph.match(/^#+/)?.[0].length || 1;
      const headingText = trimmedParagraph.replace(/^#+\s*/, "");
      processHeading(headingText, level);
      return;
    }

    // Check for horizontal rules
    if (trimmedParagraph.match(/^[-*_]{3,}$/)) {
      doc.moveDown(0.5);
      doc.moveTo(50, doc.y);
      doc.lineTo(doc.page.width - 50, doc.y);
      doc.stroke();
      doc.moveDown(0.5);
      return;
    }

    // Check for lists
    if (trimmedParagraph.match(/^[-*•]\s/)) {
      const items = trimmedParagraph.split("\n").filter((item) => item.trim());
      const listItems = items.map((item) => item.replace(/^[-*•]\s/, ""));
      processList(listItems);
      return;
    }

    // Check for numbered lists
    if (trimmedParagraph.match(/^\d+\.\s/)) {
      const items = trimmedParagraph.split("\n").filter((item) => item.trim());
      const listItems = items.map((item) => item.replace(/^\d+\.\s/, ""));
      processList(listItems);
      return;
    }

    // Check for tables
    if (trimmedParagraph.includes("|") && trimmedParagraph.includes("---")) {
      processTable(trimmedParagraph);
      return;
    }

    // Regular paragraph with formatting
    doc.fontSize(12);
    processFormattedText(trimmedParagraph, { width: doc.page.width - 100, align: "justify" });
    doc.moveDown(0.5);
  });

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}
