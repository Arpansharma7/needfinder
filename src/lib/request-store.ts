type CacheEntry<T> = {
  expiresAt: number;
  value: T;
};

type RateLimitEntry = {
  count: number;
  expiresAt: number;
};

const globalStore = globalThis as typeof globalThis & {
  __needfinderCache?: Map<string, CacheEntry<unknown>>;
  __needfinderRateLimit?: Map<string, RateLimitEntry>;
};

const cacheStore = globalStore.__needfinderCache ?? new Map<string, CacheEntry<unknown>>();
const rateLimitStore = globalStore.__needfinderRateLimit ?? new Map<string, RateLimitEntry>();

globalStore.__needfinderCache = cacheStore;
globalStore.__needfinderRateLimit = rateLimitStore;

export function getCachedValue<T>(key: string): T | null {
  const entry = cacheStore.get(key);

  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    cacheStore.delete(key);
    return null;
  }

  return entry.value as T;
}

export function setCachedValue<T>(key: string, value: T, ttlSeconds: number) {
  cacheStore.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}

export function incrementRateLimit(key: string, windowSeconds: number) {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || entry.expiresAt <= now) {
    const freshEntry = {
      count: 1,
      expiresAt: now + windowSeconds * 1000,
    };
    rateLimitStore.set(key, freshEntry);
    return freshEntry;
  }

  entry.count += 1;
  rateLimitStore.set(key, entry);
  return entry;
}

export function clearRateLimit(key: string) {
  rateLimitStore.delete(key);
}
