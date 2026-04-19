import { ContactService } from '@/src/services/contact.service';
import { ContactRepository } from '@/src/repositories/contact.repository';
import { revalidateTag } from 'next/cache';
import { createContactData } from '../helpers/factories';

jest.mock('../../src/repositories/contact.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

const MockedRepo = ContactRepository as jest.Mocked<typeof ContactRepository>;

describe('ContactService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getContactData()', () => {
    it('should return contact data', async () => {
      const mockData = createContactData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      const result = await ContactService.getContactData();

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = createContactData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      await ContactService.getContactData(true);

      expect(MockedRepo.findFirst).toHaveBeenCalledTimes(1);
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
      expect(revalidateTag).toHaveBeenCalledWith('contact', { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(ContactService.updateContactData(createContactData())).rejects.toThrow('Contact data not found');
    });
  });
});
