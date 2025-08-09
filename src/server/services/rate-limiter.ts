import { redis } from "@/lib/redis";

/**
 * Checks if the number of attempts for the given key has reached the maxAttempt.
 * - If the key does not exist, returns true (allowed).
 * - If the value is >= maxAttempt, returns false (not allowed).
 * - Otherwise, returns true (allowed).
 */
export async function checkDailyLimit(key: string, maxAttempt: number): Promise<boolean> {
  const existing = await redis.get(key);
  if (!existing) {
    return true; // No attempts yet, allowed
  }
  const attempts = parseInt(existing, 10);
  if (attempts >= maxAttempt) {
    return false; // Exceeded max attempts
  }
  return true; // Still under the limit
}

/**
 * Updates the attempt count for the given key.
 * - If the key does not exist, creates it with value "1" and 24h expiry.
 * - If the key exists, increments its value by 1.
 */
export async function updateDailyAttempt(key: string): Promise<void> {
  const existing = await redis.get(key);
  if (!existing) {
    // Set key with value "1" and 24-hour expiry
    await redis.set(key, "1", "EX", 60 * 60 * 24);
  } else {
    // Increment the value by 1, keep the expiry
    // Use multi to ensure expiry is not lost
    const ttl = await redis.ttl(key);
    await redis
      .multi()
      .incr(key)
      .expire(key, ttl > 0 ? ttl : 60 * 60 * 24)
      .exec();
  }
}

/**
 * Alias for checkDailyLimit with default maxAttempt = 1 for backward compatibility.
 */
export async function checkDailyLimitDefault(key: string): Promise<boolean> {
  return checkDailyLimit(key, 1);
}
