import { createHash } from 'node:crypto';
import { json } from '@sveltejs/kit';

const CACHE_MAX_AGE = 60 * 60 * 24 * 7; // 7 hari dalam detik
const ALLOWED_HOSTS = ['atgnqunmelvquqdwkmnq.supabase.co', 'lh3.googleusercontent.com'];

export async function GET({ request, url }) {
	const imageUrl = url.searchParams.get('url');

	if (!imageUrl) {
		return json({ error: 'URL required' }, { status: 400 });
	}

	try {
		const parsed = new URL(imageUrl);
		if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
			return json({ error: 'Domain not allowed' }, { status: 403 });
		}

		const imageResponse = await fetch(imageUrl);
		if (!imageResponse.ok) {
			return json({ error: 'Image not found' }, { status: 404 });
		}

		const imageBuffer = await imageResponse.arrayBuffer();
		const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
		const etag = `"${createHash('sha256').update(Buffer.from(imageBuffer)).digest('hex').slice(0, 16)}"`;

		const cacheControl = `public, max-age=${CACHE_MAX_AGE}, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=86400`;

		if (request.headers.get('if-none-match') === etag) {
			return new Response(null, {
				status: 304,
				headers: {
					ETag: etag,
					'Cache-Control': cacheControl,
				},
			});
		}

		return new Response(imageBuffer, {
			status: 200,
			headers: {
				'Content-Type': contentType,
				'Content-Length': imageBuffer.byteLength.toString(),
				'Cache-Control': `${cacheControl}, immutable`,
				ETag: etag,
				'Last-Modified': new Date().toUTCString(),
			},
		});
	} catch (error) {
		console.error('Image proxy error:', error);
		return json({ error: 'Internal Server Error' }, { status: 500 });
	}
}