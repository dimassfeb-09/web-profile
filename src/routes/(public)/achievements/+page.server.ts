import { AchievementService } from '../../../services/achievement.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const response = await AchievementService.getAllAchievements(true, sort);
	return {
		achievements: (response.data || []).map((ach) => ({
			...ach,
			id: ach.id || '',
			slug: ach.slug || '',
			image_hash: ach.image_hash || null,
		})),
	};
};