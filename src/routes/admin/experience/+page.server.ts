import { ExperienceService } from '../../../services/experience.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await ExperienceService.getAllExperiences(true);

	const mappedData = response.data.map((exp) => ({
		id: exp.id || 0,
		role: exp.role,
		company: exp.company,
		start_date: exp.start_date instanceof Date ? exp.start_date.toISOString() : exp.start_date,
		end_date: exp.end_date instanceof Date ? exp.end_date.toISOString() : exp.end_date,
		description: exp.description,
		tags: exp.tags || []
	}));

	return { experiences: mappedData };
};