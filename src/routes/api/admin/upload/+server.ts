import { json } from '@sveltejs/kit';
import { MediaService } from '../../../../services/media.service';
import { requireAuth } from '$lib/auth';

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

		const bucketName = url.searchParams.get('bucket') || 'projects';
		const buffer = new Uint8Array(await file.arrayBuffer());

		try {
			const result = await MediaService.uploadBuffer(buffer, file.type, bucketName);
			const isAvif = result.format === 'avif';
			return json({
				status: 200,
				message: isAvif ? 'Upload successful (AVIF)' : 'Upload successful (original format, AVIF conversion failed)',
				data: { url: result.url, hash: result.hash, format: result.format }
			});
		} catch (err) {
			const message = err instanceof Error ? err.message : 'Upload failed';
			if (message === 'Invalid bucket' || message.startsWith('Invalid file') || message.startsWith('File too large') || message.startsWith('Invalid file content')) {
				return json({ status: 400, message }, { status: 400 });
			}
			if (message === 'Supabase credentials not configured') {
				console.error('Missing Supabase credentials');
				return json({ status: 500, message: 'Server configuration error' }, { status: 500 });
			}
			throw err;
		}
	} catch (error) {
		console.error('[Admin Upload] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
