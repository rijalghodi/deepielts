import { redis } from "@/lib/redis";

export async function isBelowDailyLimit(key: string, max: number): Promise<boolean> {
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

export async function incrementDailyUsage(key: string, increment: number = 1): Promise<void> {
  const existing = await redis.get(key);
  if (!existing) {
    await redis.set(key, increment.toString(), "EX", 60 * 60 * 24); // 1 day
  } else {
    await redis.incrby(key, increment);
  }
}
