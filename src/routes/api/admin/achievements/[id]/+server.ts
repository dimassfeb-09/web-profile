import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { AchievementService } from '../../../../../services/achievement.service';
import { AchievementSchema } from '$lib/schemas/admin.schemas';

export async function PUT({ params, request }) {
	try {
		const body = await request.json();
		const data = AchievementSchema.partial().parse(body);
		const result = await AchievementService.updateAchievement(params.id, data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Achievement PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const result = await AchievementService.deleteAchievement(params.id);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Achievement DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
