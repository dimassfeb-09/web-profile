import { getCachedData, clearCache } from '@/src/lib/cache';

describe('Cache Library', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    clearCache(); // Full clear before each
    Object.assign(process.env, { NODE_ENV: 'production' });
  });

  afterAll(() => {
    Object.assign(process.env, { NODE_ENV: originalEnv });
  });

  describe('getCachedData()', () => {
    it('should fetch fresh data and store in cache on first call (MISS)', async () => {
      const fetcher = jest.fn().mockResolvedValue('data-1');
      const result = await getCachedData('key1', fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toBe('data-1');
    });

    it('should return cached data on second call (HIT)', async () => {
      const fetcher = jest.fn().mockResolvedValue('fresh-data');
      
      // First call (MISS)
      await getCachedData('key2', fetcher);
      
      // Second call (HIT)
      const result = await getCachedData('key2', fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toBe('fresh-data');
    });

    it('should bypass cache if bypass option is true', async () => {
      const fetcher = jest.fn().mockResolvedValue('bypass-data');
      
      await getCachedData('key3', () => Promise.resolve('init-data'));
      const result = await getCachedData('key3', fetcher, { bypass: true });

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toBe('bypass-data');
    });

    it('should not cache data in non-production environment', async () => {
      Object.assign(process.env, { NODE_ENV: 'test' });
      const fetcher = jest.fn().mockResolvedValue('test-data');
      
      await getCachedData('key4', fetcher);
      await getCachedData('key4', fetcher);

      expect(fetcher).toHaveBeenCalledTimes(2);
    });

    it('should expire cache after TTL', async () => {
      jest.useFakeTimers();
      const fetcher = jest.fn().mockResolvedValue('expired-data');
      
      await getCachedData('key5', () => Promise.resolve('init'));
      
      // Advance time beyond 12 hours (default TTL)
      jest.advanceTimersByTime(12 * 60 * 60 * 1000 + 1);
      
      const result = await getCachedData('key5', fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toBe('expired-data');
      
      jest.useRealTimers();
    });
  });

  describe('clearCache()', () => {
    it('should clear specific key', async () => {
      const fetcher = jest.fn().mockResolvedValue('new-data');
      await getCachedData('key6', () => Promise.resolve('old-data'));
      
      clearCache('key6');
      const result = await getCachedData('key6', fetcher);

      expect(fetcher).toHaveBeenCalledTimes(1);
      expect(result).toBe('new-data');
    });

    it('should clear all cache', async () => {
      await getCachedData('a', () => Promise.resolve('1'));
      await getCachedData('b', () => Promise.resolve('1'));
      
      clearCache();
      
      const fetcher = jest.fn().mockResolvedValue('fresh');
      await getCachedData('a', fetcher);
      await getCachedData('b', fetcher);

      expect(fetcher).toHaveBeenCalledTimes(2);
    });
  });
});
