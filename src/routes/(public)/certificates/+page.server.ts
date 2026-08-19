import { CertificateService } from '../../../services/certificate.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const response = await CertificateService.getAllCertificates(false, sort);
	return { certificates: response.data || [] };
};