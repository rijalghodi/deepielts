import Redis from "ioredis";

import logger from "./logger";

const globalForRedis = global as unknown as { redis: Redis | undefined };

function createRedisClient(): Redis {
  // Create a no-op error handler first to prevent "Unhandled error event" warnings
  const errorHandler = (error: Error) => {
    // Silently handle ALL connection errors - don't let them crash the app
    const errorMessage = error?.message || String(error);
    if (
      errorMessage.includes("ETIMEDOUT") ||
      errorMessage.includes("ECONNREFUSED") ||
      errorMessage.includes("ENOTFOUND") ||
      errorMessage.includes("connect")
    ) {
      // These are expected when Redis is not available - silently ignore
      return;
    }
    // Only log truly unexpected errors
    logger.warn({ error: errorMessage }, "Redis unexpected error");
  };

  const client = new Redis(process.env.REDIS_URL!, {
    maxRetriesPerRequest: null, // needed for some serverless providers
    enableReadyCheck: false,
    connectTimeout: 5000, // 5 seconds - shorter timeout to fail faster
    retryStrategy: (times) => {
      // Stop retrying after 2 attempts to prevent endless retry loops
      if (times > 2) {
        return null; // Stop retrying
      }
      const delay = Math.min(times * 100, 1000);
      return delay;
    },
    lazyConnect: true, // Don't connect immediately
    showFriendlyErrorStack: false, // Disable friendly error stack to prevent unhandled errors
    enableOfflineQueue: false, // Disable offline queue to prevent error accumulation
  });

  // CRITICAL: Attach error handler IMMEDIATELY after creation
  // This must happen before any async operations
  client.on("error", errorHandler);

  // Suppress unhandled error events
  client.on("close", () => {
    // Connection closed - this is fine
  });

  client.on("end", () => {
    // Connection ended - this is fine
  });

  client.on("reconnecting", () => {
    // Reconnecting - this is fine
  });

  // Only log successful connections
  client.on("connect", () => {
    logger.info("Redis connected");
  });

  client.on("ready", () => {
    logger.info("Redis ready");
  });

  // With lazyConnect: true, connection happens on first use
  // Don't call connect() immediately - let it connect when needed
  // This prevents errors during initialization

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
