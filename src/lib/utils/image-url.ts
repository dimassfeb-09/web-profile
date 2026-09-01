/**
 * Image URL utility with AVIF-first strategy.
 *
 * Flow:
 *   1. If URL already ends with .avif → serve directly from Supabase (no proxy needed)
 *   2. If URL is an original format → try AVIF version first (replace extension)
 *   3. If AVIF exists → serve AVIF directly from Supabase
 *   4. If AVIF doesn't exist → fallback to Vercel Image Optimization
 *
 * This avoids unnecessary proxy hops and leverages Supabase CDN for AVIF images.
 */

const SUPABASE_HOST = 'atgnqunmelvquqdwkmnq.supabase.co';

/**
 * Returns a proxied URL with `v=hash` for stable immutable caching.
 * For AVIF images served directly from Supabase, no proxy is needed.
 */
export function getCachedImageUrl(
  url: string | null | undefined,
  hash?: string | null,
  width?: number
): string {
  return getProxiedImageUrl(url, hash, width);
}

/**
 * Builds a versioned image URL.
 *
 * - AVIF images (already .avif) → direct Supabase URL with cache buster
 * - Original format images → try AVIF version first, fallback to Vercel optimization
 */
export function getProxiedImageUrl(
  url: string | null | undefined,
  hash?: string | null,
  width?: number
): string {
  if (!url) return '';

  // If it's already a relative path or data URL, return as is
  if (url.startsWith('/') || url.startsWith('data:')) return url;

  const version = hash ? `?v=${hash}` : '';

  // If already AVIF, serve directly from Supabase (no proxy needed)
  if (url.endsWith('.avif')) {
    return `${url}${version}`;
  }

  // Try AVIF version: replace extension with .avif
  const avifUrl = toAvifUrl(url);
  if (avifUrl) {
    // Serve AVIF directly from Supabase with cache buster
    // The SW will cache it; no need for proxy
    return `${avifUrl}${version}`;
  }

  // Fallback: original format
  const encodedUrl = encodeURIComponent(url);

  if (width) {
    // Vercel Image Optimization — auto avif/webp + resize
    return `/_vercel/image?url=${encodedUrl}&w=${width}&q=75${version}`;
  }

  return `/api/image-proxy?url=${encodedUrl}${version}`;
}

/**
 * Convert an image URL to its AVIF equivalent.
 * If the URL is from Supabase, replace the extension with .avif.
 * Returns null if conversion is not possible.
 */
function toAvifUrl(url: string): string | null {
  // Only convert Supabase storage URLs
  if (!url.includes(SUPABASE_HOST)) return null;

  // Already AVIF
  if (url.endsWith('.avif')) return url;

  // Replace image extension with .avif
  const avifUrl = url.replace(/\.(jpe?g|png|webp|gif)$/i, '.avif');
  if (avifUrl !== url) return avifUrl;

  return null;
}
