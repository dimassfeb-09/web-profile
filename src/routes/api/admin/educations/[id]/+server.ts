import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { EducationService } from '../../../../../services/education.service';
import { EducationSchema } from '$lib/schemas/education.schema';
import type { EducationInput } from '$lib/schemas/education.schema';

export async function PUT({ params, request }) {
	try {
		const body = await request.json();
		const data = EducationSchema.partial().parse(body);
		const result = await EducationService.updateEducation(params.id, data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Education PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const result = await EducationService.deleteEducation(params.id);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Education DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
