import { createHash } from 'crypto';
import sharp from 'sharp';
import { env } from '$env/dynamic/private';
import { ALLOWED_BUCKETS, validateUploadFile, isValidBucket } from '$lib/upload';

const AVIF_QUALITY = 65;

function getOriginalExt(mimeType: string): string {
	const MIME_TO_EXT: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
		'image/gif': 'gif',
		'image/avif': 'avif'
	};
	return MIME_TO_EXT[mimeType] || 'webp';
}

async function uploadToSupabase(
	cleanUrl: string,
	cleanKey: string,
	bucket: string,
	fileName: string,
	body: Buffer | Uint8Array,
	contentType: string
): Promise<string> {
	const uploadUrl = `${cleanUrl}/storage/v1/object/${bucket}/${fileName}`;
	const payload = new Uint8Array(body);
	const res = await fetch(uploadUrl, {
		method: 'POST',
		headers: {
			apikey: cleanKey,
			Authorization: `Bearer ${cleanKey}`,
			'Content-Type': contentType,
			'x-upsert': 'true'
		},
		body: payload
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(`Storage upload failed: ${err.message || res.statusText}`);
	}
	return `${cleanUrl}/storage/v1/object/public/${bucket}/${fileName}`;
}

export class MediaService {
	/**
	 * Upload a raw buffer (from multipart) — validates, converts to AVIF, stores.
	 * Used by POST /api/admin/upload.
	 */
	static async uploadBuffer(
		buffer: Uint8Array,
		mimeType: string,
		bucket: string
	): Promise<{ url: string; hash: string; format: string }> {
		if (!isValidBucket(bucket)) throw new Error('Invalid bucket');
		const validationError = validateUploadFile(buffer, mimeType, buffer.length);
		if (validationError) throw new Error(validationError);

		const SUPABASE_URL = env.SUPABASE_URL;
		const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;
		if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('Supabase credentials not configured');

		const cleanUrl = SUPABASE_URL.trim().replace(/\/$/, '');
		const cleanKey = SUPABASE_SERVICE_ROLE_KEY.trim();
		const hash = createHash('sha256').update(Buffer.from(buffer)).digest('hex').slice(0, 8);

		let avifBuffer: Buffer;
		try {
			avifBuffer = await sharp(Buffer.from(buffer))
				.avif({ quality: AVIF_QUALITY, effort: 6, chromaSubsampling: '4:2:0' })
				.toBuffer();
		} catch (err) {
			console.error('[MediaService] AVIF conversion failed, falling back to original:', err);
			const ext = getOriginalExt(mimeType);
			const fileName = `${Date.now()}.${ext}`;
			const publicUrl = await uploadToSupabase(cleanUrl, cleanKey, bucket, fileName, buffer, mimeType);
			return { url: publicUrl, hash, format: ext };
		}

		const avifFileName = `${Date.now()}.avif`;
		const avifUrl = await uploadToSupabase(cleanUrl, cleanKey, bucket, avifFileName, avifBuffer, 'image/avif');

		const originalKB = (buffer.length / 1024).toFixed(1);
		const avifKB = (avifBuffer.length / 1024).toFixed(1);
		const savings = ((1 - avifBuffer.length / buffer.length) * 100).toFixed(0);
		console.log(`[MediaService] → AVIF (${originalKB}KB → ${avifKB}KB, -${savings}%)`);

		return { url: avifUrl, hash, format: 'avif' };
	}

	/**
	 * Fetch a remote image_url server-side, validate, convert to AVIF and re-host.
	 * No base64 in JSON — avoids ~1.6M tokens per 5MB image. Used by MCP upload_image.
	 */
	static async rehost(
		imageUrl: string,
		bucket: string
	): Promise<{ url: string; hash: string; format: string }> {
		if (!isValidBucket(bucket)) throw new Error(`Invalid bucket "${bucket}". Valid: ${ALLOWED_BUCKETS.join(', ')}.`);
		let parsed: URL;
		try {
			parsed = new URL(imageUrl);
		} catch {
			throw new Error('Invalid image_url');
		}
		if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('image_url must be http or https');

		const res = await fetch(imageUrl);
		if (!res.ok) throw new Error(`Failed to fetch image_url: ${res.status} ${res.statusText}`);

		const contentType = res.headers.get('content-type')?.split(';')[0].trim() || 'image/jpeg';
		const arrayBuffer = await res.arrayBuffer();
		const buffer = new Uint8Array(arrayBuffer);

		// Reuse the same validation as multipart uploads (mime allowlist, 5MB, magic bytes)
		const validationError = validateUploadFile(buffer, contentType, buffer.length);
		if (validationError) throw new Error(validationError);

		return await MediaService.uploadBuffer(buffer, contentType, bucket);
	}
}
