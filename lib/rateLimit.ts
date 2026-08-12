import { headers } from "next/headers";

/**
 * Minimal in-memory rate limiter for login endpoints.
 *
 * Keyed by client IP + a route label. On Vercel serverless this is per-warm-
 * instance memory (not a global counter), so it slows down repeated brute-force
 * attempts from a single source without being a hard guarantee — the real
 * backstop is the admin PIN + strong client credentials.
 */

const buckets = new Map<string, { count: number; resetAt: number }>();

/** Prune expired entries once the map grows large, so memory stays bounded. */
function prune(now: number) {
  if (buckets.size < 2000) return;
  for (const [key, b] of buckets) {
    if (b.resetAt < now) buckets.delete(key);
  }
}

export async function checkRateLimit(
  key: string,
  limit = 10,
  windowMs = 15 * 60 * 1000
): Promise<{ ok: boolean; retryAfterSeconds?: number }> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const fullKey = `${ip}:${key}`;
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(fullKey);
  if (!bucket || bucket.resetAt < now) {
    buckets.set(fullKey, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  return { ok: true };
}
