import { AboutService } from '../../../services/about.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await AboutService.getAboutData(true);
	const data = response.data || { headline: '', paragraphs: [] };
	return { about: data };
};