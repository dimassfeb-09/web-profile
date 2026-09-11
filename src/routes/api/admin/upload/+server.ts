import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';
import sharp from 'sharp';
import { validateUploadFile, isValidBucket } from '$lib/upload';
import { requireAuth } from '$lib/auth';

const AVIF_QUALITY = 65;

export async function POST({ request, url, cookies }) {
	try {
		try {
			await requireAuth(cookies);
		} catch {
			return json({ status: 401, message: 'Unauthorized' }, { status: 401 });
		}
		const formData = await request.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return json({ status: 400, message: 'No image file uploaded' }, { status: 400 });
		}

		const buffer = new Uint8Array(await file.arrayBuffer());
		const validationError = validateUploadFile(buffer, file.type, file.size);
		if (validationError) {
			return json({ status: 400, message: validationError }, { status: 400 });
		}

		const bucketName = url.searchParams.get('bucket') || 'projects';
		if (!isValidBucket(bucketName)) {
			return json({ status: 400, message: 'Invalid bucket' }, { status: 400 });
		}

		const SUPABASE_URL = env.SUPABASE_URL;
		const SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY;

		if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
			console.error('Missing Supabase credentials');
			return json({ status: 500, message: 'Server configuration error' }, { status: 500 });
		}

		const cleanUrl = SUPABASE_URL.trim().replace(/\/$/, '');
		const cleanKey = SUPABASE_SERVICE_ROLE_KEY.trim();

		const hash = createHash('sha256').update(Buffer.from(buffer)).digest('hex').slice(0, 8);

		// ── Convert to AVIF ──────────────────────────────────────
		let avifBuffer: Buffer;
		try {
			avifBuffer = await sharp(Buffer.from(buffer))
				.avif({ quality: AVIF_QUALITY, effort: 6, chromaSubsampling: '4:2:0' })
				.toBuffer();
		} catch (err) {
			console.error('[Admin Upload] AVIF conversion failed, falling back to original:', err);
			// Fallback: upload original format
			const ext = getOriginalExt(file.type);
			const fileName = `${Date.now()}.${ext}`;
			const publicUrl = await uploadToSupabase(cleanUrl, cleanKey, bucketName, fileName, buffer, file.type);
			return json({
				status: 200,
				message: 'Upload successful (original format, AVIF conversion failed)',
				data: { url: publicUrl, hash, format: ext },
			});
		}

		// ── Upload AVIF ──────────────────────────────────────────
		const avifFileName = `${Date.now()}.avif`;
		const avifUrl = await uploadToSupabase(cleanUrl, cleanKey, bucketName, avifFileName, avifBuffer, 'image/avif');

		const originalKB = (buffer.length / 1024).toFixed(1);
		const avifKB = (avifBuffer.length / 1024).toFixed(1);
		const savings = ((1 - avifBuffer.length / buffer.length) * 100).toFixed(0);
		console.log(`[Admin Upload] ${file.name} → AVIF (${originalKB}KB → ${avifKB}KB, -${savings}%)`);

		return json({
			status: 200,
			message: 'Upload successful (AVIF)',
			data: { url: avifUrl, hash, format: 'avif' },
		});
	} catch (error) {
		console.error('[Admin Upload] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

// ── Helpers ─────────────────────────────────────────────────

function getOriginalExt(mimeType: string): string {
	const MIME_TO_EXT: Record<string, string> = {
		'image/jpeg': 'jpg',
		'image/png': 'png',
		'image/webp': 'webp',
		'image/gif': 'gif',
		'image/avif': 'avif',
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
	// ponytail: copy ke Uint8Array backed-ArrayBuffer — view union Buffer|Uint8Array (ArrayBufferLike) ditolak BodyInit fetch
	const payload = new Uint8Array(body);
	const res = await fetch(uploadUrl, {
		method: 'POST',
		headers: {
			apikey: cleanKey,
			Authorization: `Bearer ${cleanKey}`,
			'Content-Type': contentType,
			'x-upsert': 'true',
		},
		body: payload,
	});
	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(`Storage upload failed: ${err.message || res.statusText}`);
	}
	return `${cleanUrl}/storage/v1/object/public/${bucket}/${fileName}`;
}
