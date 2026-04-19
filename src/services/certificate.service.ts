import { CertificateRepository, CertificateData } from '../repositories/certificate.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class CertificateService {
  private static getCachedAllCertificates = unstable_cache(
    async () => CertificateRepository.findAll(),
    ['certificates_all'],
    { revalidate: 3600, tags: ['certificates'] }
  );

  private static getCachedCertificateById = (id: string) => unstable_cache(
    async () => CertificateRepository.findById(id),
    [`certificate_${id}`],
    { revalidate: 3600, tags: ['certificates', `certificate_${id}`] }
  )();

  static async getAllCertificates(bypassCache = false) {
    try {
      const certificates = bypassCache
        ? await CertificateRepository.findAll()
        : await this.getCachedAllCertificates();
      
      return {
        status: 200,
        message: 'Certificates retrieved successfully',
        data: certificates
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
          data: null
        };
      }
      return {
        status: 200,
        message: 'Certificate retrieved successfully',
        data: certificate
      };
    } catch (error) {
      console.error('Error in CertificateService.getCertificateById:', error);
      throw new Error('Failed to fetch certificate');
    }
  }

  static async createCertificate(data: CertificateData) {
    const certificate = await CertificateRepository.create(data);
    revalidateTag('certificates', 'max');
    return {
      status: 201,
      message: 'Certificate created successfully',
      data: certificate
    };
  }

  static async updateCertificate(id: string, data: Partial<CertificateData>) {
    const certificate = await CertificateRepository.update(id, data);
    if (!certificate) throw new Error('Certificate not found');
    
    revalidateTag('certificates', 'max');
    revalidateTag(`certificate_${id}`, 'max');
    
    return {
      status: 200,
      message: 'Certificate updated successfully',
      data: certificate
    };
  }

  static async deleteCertificate(id: string) {
    const success = await CertificateRepository.delete(id);
    if (!success) throw new Error('Certificate not found');
    
    revalidateTag('certificates', 'max');
    revalidateTag(`certificate_${id}`, 'max');
    
    return {
      status: 200,
      message: 'Certificate deleted successfully'
    };
  }
}
