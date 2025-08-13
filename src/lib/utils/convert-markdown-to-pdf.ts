import { mdToPdf } from "md-to-pdf";

export async function convertMarkdownToPDFBuffer(params: {
  markdownText: string;
  submissionId?: string;
}): Promise<Buffer> {
  const { markdownText, submissionId } = params;

  try {
    // Configure md-to-pdf options
    const pdfOptions = {
      // PDF output options
      pdf_options: {
        format: "A4" as const,
        margin: {
          top: "50px",
          bottom: "50px",
          left: "50px",
          right: "50px",
        },
        printBackground: true,
      },
      // Styling options
      stylesheet: [
        // Custom CSS for better formatting
        `
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: #333;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #2c3e50;
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        
        strong, b {
          font-weight: bold;
        }
        
        em, i {
          font-style: italic;
        }
        
        blockquote {
          border-left: 4px solid #3498db;
          margin: 20px 0;
          padding: 10px 20px;
          background-color: #f8f9fa;
          font-style: italic;
        }
        
        ul, ol {
          margin: 15px 0;
          padding-left: 30px;
        }
        
        li {
          margin: 5px 0;
        }
        
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
        }
        
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        
        tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        
        hr {
          border: none;
          border-top: 2px solid #ddd;
          margin: 20px 0;
        }
        
        code {
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        
        pre {
          background-color: #f4f4f4;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          border: 1px solid #ddd;
        }
        
        pre code {
          background-color: transparent;
          padding: 0;
        }
        `,
      ],
      // Markdown processing options
      markdown_options: {
        breaks: true,
        gfm: true, // GitHub Flavored Markdown
        tables: true,
      },
    };

    // Add header with submission info if provided
    let processedMarkdown = markdownText;
    if (submissionId) {
      const header = `---
title: IELTS Writing Feedback
submissionId: ${submissionId}
generatedOn: ${new Date().toLocaleString()}
---

`;
      processedMarkdown = header + markdownText;
    }

    // Convert markdown to PDF buffer
    const result = await mdToPdf({ content: processedMarkdown }, pdfOptions);

    // Convert the result to Buffer
    if (result && result.content) {
      return Buffer.from(result.content);
    } else {
      throw new Error("Failed to generate PDF content");
    }
  } catch (error) {
    throw new Error(`Failed to convert markdown to PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

// Alternative function for more control over the conversion process
export async function convertMarkdownToPDFBufferAdvanced(params: {
  markdownText: string;
  submissionId?: string;
  customStyles?: string;
  pdfOptions?: any;
}): Promise<Buffer> {
  const { markdownText, submissionId, customStyles, pdfOptions: userPdfOptions } = params;

  try {
    // Default PDF options
    const defaultPdfOptions = {
      pdf_options: {
        format: "A4" as const,
        margin: {
          top: "50px",
          bottom: "50px",
          left: "50px",
          right: "50px",
        },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; padding: 10px;">
            IELTS Writing Feedback
          </div>
        `,
        footerTemplate: `
          <div style="font-size: 10px; text-align: center; width: 100%; padding: 10px;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        `,
      },
      stylesheet: [
        // Base styles
        `
        body {
          font-family: 'Helvetica', 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.6;
          color: #333;
          max-width: 100%;
        }
        
        h1, h2, h3, h4, h5, h6 {
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 10px;
          color: #2c3e50;
          page-break-after: avoid;
        }
        
        h1 { font-size: 24px; }
        h2 { font-size: 20px; }
        h3 { font-size: 18px; }
        h4 { font-size: 16px; }
        h5 { font-size: 14px; }
        h6 { font-size: 12px; }
        
        strong, b { font-weight: bold; }
        em, i { font-style: italic; }
        
        blockquote {
          border-left: 4px solid #3498db;
          margin: 20px 0;
          padding: 10px 20px;
          background-color: #f8f9fa;
          font-style: italic;
          page-break-inside: avoid;
        }
        
        ul, ol {
          margin: 15px 0;
          padding-left: 30px;
          page-break-inside: avoid;
        }
        
        li { margin: 5px 0; }
        
        table {
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
          page-break-inside: avoid;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 8px 12px;
          text-align: left;
          vertical-align: top;
        }
        
        th {
          background-color: #f2f2f2;
          font-weight: bold;
        }
        
        tr:nth-child(even) { background-color: #f9f9f9; }
        
        hr {
          border: none;
          border-top: 2px solid #ddd;
          margin: 20px 0;
        }
        
        code {
          background-color: #f4f4f4;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Courier New', monospace;
        }
        
        pre {
          background-color: #f4f4f4;
          padding: 15px;
          border-radius: 5px;
          overflow-x: auto;
          border: 1px solid #ddd;
          page-break-inside: avoid;
        }
        
        pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .page-break { page-break-before: always; }
        .no-break { page-break-inside: avoid; }
        `,
        // Custom styles if provided
        customStyles || "",
      ],
      markdown_options: {
        breaks: true,
        gfm: true,
        tables: true,
        sanitize: false,
      },
    };

    // Merge user options with defaults
    const finalPdfOptions = {
      ...defaultPdfOptions,
      ...userPdfOptions,
      pdf_options: {
        ...defaultPdfOptions.pdf_options,
        ...userPdfOptions?.pdf_options,
      },
    };

    // Add header with submission info if provided
    let processedMarkdown = markdownText;
    if (submissionId) {
      const header = `---
title: IELTS Writing Feedback
submissionId: ${submissionId}
generatedOn: ${new Date().toLocaleString()}
---

`;
      processedMarkdown = header + markdownText;
    }

    // Convert markdown to PDF buffer
    const result = await mdToPdf({ content: processedMarkdown }, finalPdfOptions);

    // Convert the result to Buffer
    if (result && result.content) {
      return Buffer.from(result.content);
    } else {
      throw new Error("Failed to generate PDF content");
    }
  } catch (error) {
    throw new Error(`Failed to convert markdown to PDF: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}
