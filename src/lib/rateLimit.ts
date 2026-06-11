import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Redis rate limiter untuk production
// Ganti UPSTASH_REDIS_REST_URL dan UPSTASH_REDIS_REST_TOKEN di .env

const isRedisConfigured = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | undefined;
let rateLimiter: Ratelimit | null = null;

if (isRedisConfigured) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
  rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "rate-limit",
  });
}

// Fallback ke in-memory rate limiter untuk development
const inMemoryAttempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Checks if the given IP address is rate limited.
 * Uses Redis for production, falls back to in-memory for development.
 * @param ip IP address of the requester
 * @returns true if allowed, false if rate limited
 */
export async function checkRateLimit(ip: string): Promise<boolean> {
  // Use Redis in production if configured
  if (rateLimiter && redis) {
    const result = await rateLimiter.limit(ip);
    return result.success;
  }

  // Fallback to in-memory for development
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  const record = inMemoryAttempts.get(ip);

  if (!record || now > record.resetAt) {
    inMemoryAttempts.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}
