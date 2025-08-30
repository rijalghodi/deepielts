// import * as fs from "fs";
// import { mdToPdf } from "md-to-pdf";
// import { PdfConfig } from "md-to-pdf/dist/lib/config";
// import * as path from "path";

// export async function mdToPdfBuffer(mdString: string, options: Partial<PdfConfig> = {}): Promise<Buffer> {
//   try {
//     let cssContent = "";
//     try {
//       cssContent = fs.readFileSync(path.join(process.cwd(), "src/lib/files/export.css"), "utf-8");
//     } catch (cssError) {
//       console.warn("Could not load CSS file, using default styling:", cssError);
//     }

//     console.log(path.join(process.cwd(), "/src/lib/files/export.css"));

//     const pdfOptions: Partial<PdfConfig> = {
//       css: cssContent,
//       stylesheet: cssContent ? [path.join(process.cwd(), "/src/lib/files/export.css")] : [],
//       launch_options: {
//         headless: true,
//         args: ["--no-sandbox", "--disable-setuid-sandbox"],
//       },
//       pdf_options: {
//         format: "A4",
//         margin: {
//           top: "2cm",
//           right: "2cm",
//           bottom: "2cm",
//           left: "2cm",
//         },
//         printBackground: true,
//       },
//       ...options,
//     };

//     const result = await mdToPdf({ content: mdString }, pdfOptions);

//     if (result && result.content) {
//       return Buffer.from(result.content);
//     } else {
//       throw new Error("Failed to generate PDF content");
//     }
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : String(error);
//     throw new Error(`Failed to generate PDF content: ${errorMessage}`);
//   }
// }
