import { CertificateRepository, CertificateData } from '../repositories/certificate.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class CertificateService {
  static async getAllCertificates(bypassCache = false) {
    try {
      const certificates = await getCachedData('certificates_all', () => CertificateRepository.findAll(), { bypass: bypassCache });
      
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
      const certificate = await getCachedData(`certificate_${id}`, () => CertificateRepository.findById(id), { bypass: bypassCache });
      
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
    clearCache('certificates_all');
    return {
      status: 201,
      message: 'Certificate created successfully',
      data: certificate
    };
  }

  static async updateCertificate(id: string, data: Partial<CertificateData>) {
    const certificate = await CertificateRepository.update(id, data);
    if (!certificate) throw new Error('Certificate not found');
    
    clearCache('certificates_all');
    clearCache(`certificate_${id}`);
    
    return {
      status: 200,
      message: 'Certificate updated successfully',
      data: certificate
    };
  }

  static async deleteCertificate(id: string) {
    const success = await CertificateRepository.delete(id);
    if (!success) throw new Error('Certificate not found');
    
    clearCache('certificates_all');
    clearCache(`certificate_${id}`);
    
    return {
      status: 200,
      message: 'Certificate deleted successfully'
    };
  }
}
