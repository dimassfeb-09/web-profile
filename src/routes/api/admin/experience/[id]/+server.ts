import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { ExperienceService } from '../../../../../services/experience.service';

const ExperienceSchema = z.object({
	role: z.string().min(1).max(200),
	company: z.string().min(1).max(200),
	start_date: z.string().min(1),
	end_date: z.string().nullable(),
	description: z.array(z.string().min(1)),
	tags: z.array(z.string()).optional(),
});

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
