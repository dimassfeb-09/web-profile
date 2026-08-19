import { ContactService } from '../../../services/contact.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const response = await ContactService.getContactData(true);

	const data = response.data || {
		headline: '',
		description: '',
		email: '',
		linkedin_url: '',
		github_url: '',
		instagram_url: '',
		twitter_url: ''
	};

	return { contact: data };
};