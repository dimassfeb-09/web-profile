import { HomeService } from '@/src/services/home.service';
import { HomeRepository } from '@/src/repositories/home.repository';
import { getCachedData, clearCache } from '@/src/lib/cache';
import { createHomeData } from '../helpers/factories';

jest.mock('../../src/repositories/home.repository');
jest.mock('../../src/lib/cache', () => ({
  getCachedData: jest.fn(async (key: string, fetcher: () => any) => await fetcher()),
  clearCache: jest.fn(),
}));

const MockedRepo = HomeRepository as jest.Mocked<typeof HomeRepository>;

describe('HomeService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getHomeData()', () => {
    it('should return home data', async () => {
      const mockData = createHomeData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      const result = await HomeService.getHomeData();

      expect(getCachedData).toHaveBeenCalledWith('home_data', expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should return 404 when missing', async () => {
      MockedRepo.findFirst.mockResolvedValueOnce(null);
      const result = await HomeService.getHomeData();
      expect(result.status).toBe(404);
      expect(result.message).toBe('Home data not found');
    });

    it('should throw when repo fails', async () => {
      MockedRepo.findFirst.mockRejectedValueOnce(new Error('Fail'));
      await expect(HomeService.getHomeData()).rejects.toThrow('Failed to fetch home data');
    });
  });

  describe('updateHomeData()', () => {
    it('should update and clear cache', async () => {
      const input = createHomeData({ headline: 'New' });
      MockedRepo.update.mockResolvedValueOnce(input);

      const result = await HomeService.updateHomeData(input);

      expect(MockedRepo.update).toHaveBeenCalledWith(input);
      expect(clearCache).toHaveBeenCalledWith('home_data');
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(HomeService.updateHomeData(createHomeData())).rejects.toThrow('Home data not found');
    });
  });
});
