import { ContactService } from '@/src/services/contact.service';
import { ContactRepository } from '@/src/repositories/contact.repository';
import { getCachedData, clearCache } from '@/src/lib/cache';
import { createContactData } from '../helpers/factories';

jest.mock('../../src/repositories/contact.repository');
jest.mock('../../src/lib/cache', () => ({
  getCachedData: jest.fn(async (key: string, fetcher: () => any) => await fetcher()),
  clearCache: jest.fn(),
}));

const MockedRepo = ContactRepository as jest.Mocked<typeof ContactRepository>;

describe('ContactService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getContactData()', () => {
    it('should return contact data', async () => {
      const mockData = createContactData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      const result = await ContactService.getContactData();

      expect(getCachedData).toHaveBeenCalledWith('contact_data', expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should return 404 when missing', async () => {
      MockedRepo.findFirst.mockResolvedValueOnce(null);
      const result = await ContactService.getContactData();
      expect(result.status).toBe(404);
      expect(result.message).toBe('Contact data not found');
    });

    it('should throw when repo fails', async () => {
      MockedRepo.findFirst.mockRejectedValueOnce(new Error('Fail'));
      await expect(ContactService.getContactData()).rejects.toThrow('Failed to fetch contact data');
    });
  });

  describe('updateContactData()', () => {
    it('should update and clear cache', async () => {
      const input = createContactData({ email: 'new@example.com' });
      MockedRepo.update.mockResolvedValueOnce(input);

      const result = await ContactService.updateContactData(input);

      expect(MockedRepo.update).toHaveBeenCalledWith(input);
      expect(clearCache).toHaveBeenCalledWith('contact_data');
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(ContactService.updateContactData(createContactData())).rejects.toThrow('Contact data not found');
    });
  });
});
