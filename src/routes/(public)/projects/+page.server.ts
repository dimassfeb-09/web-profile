import { ProjectService } from '../../../services/project.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const response = await ProjectService.getAllProjects(false, sort);
	return {
		projects: (response.data || []).map((p) => ({
			...p,
			tech_stack: p.tech_stack || [],
		})),
	};
};