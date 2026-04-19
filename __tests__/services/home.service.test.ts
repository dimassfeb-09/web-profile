import { HomeService } from '@/src/services/home.service';
import { HomeRepository } from '@/src/repositories/home.repository';
import { revalidateTag } from 'next/cache';
import { createHomeData } from '../helpers/factories';

jest.mock('../../src/repositories/home.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
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

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = createHomeData();
      MockedRepo.findFirst.mockResolvedValueOnce(mockData);

      await HomeService.getHomeData(true);

      expect(MockedRepo.findFirst).toHaveBeenCalledTimes(1);
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
      expect(revalidateTag).toHaveBeenCalledWith('home', { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(HomeService.updateHomeData(createHomeData())).rejects.toThrow('Home data not found');
    });
  });
});
