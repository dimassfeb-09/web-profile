import { checkRateLimit } from '@/src/lib/rateLimit';

describe('checkRateLimit()', () => {
  const ip = '127.0.0.1';
  const maxAttempts = 3;
  const windowMs = 1000;

  beforeEach(() => {
    // Note: since 'attempts' is private and persistent in rateLimit.ts,
    // we use different IPs to ensure independence or just rely on state.
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should allow first attempt', () => {
    const testIp = 'ip1';
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(true);
  });

  it('should allow multiple attempts within limit', () => {
    const testIp = 'ip2';
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(true);
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(true);
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(true);
  });

  it('should block after exceeding max attempts', () => {
    const testIp = 'ip3';
    checkRateLimit(testIp, maxAttempts, windowMs);
    checkRateLimit(testIp, maxAttempts, windowMs);
    checkRateLimit(testIp, maxAttempts, windowMs);
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(false);
  });

  it('should reset after window expires', () => {
    const testIp = 'ip4';
    checkRateLimit(testIp, maxAttempts, windowMs);
    checkRateLimit(testIp, maxAttempts, windowMs);
    checkRateLimit(testIp, maxAttempts, windowMs);
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(false);

    jest.advanceTimersByTime(windowMs + 1);
    
    expect(checkRateLimit(testIp, maxAttempts, windowMs)).toBe(true);
  });

  it('should work with default parameters', () => {
    const testIp = 'ip-default';
    expect(checkRateLimit(testIp)).toBe(true);
  });
});
