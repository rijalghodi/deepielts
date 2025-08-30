import { env } from "../env";

export async function mdToPdfBufferViaAPI(markdownText: string): Promise<Buffer> {
  try {
    const response = await fetch("https://api.deepielts.com/export", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: markdownText,
        apiKey: env.JWT_ACCESS_SECRET,
      }),
    });

    // console.log(response);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  } catch (error) {
    console.error("Error converting markdown to PDF:", error);
    throw new Error("Failed to convert markdown to PDF");
  }
}
