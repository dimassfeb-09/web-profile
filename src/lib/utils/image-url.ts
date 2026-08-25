/**
 * Returns a proxied URL with `v=hash` for stable immutable caching.
 * ponytail: reuse getProxiedImageUrl so same image+hash → same URL → browser + SW hit.
 */
export function getCachedImageUrl(
  url: string | null | undefined,
  hash?: string | null,
  width?: number
): string {
  return getProxiedImageUrl(url, hash, width);
}

/**
 * Builds a versioned proxy URL for use in plain <img> tags, Open Graph images,
 * or any context outside of `next/image` where you need explicit cache busting.
 * If width is given, uses Vercel `/_vercel/image` for on-demand avif/webp + resize (ponytail: saves ~70% on hero).
 */
export function getProxiedImageUrl(
  url: string | null | undefined,
  hash?: string | null,
  width?: number
): string {
  if (!url) return '';

  // If it's already a relative path or data URL, return as is
  if (url.startsWith('/') || url.startsWith('data:')) return url;

  const encodedUrl = encodeURIComponent(url);
  const version = hash ? `&v=${hash}` : '';

  if (width) {
    // Vercel Image Optimization — auto avif/webp + resize, edge cache 300s
    return `/_vercel/image?url=${encodedUrl}&w=${width}&q=75${version}`;
  }

  return `/api/image-proxy?url=${encodedUrl}${version}`;
}
