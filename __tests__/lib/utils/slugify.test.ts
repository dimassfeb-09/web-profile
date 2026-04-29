import { slugify } from '@/src/lib/utils/slugify';

describe('slugify util', () => {
  it('should convert text to lowercase and replace spaces with dashes', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('should trim whitespace', () => {
    expect(slugify('  hello world  ')).toBe('hello-world');
  });

  it('should remove special characters', () => {
    expect(slugify('Hello World! @2026')).toBe('hello-world-2026');
  });

  it('should handle multiple dashes and underscores', () => {
    expect(slugify('hello__world--test')).toBe('hello-world-test');
  });

  it('should remove leading and trailing dashes', () => {
    expect(slugify('---hello world---')).toBe('hello-world');
  });

  it('should handle empty or weird input', () => {
    expect(slugify('')).toBe('');
    expect(slugify('!!!')).toBe('');
  });
});
