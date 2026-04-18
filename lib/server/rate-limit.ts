interface RateLimitBucket {
  count: number;
  windowStart: number;
}

const buckets = new Map<string, RateLimitBucket>();

export function allowWriteByWindow(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return true;
  }

  if (existing.count >= maxRequests) {
    return false;
  }

  existing.count += 1;
  buckets.set(key, existing);
  return true;
}
