import { ExperienceService } from '@/src/services/experience.service';
import { ExperienceRepository } from '@/src/repositories/experience.repository';
import { revalidateTag } from 'next/cache';
import { createExperienceData } from '../helpers/factories';

jest.mock('../../src/repositories/experience.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

const MockedRepo = ExperienceRepository as jest.Mocked<typeof ExperienceRepository>;

describe('ExperienceService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllExperiences()', () => {
    it('should return experiences', async () => {
      const mockData = [createExperienceData({ role: 'Lead' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await ExperienceService.getAllExperiences();

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = [createExperienceData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      await ExperienceService.getAllExperiences(true);

      expect(MockedRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('should throw error when repo fails', async () => {
      MockedRepo.findAll.mockRejectedValueOnce(new Error('Fail'));
      await expect(ExperienceService.getAllExperiences()).rejects.toThrow('Failed to fetch experiences');
    });
  });

  describe('createExperience()', () => {
    it('should create and clear cache', async () => {
      const input = createExperienceData();
      const created = { id: 1, ...input };
      MockedRepo.create.mockResolvedValueOnce(created);

      const result = await ExperienceService.createExperience(input);

      expect(MockedRepo.create).toHaveBeenCalledWith(input);
      expect(revalidateTag).toHaveBeenCalledWith('experience', { expire: 0 });
      expect(result.status).toBe(201);
    });

    it('should throw error when end_date is earlier than start_date', async () => {
      const input = createExperienceData({ 
        start_date: '2023-01-01', 
        end_date: '2022-01-01' 
      });
      await expect(ExperienceService.createExperience(input)).rejects.toThrow('End date cannot be earlier than start date');
    });
  });

  describe('updateExperience()', () => {
    it('should update and clear cache', async () => {
      const id = 1;
      const input = { role: 'Senior LEAD' };
      const updated = { id, ...createExperienceData(input) };
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await ExperienceService.updateExperience(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(revalidateTag).toHaveBeenCalledWith('experience', { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when date validation fails', async () => {
      const input = { start_date: '2023-01-01', end_date: '2022-01-01' };
      await expect(ExperienceService.updateExperience(1, input)).rejects.toThrow('End date cannot be earlier than start date');
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(ExperienceService.updateExperience(99, {})).rejects.toThrow('Experience not found');
    });
  });

  describe('deleteExperience()', () => {
    it('should delete and clear cache', async () => {
      const id = 1;
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await ExperienceService.deleteExperience(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(revalidateTag).toHaveBeenCalledWith('experience', { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(ExperienceService.deleteExperience(99)).rejects.toThrow('Experience not found');
    });
  });
});
