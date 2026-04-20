/**
 * Returns the original Supabase URL for use with `next/image`.
 * next/image handles caching via minimumCacheTTL in next.config.ts.
 * The `hash` parameter is kept for API compatibility but unused here
 * since next/image uses URL-level caching automatically.
 */
export function getCachedImageUrl(url: string | null | undefined, _hash?: string | null): string {
  if (!url) return '';
  return url;
}

/**
 * Builds a versioned proxy URL for use in plain <img> tags, Open Graph images,
 * or any context outside of `next/image` where you need explicit cache busting.
 */
export function getProxiedImageUrl(url: string | null | undefined, hash?: string | null): string {
  if (!url) return '';

  // If it's already a relative path or data URL, return as is
  if (url.startsWith('/') || url.startsWith('data:')) return url;

  const encodedUrl = encodeURIComponent(url);
  const version = hash ? `&v=${hash}` : '';

  return `/api/image-proxy?url=${encodedUrl}${version}`;
}
