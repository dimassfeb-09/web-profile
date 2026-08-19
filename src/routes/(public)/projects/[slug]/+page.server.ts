import { error } from '@sveltejs/kit';
import { ProjectService } from '../../../../services/project.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const result = await ProjectService.getProjectBySlug(params.slug);
	if (!result.data) error(404, 'Project not found');

	const project = {
		...result.data,
		tech_stack: result.data.tech_stack || [],
		screenshots: result.data.screenshots || [],
		features: result.data.features || [],
		external_links: result.data.external_links || null,
	};

	return { project };
};