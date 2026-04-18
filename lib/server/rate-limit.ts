interface RateLimitBucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateLimitBucket>();
let lastCleanupAt = 0;

export function allowWriteByWindow(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  if (now - lastCleanupAt >= windowMs || buckets.size > 2000) {
    for (const [bucketKey, bucket] of buckets) {
      if (now - bucket.windowStart >= windowMs) {
        buckets.delete(bucketKey);
      }
    }
    lastCleanupAt = now;
  }

  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count += 1;
  return true;
}
