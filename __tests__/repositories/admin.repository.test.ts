import { AdminRepository } from '@/src/repositories/admin.repository';
import { mockQuery } from '../__mocks__/db';
import { createAdminData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('AdminRepository', () => {
  describe('findByEmail()', () => {
    it('should return admin by email', async () => {
      const mockAdmin = createAdminData();
      mockQuery.mockResolvedValueOnce({ rows: [mockAdmin] });

      const result = await AdminRepository.findByEmail('admin@example.com');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM admins WHERE email = $1 LIMIT 1', ['admin@example.com']);
      expect(result).toEqual(mockAdmin);
    });

    it('should return null if admin not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AdminRepository.findByEmail('missing@example.com');

      expect(result).toBeNull();
    });
  });
});
