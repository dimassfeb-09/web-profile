/**
 * High-performance In-Memory Cache Manager
 * Features:
 * - TTL (Time to Live) support (Default: 12 hours)
 * - Environment detection (Only active in Production)
 * - Stampede Prevention (Promise-based coalescing)
 * - Manual Bypass support
 */

type CacheEntry<T> = {
  promise: Promise<T>;
  expiry: number;
};

// Singleton storage to survive HMR in dev (though we disable logic in dev)
const cacheStore = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL = 12 * 60 * 60 * 1000; // 12 Hours in ms

export async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: { bypass?: boolean; ttl?: number } = {}
): Promise<T> {
  const isProd = process.env.NODE_ENV === 'production';
  const ttl = options.ttl ?? DEFAULT_TTL;
  const now = Date.now();

  // Logic: In development, we always fetch fresh data unless specifically told otherwise
  // In production, we check the cache first.
  if (isProd && !options.bypass) {
    const cached = cacheStore.get(key);

    if (cached && now < cached.expiry) {
      console.log(`[Cache] HIT: ${key}`);
      // Valid cache found, return the promise (or result of it)
      return cached.promise;
    }
  }

  // If we reach here, either it's dev, cache expired, or bypass is true.
  console.log(`[Cache] MISS: ${key} (Bypass: ${!!options.bypass}, Env: ${process.env.NODE_ENV})`);
  const newPromise = fetcher();

  // We only store in cache if it's production
  if (isProd) {
    cacheStore.set(key, {
      promise: newPromise,
      expiry: now + ttl,
    });
  }

  return newPromise;
}

/**
 * Utility to clear cache if needed programmatically
 */
export function clearCache(key?: string) {
  if (key) {
    cacheStore.delete(key);
  } else {
    cacheStore.clear();
  }
}
