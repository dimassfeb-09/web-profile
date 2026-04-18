import { SkillService } from '@/src/services/skill.service';
import { SkillRepository } from '@/src/repositories/skill.repository';
import { getCachedData, clearCache } from '@/src/lib/cache';
import { createSkillCategoryData } from '../helpers/factories';

jest.mock('../../src/repositories/skill.repository');
jest.mock('../../src/lib/cache', () => ({
  getCachedData: jest.fn(async (key: string, fetcher: () => any) => await fetcher()),
  clearCache: jest.fn(),
}));

const MockedRepo = SkillRepository as jest.Mocked<typeof SkillRepository>;

describe('SkillService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllSkills()', () => {
    it('should return skills', async () => {
      const mockData = [createSkillCategoryData({ title: 'Skill 1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await SkillService.getAllSkills();

      expect(getCachedData).toHaveBeenCalledWith('skills_data', expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should throw error when repo fails', async () => {
      MockedRepo.findAll.mockRejectedValueOnce(new Error('Fail'));
      await expect(SkillService.getAllSkills()).rejects.toThrow('Failed to fetch skills');
    });
  });

  describe('createSkill()', () => {
    it('should create and clear cache', async () => {
      const input = createSkillCategoryData();
      const created = { id: 1, ...input };
      MockedRepo.create.mockResolvedValueOnce(created);

      const result = await SkillService.createSkill(input);

      expect(MockedRepo.create).toHaveBeenCalledWith(input);
      expect(clearCache).toHaveBeenCalledWith('skills_data');
      expect(result.status).toBe(201);
    });
  });

  describe('updateSkill()', () => {
    it('should update and clear cache', async () => {
      const id = 1;
      const input = { title: 'New' };
      const updated = { id, ...createSkillCategoryData(input) };
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await SkillService.updateSkill(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(clearCache).toHaveBeenCalledWith('skills_data');
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(SkillService.updateSkill(99, {})).rejects.toThrow('Skill category not found');
    });
  });

  describe('deleteSkill()', () => {
    it('should delete and clear cache', async () => {
      const id = 1;
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await SkillService.deleteSkill(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(clearCache).toHaveBeenCalledWith('skills_data');
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(SkillService.deleteSkill(99)).rejects.toThrow('Skill category not found');
    });
  });
});
