import { SkillService } from '@/src/services/skill.service';
import { SkillRepository } from '@/src/repositories/skill.repository';
import { revalidateTag } from 'next/cache';
import { createSkillCategoryData } from '../helpers/factories';

jest.mock('../../src/repositories/skill.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
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
      const mockData = [createSkillCategoryData({ title: 'Web' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await SkillService.getAllSkills();

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = [createSkillCategoryData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      await SkillService.getAllSkills(true);

      expect(MockedRepo.findAll).toHaveBeenCalledTimes(1);
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
      expect(revalidateTag).toHaveBeenCalledWith('skills', 'max');
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
      expect(revalidateTag).toHaveBeenCalledWith('skills', 'max');
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
      expect(revalidateTag).toHaveBeenCalledWith('skills', 'max');
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(SkillService.deleteSkill(99)).rejects.toThrow('Skill category not found');
    });
  });
});
