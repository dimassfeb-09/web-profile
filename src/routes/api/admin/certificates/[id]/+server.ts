import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { CertificateService } from '../../../../../services/certificate.service';

const CertificateSchema = z.object({
	title: z.string().min(1).max(255),
	issuer: z.string().min(1).max(255),
	issue_date: z.string().nullable(),
	credential_url: z.string().url().nullable().or(z.literal('')),
	image_url: z.string().url().nullable().or(z.literal('')),
});

export async function PUT({ params, request }) {
	try {
		const body = await request.json();
		const data = CertificateSchema.partial().parse(body);
		const result = await CertificateService.updateCertificate(params.id, data);
		return json(result, { status: result.status });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return json({ status: 400, message: error.issues[0].message }, { status: 400 });
		}
		console.error('[Admin Certificate PUT] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}

export async function DELETE({ params }) {
	try {
		const result = await CertificateService.deleteCertificate(params.id);
		return json(result, { status: result.status });
	} catch (error) {
		console.error('[Admin Certificate DELETE] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
