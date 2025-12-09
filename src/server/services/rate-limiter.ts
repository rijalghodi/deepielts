import logger from "@/lib/logger";
import { redis } from "@/lib/redis";

async function safeRedisOperation<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    logger.warn({ error }, "Redis operation failed, using fallback");
    return fallback;
  }
}

export async function isBelowLimit(key: string, max: number): Promise<boolean> {
  return safeRedisOperation(async () => {
    const existing = await redis.get(key);
    if (!existing) {
      return true;
    }
    const count = parseInt(existing, 10);
    if (count >= max) {
      return false;
    }
    return true;
  }, true); // If Redis fails, allow the request (fail open)
}

export async function incrementUsage(
  key: string,
  increment: number = 1,
  ttlInSeconds: number = 60 * 60 * 24,
): Promise<void> {
  await safeRedisOperation(async () => {
    const existing = await redis.get(key);
    if (!existing) {
      await redis.set(key, increment.toString(), "EX", ttlInSeconds); // 1 day
    } else {
      await redis.incrby(key, increment);
    }
  }, undefined); // If Redis fails, silently continue (rate limiting is best-effort)
}
