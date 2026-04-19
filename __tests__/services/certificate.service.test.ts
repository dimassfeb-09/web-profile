import { CertificateService } from '@/src/services/certificate.service';
import { CertificateRepository } from '@/src/repositories/certificate.repository';
import { revalidateTag } from 'next/cache';
import { createCertificateData } from '../helpers/factories';

jest.mock('../../src/repositories/certificate.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
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

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = [createCertificateData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      await CertificateService.getAllCertificates(true);

      expect(MockedRepo.findAll).toHaveBeenCalledTimes(1);
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

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache for single certificate when requested', async () => {
      const id = '123';
      const mockData = createCertificateData({ id });
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      await CertificateService.getCertificateById(id, true);

      expect(MockedRepo.findById).toHaveBeenCalledWith(id);
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
      expect(revalidateTag).toHaveBeenCalledWith('certificates', { expire: 0 });
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
      expect(revalidateTag).toHaveBeenCalledWith('certificates', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`certificate_${id}`, { expire: 0 });
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
      expect(revalidateTag).toHaveBeenCalledWith('certificates', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`certificate_${id}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(CertificateService.deleteCertificate('invalid')).rejects.toThrow('Certificate not found');
    });
  });
});
