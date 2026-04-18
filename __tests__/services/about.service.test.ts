import { AboutService } from '@/src/services/about.service';
import { AboutRepository } from '@/src/repositories/about.repository';
import { getCachedData, clearCache } from '@/src/lib/cache';
import { createAboutData } from '../helpers/factories';

jest.mock('../../src/repositories/about.repository');
jest.mock('../../src/lib/cache', () => ({
  getCachedData: jest.fn(async (key: string, fetcher: () => any) => await fetcher()),
  clearCache: jest.fn(),
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

      expect(getCachedData).toHaveBeenCalledWith('about_data', expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
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
      expect(clearCache).toHaveBeenCalledWith('about_data');
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(AboutService.updateAboutData(createAboutData())).rejects.toThrow('About data not found');
    });
  });
});
