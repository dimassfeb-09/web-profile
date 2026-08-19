import { CertificateService } from '../../../services/certificate.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
	const response = await CertificateService.getAllCertificates(true, sort);

	const mappedData = response.data.map((cert) => ({
		id: cert.id || '',
		title: cert.title,
		issuer: cert.issuer,
		issue_date: cert.issue_date
			? cert.issue_date instanceof Date
				? cert.issue_date.toISOString()
				: cert.issue_date
			: '',
		credential_url: cert.credential_url,
		image_url: cert.image_url,
		description: cert.description
	}));

	return { certificates: mappedData };
};