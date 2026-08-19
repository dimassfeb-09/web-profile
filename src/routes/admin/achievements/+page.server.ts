import { AchievementService } from '../../../services/achievement.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const response = await AchievementService.getAllAchievements(true, sort);

	const mappedData = response.data.map((a) => ({
		id: a.id || '',
		slug: a.slug || '',
		title: a.title,
		description: a.description,
		image_url: a.image_url,
		date: a.date
			? a.date instanceof Date
				? a.date.toISOString()
				: a.date
			: null,
		event_organizer: a.event_organizer || null,
		category: a.category || null,
		team_members: a.team_members || null,
		tech_stack: a.tech_stack || null,
		problem_statement: a.problem_statement || null,
		solution_overview: a.solution_overview || null,
		credential_url: a.credential_url || null,
		image_hash: a.image_hash || null
	}));

	return { achievements: mappedData };
};