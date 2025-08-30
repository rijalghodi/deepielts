import { env } from "../env";

export async function mdToPdfBufferViaAPI(markdownText: string): Promise<Buffer> {
  try {
    const response = await fetch("http://localhost:3000/export", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.JWT_ACCESS_SECRET}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: markdownText,
      }),
    });

    console.log(response);

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
