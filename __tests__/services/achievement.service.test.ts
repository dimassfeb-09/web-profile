import { AchievementService } from '@/src/services/achievement.service';
import { AchievementRepository } from '@/src/repositories/achievement.repository';
import { revalidateTag } from 'next/cache';
import { createAchievementData } from '../helpers/factories';

// Mock dependencies
jest.mock('../../src/repositories/achievement.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

const MockedRepo = AchievementRepository as jest.Mocked<typeof AchievementRepository>;

describe('AchievementService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllAchievements()', () => {
    it('should return achievements with default sort', async () => {
      const mockData = [createAchievementData({ title: 'A1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await AchievementService.getAllAchievements();

      expect(MockedRepo.findAll).toHaveBeenCalledWith('newest');
      expect(result.data).toEqual(mockData);
    });

    it('should return achievements with oldest sort', async () => {
      const mockData = [createAchievementData({ title: 'A1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await AchievementService.getAllAchievements(false, 'oldest');

      expect(MockedRepo.findAll).toHaveBeenCalledWith('oldest');
      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = [createAchievementData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      await AchievementService.getAllAchievements(true);

      expect(MockedRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repository fails', async () => {
      MockedRepo.findAll.mockRejectedValueOnce(new Error('Repo failed'));

      try {
        await AchievementService.getAllAchievements();
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(err.message).toBe('Failed to fetch achievements');
      }
    });
  });

  describe('getAchievementById()', () => {
    it('should return achievement through cache', async () => {
      const id = 'uuid-123';
      const mockData = createAchievementData({ id });
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      const result = await AchievementService.getAchievementById(id);

      expect(result).toEqual({
        status: 200,
        message: 'Achievement retrieved successfully',
        data: mockData,
      });
    });

    it('should bypass cache for single achievement when requested', async () => {
      const id = 'uuid-123';
      const mockData = createAchievementData({ id });
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      await AchievementService.getAchievementById(id, true);

      expect(MockedRepo.findById).toHaveBeenCalledWith(id);
    });

    it('should return 404 when achievement not found', async () => {
      const id = 'not-found';
      MockedRepo.findById.mockResolvedValueOnce(null);

      const result = await AchievementService.getAchievementById(id);

      expect(result).toEqual({
        status: 404,
        message: 'Achievement not found',
        data: null,
      });
    });

    it('should throw error when repository fails', async () => {
      MockedRepo.findById.mockRejectedValueOnce(new Error('Repo failed'));

      try {
        await AchievementService.getAchievementById('123');
        throw new Error('Should have thrown');
      } catch (err: any) {
        expect(err.message).toBe('Failed to fetch achievement');
      }
    });
  });

  describe('createAchievement()', () => {
    it('should create achievement and clear cache', async () => {
      const input = createAchievementData();
      const created = { id: 'new-id', ...input };
      MockedRepo.create.mockResolvedValueOnce(created);

      const result = await AchievementService.createAchievement(input);

      expect(MockedRepo.create).toHaveBeenCalledWith(input);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
      expect(result).toEqual({
        status: 201,
        message: 'Achievement created successfully',
        data: created,
      });
    });
  });

  describe('updateAchievement()', () => {
    it('should update achievement and clear specific cache', async () => {
      const id = 'uuid-123';
      const input = { title: 'Updated' };
      const updated = { id, ...createAchievementData(input) };
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await AchievementService.updateAchievement(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`achievement_${id}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw error when achievement not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);

      await expect(AchievementService.updateAchievement('invalid', {}))
        .rejects.toThrow('Achievement not found');
    });
  });

  describe('deleteAchievement()', () => {
    it('should delete and clear cache', async () => {
      const id = 'uuid-123';
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await AchievementService.deleteAchievement(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`achievement_${id}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw error when deletion failure', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);

      await expect(AchievementService.deleteAchievement('invalid'))
        .rejects.toThrow('Achievement not found');
    });
  });
});
