/**
 * Builds a cached image URL using the image proxy and a version hash.
 * This helps with browser caching and CDN invalidation.
 */
export function getCachedImageUrl(url: string | null | undefined, hash?: string | null): string {
  if (!url) return '';
  
  // If it's already a relative path or data URL, return as is
  if (url.startsWith('/') || url.startsWith('data:')) return url;

  const encodedUrl = encodeURIComponent(url);
  const version = hash ? `&v=${hash}` : '';
  
  return `/api/image-proxy?url=${encodedUrl}${version}`;
}
