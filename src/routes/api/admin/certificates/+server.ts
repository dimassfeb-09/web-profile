import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { CertificateService } from '../../../../services/certificate.service';
import { CertificateSchema } from '$lib/schemas/admin.schemas';

export async function GET({ url }) {
	try {
		const sort = url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest';
		const result = await CertificateService.getAllCertificates(true, sort);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Certificate GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function POST({ request }) {
	try {
		const body = await request.json();
		const data = CertificateSchema.parse(body);
		const result = await CertificateService.createCertificate(data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Certificate POST] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
