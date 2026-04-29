import { getCachedImageUrl, getProxiedImageUrl } from '@/src/lib/utils/image-url';

describe('image-url utils', () => {
  describe('getCachedImageUrl', () => {
    it('should return empty string if url is null or undefined', () => {
      expect(getCachedImageUrl(null)).toBe('');
      expect(getCachedImageUrl(undefined)).toBe('');
    });

    it('should return the original url', () => {
      const url = 'https://example.com/image.jpg';
      expect(getCachedImageUrl(url)).toBe(url);
    });
  });

  describe('getProxiedImageUrl', () => {
    it('should return empty string if url is null or undefined', () => {
      expect(getProxiedImageUrl(null)).toBe('');
      expect(getProxiedImageUrl(undefined)).toBe('');
    });

    it('should return as is for relative paths or data URLs', () => {
      expect(getProxiedImageUrl('/local.png')).toBe('/local.png');
      expect(getProxiedImageUrl('data:image/png;base64,...')).toBe('data:image/png;base64,...');
    });

    it('should return proxied URL for absolute URLs', () => {
      const url = 'https://example.com/img.jpg';
      const result = getProxiedImageUrl(url);
      expect(result).toBe(`/api/image-proxy?url=${encodeURIComponent(url)}`);
    });

    it('should include version hash in proxied URL', () => {
      const url = 'https://example.com/img.jpg';
      const hash = 'abc123';
      const result = getProxiedImageUrl(url, hash);
      expect(result).toBe(`/api/image-proxy?url=${encodeURIComponent(url)}&v=${hash}`);
    });
  });
});
