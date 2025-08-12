import PDFDocument from "pdfkit";

// import fs from "fs";
// import path from "path";

// export const runtime = "nodejs";

export async function convertFeedbackToPDFBuffer(params: {
  feedbackText: string;
  submissionId: string;
}): Promise<Buffer> {
  const { feedbackText, submissionId } = params;

  const doc = new PDFDocument({ size: "A4", margins: { top: 50, bottom: 50, left: 50, right: 50 } });
  // const fontPath = path.resolve(process.cwd(), "public/fonts/Inter.ttf");
  // doc.registerFont("Inter", fs.readFileSync(fontPath));
  // doc.font("Inter");

  const chunks: Buffer[] = [];
  doc.on("data", (chunk) => chunks.push(chunk));

  doc.fontSize(24).text("IELTS Writing Feedback", { align: "center" }).moveDown(2);
  doc.fontSize(12).text(`Submission ID: ${submissionId}`).moveDown(1);
  doc.text(`Generated on: ${new Date().toLocaleString()}`).moveDown(2);

  const paragraphs = feedbackText.split("\n\n").filter(Boolean);
  paragraphs.forEach((p) => doc.fontSize(12).text(p, { align: "justify" }).moveDown(0.5));

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
}
