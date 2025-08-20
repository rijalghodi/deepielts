import { redis } from "@/lib/redis";

export async function isBelowLimit(key: string, max: number): Promise<boolean> {
  const existing = await redis.get(key);
  if (!existing) {
    return true;
  }
  const count = parseInt(existing, 10);
  if (count >= max) {
    return false;
  }
  return true;
}

export async function incrementUsage(
  key: string,
  increment: number = 1,
  ttlInSeconds: number = 60 * 60 * 24,
): Promise<void> {
  const existing = await redis.get(key);
  if (!existing) {
    await redis.set(key, increment.toString(), "EX", ttlInSeconds); // 1 day
  } else {
    await redis.incrby(key, increment);
  }
}
