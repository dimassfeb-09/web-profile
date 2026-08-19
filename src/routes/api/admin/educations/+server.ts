import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { EducationService } from '../../../../services/education.service';
import { EducationSchema } from '$lib/schemas/education.schema';

export async function GET({ url }) {
	try {
		const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
		const result = await EducationService.getAllEducations(true, sort);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Education GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const data = EducationSchema.parse(body);
		const result = await EducationService.createEducation(data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Education POST] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
