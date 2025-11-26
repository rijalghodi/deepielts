import { env } from "../env";

export async function mdToPdfBufferViaAPI(markdownText: string): Promise<Buffer> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_PDF_URL}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: markdownText,
        apiKey: env.JWT_ACCESS_SECRET,
      }),
    });

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error converting markdown to PDF:", error);
    throw error;
  }
}
