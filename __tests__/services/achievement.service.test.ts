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

  describe('getAchievementBySlug()', () => {
    it('should return achievement by slug', async () => {
      const slug = 'test-slug';
      const mockData = createAchievementData({ slug });
      MockedRepo.findBySlug.mockResolvedValueOnce(mockData);

      const result = await AchievementService.getAchievementBySlug(slug);

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const slug = 'test-slug';
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      await AchievementService.getAchievementBySlug(slug, true);
      expect(MockedRepo.findBySlug).toHaveBeenCalledWith(slug);
    });

    it('should redirect if slug is a UUID and found by id', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      const mockData = createAchievementData({ id: uuid, slug: 'real-slug' });
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      const result = await AchievementService.getAchievementBySlug(uuid);

      expect(result.status).toBe(301);
      expect(result.data).toBe('real-slug');
    });

    it('should return 404 if slug is UUID but id not found', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      MockedRepo.findById.mockResolvedValueOnce(null);

      const result = await AchievementService.getAchievementBySlug(uuid);
      expect(result.status).toBe(404);
    });

    it('should return 404 if slug is UUID but has no slug property', async () => {
      const uuid = '550e8400-e29b-41d4-a716-446655440000';
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      MockedRepo.findById.mockResolvedValueOnce({ id: uuid } as any);

      const result = await AchievementService.getAchievementBySlug(uuid);
      expect(result.status).toBe(404);
    });

    it('should redirect if slug found in history', async () => {
      const oldSlug = 'old-slug';
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      MockedRepo.findSlugByHistory.mockResolvedValueOnce('new-slug');

      const result = await AchievementService.getAchievementBySlug(oldSlug);

      expect(result.status).toBe(301);
      expect(result.data).toBe('new-slug');
    });

    it('should return 404 if not found anywhere', async () => {
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      MockedRepo.findSlugByHistory.mockResolvedValueOnce(null);

      const result = await AchievementService.getAchievementBySlug('missing');

      expect(result.status).toBe(404);
    });

    it('should throw error when repo fails for slug', async () => {
      MockedRepo.findBySlug.mockRejectedValueOnce(new Error('Fail'));
      await expect(AchievementService.getAchievementBySlug('test')).rejects.toThrow('Failed to fetch achievement');
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
      const existing = createAchievementData({ id, slug: 'old-slug' });
      MockedRepo.findById.mockResolvedValueOnce(existing);
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await AchievementService.updateAchievement(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`achievement_id_${id}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw error when achievement not found', async () => {
      MockedRepo.findById.mockResolvedValueOnce(null);

      await expect(AchievementService.updateAchievement('invalid', {}))
        .rejects.toThrow('Achievement not found');
    });

    it('should handle slug change and add history', async () => {
      const id = 'uuid-123';
      const existing = createAchievementData({ id, slug: 'old-slug' });
      const input = { slug: 'new-slug' };
      const updated = { ...existing, ...input };
      
      MockedRepo.findById.mockResolvedValueOnce(existing);
      MockedRepo.update.mockResolvedValueOnce(updated);
      MockedRepo.addSlugHistory.mockResolvedValueOnce();

      await AchievementService.updateAchievement(id, input);

      expect(MockedRepo.addSlugHistory).toHaveBeenCalledWith(id, 'old-slug');
      expect(revalidateTag).toHaveBeenCalledWith('achievement_slug_new-slug', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith('achievement_slug_old-slug', { expire: 0 });
    });

    it('should handle same slug during update', async () => {
      const id = 'uuid-123';
      const existing = createAchievementData({ id, slug: 's' });
      MockedRepo.findById.mockResolvedValueOnce(existing);
      MockedRepo.update.mockResolvedValueOnce(existing);
      await AchievementService.updateAchievement(id, { slug: 's' });
      expect(MockedRepo.addSlugHistory).not.toHaveBeenCalled();
    });

    it('should not revalidate slug if achievement has no slug after update', async () => {
      const id = '123';
      MockedRepo.findById.mockResolvedValueOnce(createAchievementData({ id, slug: 's' }));
      MockedRepo.update.mockResolvedValueOnce({ id, title: 'T' } as any);
      await AchievementService.updateAchievement(id, {});
      expect(revalidateTag).not.toHaveBeenCalledWith('achievement_slug_undefined', { expire: 0 });
    });

    it('should throw error when update fails', async () => {
      const id = 'uuid-123';
      MockedRepo.findById.mockResolvedValueOnce(createAchievementData({ id }));
      MockedRepo.update.mockResolvedValueOnce(null);

      await expect(AchievementService.updateAchievement(id, {}))
        .rejects.toThrow('Failed to update achievement');
    });
  });

  describe('deleteAchievement()', () => {
    it('should delete and clear cache', async () => {
      const id = 'uuid-123';
      const existing = createAchievementData({ id, slug: 'deleted-slug' });
      MockedRepo.findById.mockResolvedValueOnce(existing);
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await AchievementService.deleteAchievement(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`achievement_id_${id}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw error when deletion failure', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(AchievementService.deleteAchievement('invalid'))
        .rejects.toThrow('Achievement not found');
    });

    it('should not revalidate slug tag if achievement has no slug on delete', async () => {
      const id = 'uuid-123';
      MockedRepo.findById.mockResolvedValueOnce({ id } as any);
      MockedRepo.delete.mockResolvedValueOnce(true);
      await AchievementService.deleteAchievement(id);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
    });

    it('should handle achievement being null on delete revalidation', async () => {
      const id = 'uuid-123';
      MockedRepo.findById.mockResolvedValueOnce(null);
      MockedRepo.delete.mockResolvedValueOnce(true);
      await AchievementService.deleteAchievement(id);
      expect(revalidateTag).toHaveBeenCalledWith('achievements', { expire: 0 });
    });
  });
});
