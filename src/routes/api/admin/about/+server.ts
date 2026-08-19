import { json } from '@sveltejs/kit';
import { AboutService } from '../../../../services/about.service';

export async function GET() {
	try {
		const result = await AboutService.getAboutData(true);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin About GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function PUT({ request }) {
	try {
		const data = await request.json();
		const result = await AboutService.updateAboutData(data);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin About PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
