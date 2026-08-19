import { HomeService } from '../../../services/home.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await HomeService.getHomeData(true);

	const data = response.data || {
		badge_text: '',
		headline: '',
		subheadline: '',
		description: '',
		cv_url: ''
	};

	return { home: data };
};