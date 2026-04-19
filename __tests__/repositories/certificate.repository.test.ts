import { CertificateRepository } from '@/src/repositories/certificate.repository';
import { mockQuery } from '../__mocks__/db';
import { createCertificateData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('CertificateRepository', () => {
  describe('findAll()', () => {
    it('should return all certificates ordered by created_at DESC (default)', async () => {
      const mockRows = [
        createCertificateData({ id: '1', title: 'Cert 1' }),
        createCertificateData({ id: '2', title: 'Cert 2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await CertificateRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM certificates ORDER BY created_at DESC');
      expect(result).toEqual(mockRows);
    });

    it('should return all certificates ordered by created_at ASC (oldest)', async () => {
      const mockRows = [
        createCertificateData({ id: '2', title: 'Cert 2' }),
        createCertificateData({ id: '1', title: 'Cert 1' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await CertificateRepository.findAll('oldest');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM certificates ORDER BY created_at ASC');
      expect(result).toEqual(mockRows);
    });
  });

  describe('findById()', () => {
    it('should return certificate by id', async () => {
      const mockData = createCertificateData({ id: 'uuid-123' });
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await CertificateRepository.findById('uuid-123');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM certificates WHERE id = $1', ['uuid-123']);
      expect(result).toEqual(mockData);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await CertificateRepository.findById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('create()', () => {
    it('should create certificate', async () => {
      const input = createCertificateData();
      const expected = { id: 'new-id', ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await CertificateRepository.create(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO certificates'),
        [input.title, input.issuer, input.issue_date, input.credential_url, input.image_url, input.description]
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update()', () => {
    it('should update certificate', async () => {
      const id = 'uuid-123';
      const input = createCertificateData({ title: 'Updated Cert' });
      const expected = { id, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await CertificateRepository.update(id, input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE certificates'),
        [input.title, input.issuer, input.issue_date, input.credential_url, input.image_url, input.description, id]
      );
      expect(result).toEqual(expected);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await CertificateRepository.update('non-existent', {} as any);
      expect(result).toBeNull();
    });
  });

  describe('delete()', () => {
    it('should return false when no row deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      let result = await CertificateRepository.delete('invalid-id');
      expect(result).toBe(false);

      mockQuery.mockResolvedValueOnce({ rowCount: null });
      result = await CertificateRepository.delete('invalid-id');
      expect(result).toBe(false);
    });

    it('should delete certificate', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await CertificateRepository.delete('uuid-123');

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM certificates WHERE id = $1', ['uuid-123']);
      expect(result).toBe(true);
    });
  });
});
