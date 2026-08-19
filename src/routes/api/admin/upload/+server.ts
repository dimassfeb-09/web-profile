import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_BUCKETS = ['projects', 'achievements', 'certificates', 'project-screenshots'];

const MAGIC_BYTES: Record<string, number[][]> = {
	'image/jpeg': [[0xff, 0xd8, 0xff]],
	'image/png': [[0x89, 0x50, 0x4e, 0x47]],
	'image/gif': [[0x47, 0x49, 0x46, 0x38]],
	'image/webp': [
		[0x52, 0x49, 0x46, 0x46],
		[0x57, 0x45, 0x42, 0x50],
	],
};

function validateMagicBytes(buffer: Uint8Array, mimeType: string): boolean {
	const signatures = MAGIC_BYTES[mimeType];
	if (!signatures) return false;

	for (const sig of signatures) {
		const matches = sig.every((byte, i) => buffer[i] === byte);
		if (matches) return true;
	}
	return false;
}

export async function POST({ request, url }) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;

		if (!file) {
			return json({ status: 400, message: 'No image file uploaded' }, { status: 400 });
		}

		if (!ALLOWED_MIME_TYPES.includes(file.type)) {
			return json({ status: 400, message: 'Invalid file type' }, { status: 400 });
		}

		if (file.size > MAX_FILE_SIZE) {
			return json({ status: 400, message: 'File too large (max 5MB)' }, { status: 400 });
		}

		const buffer = new Uint8Array(await file.arrayBuffer());
		if (!validateMagicBytes(buffer, file.type)) {
			return json(
				{ status: 400, message: 'Invalid file content - file may be corrupted or disguised' },
				{ status: 400 }
			);
		}

		const bucketName = url.searchParams.get('bucket') || 'projects';
		if (!ALLOWED_BUCKETS.includes(bucketName)) {
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

		const MIME_TO_EXT: Record<string, string> = {
			'image/jpeg': 'jpg',
			'image/png': 'png',
			'image/webp': 'webp',
			'image/gif': 'gif',
		};
		const ext = MIME_TO_EXT[file.type] || 'webp';
		const uniqueFileName = `${Date.now()}.${ext}`;

		const hash = createHash('sha256').update(Buffer.from(buffer)).digest('hex').slice(0, 8);

		const uploadUrl = `${cleanUrl}/storage/v1/object/${bucketName}/${uniqueFileName}`;

		const uploadRes = await fetch(uploadUrl, {
			method: 'POST',
			headers: {
				apikey: cleanKey,
				Authorization: `Bearer ${cleanKey}`,
				'Content-Type': file.type,
				'x-upsert': 'false',
			},
			body: buffer,
		});

		if (!uploadRes.ok) {
			throw new Error('Storage upload failed');
		}

		const publicUrl = `${cleanUrl}/storage/v1/object/public/${bucketName}/${uniqueFileName}`;

		return json({
			status: 200,
			message: 'Upload successful',
			data: { url: publicUrl, hash },
		});
	} catch (error) {
		console.error('[Admin Upload] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}