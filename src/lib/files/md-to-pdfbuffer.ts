import * as fs from "fs";
import { mdToPdf } from "md-to-pdf";
import { PdfConfig } from "md-to-pdf/dist/lib/config";
import * as path from "path";

export async function mdToPdfBuffer(mdString: string, options: Partial<PdfConfig> = {}): Promise<Buffer> {
  try {
    // Try to load CSS file, fallback to empty string if file not found
    let cssContent = "";
    try {
      cssContent = fs.readFileSync(path.join(process.cwd(), "src/lib/files/export.css"), "utf-8");
    } catch (cssError) {
      console.warn("Could not load CSS file, using default styling:", cssError);
    }

    // Prepare options with defaults
    const pdfOptions: Partial<PdfConfig> = {
      css: cssContent,
      stylesheet: cssContent ? [path.join(process.cwd(), "src/lib/files/export.css")] : [],
      launch_options: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-extensions", "--disable-plugins"],
      },
      // highlight_style: "",
      pdf_options: {
        format: "A4",
        margin: {
          top: "2cm",
          right: "2cm",
          bottom: "2cm",
          left: "2cm",
        },
        printBackground: true,
      },
      ...options,
    };

    // Convert markdown string to PDF buffer
    const result = await mdToPdf({ content: mdString }, pdfOptions);

    // Extract buffer from result.content
    if (result && result.content) {
      return Buffer.from(result.content);
    } else {
      throw new Error("Failed to generate PDF content");
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate PDF content: ${errorMessage}`);
  }
}
