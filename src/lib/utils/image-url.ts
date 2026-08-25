/**
 * Returns a proxied URL with `v=hash` for stable immutable caching.
 * ponytail: reuse getProxiedImageUrl so same image+hash → same URL → browser + SW hit.
 */
export function getCachedImageUrl(url: string | null | undefined, hash?: string | null): string {
  return getProxiedImageUrl(url, hash);
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
