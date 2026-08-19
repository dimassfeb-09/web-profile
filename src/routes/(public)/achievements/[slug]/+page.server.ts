import { error, redirect } from '@sveltejs/kit';
import { AchievementService } from '../../../../services/achievement.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await AchievementService.getAchievementBySlug(params.slug);

	if (result.status === 301 && typeof result.data === 'string') {
		redirect(301, `/achievements/${result.data}`);
	}

	if (!result.data || typeof result.data === 'string') error(404, 'Achievement not found');

	return { achievement: result.data };
};