import { Environment, LogLevel, Paddle, PaddleOptions } from "@paddle/paddle-node-sdk";

let paddleInstance: Paddle | null = null;

export function getPaddleInstance() {
  if (paddleInstance) {
    return paddleInstance;
  }

  const paddleOptions: PaddleOptions = {
    environment: (process.env.NEXT_PUBLIC_PADDLE_ENV as Environment) ?? Environment.sandbox,
    logLevel: LogLevel.error,
  };

  if (!process.env.PADDLE_API_KEY) {
    console.error("Paddle API key is missing");
  }

  paddleInstance = new Paddle(process.env.PADDLE_API_KEY!, paddleOptions);
  return paddleInstance;
}
