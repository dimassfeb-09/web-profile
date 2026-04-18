import { CertificateService } from '@/src/services/certificate.service';
import { CertificateRepository } from '@/src/repositories/certificate.repository';
import { clearCache, getCachedData } from '@/src/lib/cache';
import { createCertificateData } from '../helpers/factories';

jest.mock('../../src/repositories/certificate.repository');
jest.mock('../../src/lib/cache', () => ({
  getCachedData: jest.fn(async (key: string, fetcher: () => any) => await fetcher()),
  clearCache: jest.fn(),
}));

const MockedRepo = CertificateRepository as jest.Mocked<typeof CertificateRepository>;

describe('CertificateService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllCertificates()', () => {
    it('should return certificates from cache/repo', async () => {
      const mockData = [createCertificateData({ title: 'C1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await CertificateService.getAllCertificates();

      expect(getCachedData).toHaveBeenCalledWith('certificates_all', expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should throw error when repo fails', async () => {
      MockedRepo.findAll.mockRejectedValueOnce(new Error('Fail'));
      await expect(CertificateService.getAllCertificates()).rejects.toThrow('Failed to fetch certificates');
    });
  });

  describe('getCertificateById()', () => {
    it('should return certificate', async () => {
      const id = '123';
      const mockData = createCertificateData({ id });
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      const result = await CertificateService.getCertificateById(id);

      expect(getCachedData).toHaveBeenCalledWith(`certificate_${id}`, expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should return 404 when not found', async () => {
      MockedRepo.findById.mockResolvedValueOnce(null);
      const result = await CertificateService.getCertificateById('missing');
      expect(result.status).toBe(404);
    });

    it('should throw error when repo fails', async () => {
      MockedRepo.findById.mockRejectedValueOnce(new Error('Fail'));
      await expect(CertificateService.getCertificateById('123')).rejects.toThrow('Failed to fetch certificate');
    });
  });

  describe('createCertificate()', () => {
    it('should create and clear cache', async () => {
      const input = createCertificateData();
      const created = { id: 'abc', ...input };
      MockedRepo.create.mockResolvedValueOnce(created);

      const result = await CertificateService.createCertificate(input);

      expect(MockedRepo.create).toHaveBeenCalledWith(input);
      expect(clearCache).toHaveBeenCalledWith('certificates_all');
      expect(result.status).toBe(201);
    });
  });

  describe('updateCertificate()', () => {
    it('should update and clear cache', async () => {
      const id = 'uuid-123';
      const input = { title: 'New' };
      const updated = { id, ...createCertificateData(input) };
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await CertificateService.updateCertificate(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(clearCache).toHaveBeenCalledWith('certificates_all');
      expect(clearCache).toHaveBeenCalledWith(`certificate_${id}`);
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(CertificateService.updateCertificate('invalid', {})).rejects.toThrow('Certificate not found');
    });
  });

  describe('deleteCertificate()', () => {
    it('should delete and clear cache', async () => {
      const id = '123';
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await CertificateService.deleteCertificate(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(clearCache).toHaveBeenCalledWith('certificates_all');
      expect(clearCache).toHaveBeenCalledWith(`certificate_${id}`);
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(CertificateService.deleteCertificate('invalid')).rejects.toThrow('Certificate not found');
    });
  });
});
