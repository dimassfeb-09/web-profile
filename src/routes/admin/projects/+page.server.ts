import { ProjectService } from '../../../services/project.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const response = await ProjectService.getAllProjects(true, sort);

	const mappedData = response.data.map((project) => ({
		id: project.id || '',
		title: project.title,
		description: project.description,
		image_url: project.image_url,
		features: project.features,
		link_url: project.link_url,
		link_text: project.link_text,
		created_at: project.created_at,
		slug: project.slug || '',
		long_description: project.long_description || '',
		tech_stack: project.tech_stack || [],
		screenshots: project.screenshots || [],
		status: project.status || 'completed',
		date: project.date || '',
		external_links: project.external_links || {}
	}));

	return { projects: mappedData };
};