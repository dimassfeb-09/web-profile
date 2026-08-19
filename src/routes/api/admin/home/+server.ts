import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { HomeService } from '../../../../services/home.service';

const HomeSchema = z.object({
	badge_text: z.string().min(1).max(100),
	headline: z.string().min(1),
	subheadline: z.string().min(1),
	description: z.string().min(1),
	cv_url: z.string().url(),
});

export async function GET() {
	try {
		const result = await HomeService.getHomeData(true);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Home GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function PUT({ request }) {
	try {
		const body = await request.json();
		const data = HomeSchema.parse(body);
		const result = await HomeService.updateHomeData(data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Home PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
