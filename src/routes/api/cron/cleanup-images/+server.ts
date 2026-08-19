import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { ImageService } from '../../../../services/image.service';

async function handleCleanup(request: Request) {
	try {
		const authHeader = request.headers.get('authorization');
		const cronSecret = env.CRON_SECRET;

		if (cronSecret || env.NODE_ENV === 'production') {
			if (authHeader !== `Bearer ${cronSecret}`) {
				return json({ message: 'Unauthorized' }, { status: 401 });
			}
		}

		const result = await ImageService.cleanupOrphanImages();

		return json({
			status: 200,
			message: 'Cleanup completed successfully',
			data: result
		});
	} catch (error) {
		console.error('Cleanup Cron Error:', error);
		return json(
			{ status: 500, message: error instanceof Error ? error.message : 'Internal Server Error' },
			{ status: 500 }
		);
	}
}

export async function POST({ request }) {
	return handleCleanup(request);
}

export async function GET({ request }) {
	if (env.NODE_ENV === 'production') {
		return json({ message: 'Method Not Allowed' }, { status: 405 });
	}
	return handleCleanup(request);
}