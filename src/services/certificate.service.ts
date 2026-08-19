import { CertificateRepository } from '../repositories/certificate.repository';
import type { CertificateData } from '../repositories/certificate.repository';
import { cached, revalidateTag } from '$lib/cache';

export class CertificateService {
	private static getCachedAllCertificates = (sort: 'newest' | 'oldest') =>
		cached(`certificates_all_${sort}`, () => CertificateRepository.findAll(sort), {
			ttl: 3600,
			tags: ['certificates'],
		});

	private static getCachedCertificateById = (id: string) =>
		cached(`certificate_${id}`, () => CertificateRepository.findById(id), {
			ttl: 3600,
			tags: ['certificates', `certificate_${id}`],
		});

	static async getAllCertificates(bypassCache = false, sort: 'newest' | 'oldest' = 'newest') {
		try {
			const certificates = bypassCache
				? await CertificateRepository.findAll(sort)
				: await this.getCachedAllCertificates(sort);

			return {
				status: 200,
				message: 'Certificates retrieved successfully',
				data: certificates,
			};
		} catch (error) {
			console.error('Error in CertificateService.getAllCertificates:', error);
			throw new Error('Failed to fetch certificates');
		}
	}

	static async getCertificateById(id: string, bypassCache = false) {
		try {
			const certificate = bypassCache
				? await CertificateRepository.findById(id)
				: await this.getCachedCertificateById(id);

			if (!certificate) {
				return {
					status: 404,
					message: 'Certificate not found',
					data: null,
				};
			}
			return {
				status: 200,
				message: 'Certificate retrieved successfully',
				data: certificate,
			};
		} catch (error) {
			console.error('Error in CertificateService.getCertificateById:', error);
			throw new Error('Failed to fetch certificate');
		}
	}

	static async createCertificate(data: CertificateData) {
		const certificate = await CertificateRepository.create(data);
		revalidateTag('certificates');
		return {
			status: 201,
			message: 'Certificate created successfully',
			data: certificate,
		};
	}

	static async updateCertificate(id: string, data: Partial<CertificateData>) {
		const certificate = await CertificateRepository.update(id, data);
		if (!certificate) throw new Error('Certificate not found');

		revalidateTag('certificates');
		revalidateTag(`certificate_${id}`);

		return {
			status: 200,
			message: 'Certificate updated successfully',
			data: certificate,
		};
	}

	static async deleteCertificate(id: string) {
		const success = await CertificateRepository.delete(id);
		if (!success) throw new Error('Certificate not found');

		revalidateTag('certificates');
		revalidateTag(`certificate_${id}`);

		return {
			status: 200,
			message: 'Certificate deleted successfully',
		};
	}
}