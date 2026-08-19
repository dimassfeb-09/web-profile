import { ProjectService } from '../../../services/project.service';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const limit = Number(url.searchParams.get('limit')) || 6;
	const offset = Number(url.searchParams.get('offset')) || 0;
	const bypassCache = url.searchParams.get('bypassCache') === 'true';

	try {
		const result = await ProjectService.getAllProjects(bypassCache, 'newest', limit, offset);
		return json(result);
	} catch (error) {
		console.error('Error in GET /api/projects:', error);
		return json({ status: 500, message: 'Failed to fetch projects', data: null }, { status: 500 });
	}
}