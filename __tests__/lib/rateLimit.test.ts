import { checkRateLimit } from '@/src/lib/rateLimit';

// Mock environment variables for testing
jest.mock('@upstash/ratelimit', () => ({
  Ratelimit: {
    slidingWindow: jest.fn(() => ({
      limit: jest.fn().mockResolvedValue({ success: true }),
    })),
  },
}));

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({})),
}));

// Mock process.env
const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv, UPSTASH_REDIS_REST_URL: '', UPSTASH_REDIS_REST_TOKEN: '' };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('checkRateLimit()', () => {
  const ip = '127.0.0.1';

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow first attempt', async () => {
    const testIp = 'ip1';
    const result = await checkRateLimit(testIp);
    expect(result).toBe(true);
  });

  it('should allow multiple attempts within limit', async () => {
    const testIp = 'ip2';
    expect(await checkRateLimit(testIp)).toBe(true);
    expect(await checkRateLimit(testIp)).toBe(true);
    expect(await checkRateLimit(testIp)).toBe(true);
    expect(await checkRateLimit(testIp)).toBe(true);
    expect(await checkRateLimit(testIp)).toBe(true);
  });

  it('should block after exceeding max attempts', async () => {
    const testIp = 'ip3';
    // First 5 should pass (default limit is 5)
    for (let i = 0; i < 5; i++) {
      expect(await checkRateLimit(testIp)).toBe(true);
    }
    // 6th should fail
    expect(await checkRateLimit(testIp)).toBe(false);
  });

  it('should reset after window expires', async () => {
    const testIp = 'ip4';
    // Use up the limit
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(testIp);
    }
    expect(await checkRateLimit(testIp)).toBe(false);

    jest.advanceTimersByTime(15 * 60 * 1000 + 1); // 15 minutes + 1ms
    
    // Should be reset now
    expect(await checkRateLimit(testIp)).toBe(true);
  });

  it('should work with default parameters', async () => {
    const testIp = 'ip-default';
    const result = await checkRateLimit(testIp);
    expect(result).toBe(true);
  });
});