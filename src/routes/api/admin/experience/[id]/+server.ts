import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { ExperienceService } from '../../../../../services/experience.service';
import { ExperienceSchema } from '$lib/schemas/admin.schemas';

export async function PUT({ params, request }) {
	try {
		const body = await request.json();
		const data = ExperienceSchema.partial().parse(body);
		const result = await ExperienceService.updateExperience(parseInt(params.id), data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Experience PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const result = await ExperienceService.deleteExperience(parseInt(params.id));
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Experience DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
