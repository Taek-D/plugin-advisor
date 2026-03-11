import type { NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const buckets = new Map<string, Map<string, RateLimitEntry>>();

type RateLimitOptions = {
  /** Unique name for this limiter (e.g. "analyze", "login") */
  name: string;
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds */
  windowMs: number;
};

function getBucket(name: string): Map<string, RateLimitEntry> {
  let bucket = buckets.get(name);
  if (!bucket) {
    bucket = new Map();
    buckets.set(name, bucket);
  }
  return bucket;
}

function getClientIp(request: NextRequest): string {
  // Prefer x-real-ip on Vercel (trusted, set by platform)
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export function checkRateLimit(
  request: NextRequest,
  options: RateLimitOptions
): { allowed: boolean; remaining: number } {
  const ip = getClientIp(request);
  const bucket = getBucket(options.name);
  const now = Date.now();

  const entry = bucket.get(ip);

  if (!entry || entry.resetAt < now) {
    bucket.set(ip, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, remaining: options.maxRequests - 1 };
  }

  entry.count++;

  if (entry.count > options.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: options.maxRequests - entry.count };
}

// Periodic cleanup to prevent memory leaks (runs at most once per minute)
let lastCleanup = 0;

export function cleanupExpiredEntries(): void {
  const now = Date.now();
  if (now - lastCleanup < 60_000) return;
  lastCleanup = now;

  buckets.forEach((bucket) => {
    bucket.forEach((entry, key) => {
      if (entry.resetAt < now) {
        bucket.delete(key);
      }
    });
  });
}
