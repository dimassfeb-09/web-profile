import { AboutService } from '@/src/services/about.service';
import { AboutRepository } from '@/src/repositories/about.repository';
import { revalidateTag } from 'next/cache';
import { createAboutData } from '../helpers/factories';

jest.mock('../../src/repositories/about.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

const MockedRepo = AboutRepository as jest.Mocked<typeof AboutRepository>;

describe('AboutService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAboutData()', () => {
    it('should return about data', async () => {
      const mockData = createAboutData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      const result = await AboutService.getAboutData();

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = createAboutData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      await AboutService.getAboutData(true);

      expect(MockedRepo.findFirst).toHaveBeenCalledTimes(1);
    });

    it('should return 404 when missing', async () => {
      MockedRepo.findFirst.mockResolvedValueOnce(null);
      const result = await AboutService.getAboutData();
      expect(result.status).toBe(404);
      expect(result.message).toBe('About data not found');
    });

    it('should throw when repo fails', async () => {
      MockedRepo.findFirst.mockRejectedValueOnce(new Error('Fail'));
      await expect(AboutService.getAboutData()).rejects.toThrow('Failed to fetch about data');
    });
  });

  describe('updateAboutData()', () => {
    it('should update and clear cache', async () => {
      const input = createAboutData({ headline: 'Update' });
      MockedRepo.update.mockResolvedValueOnce(input);

      const result = await AboutService.updateAboutData(input);

      expect(MockedRepo.update).toHaveBeenCalledWith(input);
      expect(revalidateTag).toHaveBeenCalledWith('about', { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(AboutService.updateAboutData(createAboutData())).rejects.toThrow('About data not found');
    });
  });
});
