import { ExperienceService } from '../../../services/experience.service';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
	const limit = Number(url.searchParams.get('limit')) || 4;
	const offset = Number(url.searchParams.get('offset')) || 0;

	try {
		const result = await ExperienceService.getAllExperiences(false, limit, offset);
		return json(result);
	} catch (error) {
		console.error('Error in GET /api/experience:', error);
		return json({ status: 500, message: 'Failed to fetch experiences', data: null }, { status: 500 });
	}
}