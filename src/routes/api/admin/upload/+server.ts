import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createHash } from 'crypto';
import { validateUploadFile, isValidBucket } from '$lib/upload';

export async function POST({ request, url }) {
	try {
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