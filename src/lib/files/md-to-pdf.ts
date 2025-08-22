import * as fs from "fs";
import { mdToPdf } from "md-to-pdf";
import { PdfConfig } from "md-to-pdf/dist/lib/config";
import * as path from "path";

// Interface for conversion result
interface ConversionResult {
  success: boolean;
  message: string;
  outputFile?: string;
}

export async function mdToPdfDemo(
  inputFile: string,
  outputFile: string,
  options: Partial<PdfConfig> = {},
): Promise<ConversionResult> {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputFile)) {
      return {
        success: false,
        message: `Input file not found: ${inputFile}`,
      };
    }

    // Prepare options with defaults
    const pdfOptions: Partial<PdfConfig> = {
      css: fs.readFileSync(path.join(__dirname, "../src/styles.css"), "utf-8"),
      stylesheet: [path.join(__dirname, "../src/styles.css")],
      launch_options: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
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

    // Convert markdown to PDF
    await mdToPdf(
      { path: inputFile },
      {
        dest: outputFile,
        ...pdfOptions,
      },
    );

    return {
      success: true,
      message: `Successfully converted ${inputFile} to ${outputFile}`,
      outputFile: outputFile,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      success: false,
      message: `Conversion error: ${errorMessage}`,
    };
  }
}

// export async function main(): Promise<void> {
//   try {
//     const inputFile: string = "md.txt";
//     const outputFile: string = "output.pdf";

//     console.log(`🔄 Converting ${inputFile} to PDF...`);
//     console.log(`📁 Working directory: ${process.cwd()}`);
//     console.log(`🎨 CSS file: ${path.join(__dirname, "../src/styles.css")}`);

//     const result: ConversionResult = await convertMarkdownToPdf(inputFile, outputFile);

//     if (result.success) {
//       console.log(`🎉 Conversion completed! PDF saved as: ${result.outputFile}`);
//     } else {
//       console.error(`❌ Conversion failed: ${result.message}`);
//       process.exit(1);
//     }
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     console.error(`❌ Unexpected error: ${errorMessage}`);
//     process.exit(1);
//   }
// }
