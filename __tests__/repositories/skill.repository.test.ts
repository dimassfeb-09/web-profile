import { SkillRepository } from '@/src/repositories/skill.repository';
import { mockQuery } from '../__mocks__/db';
import { createSkillCategoryData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('SkillRepository', () => {
  describe('findAll()', () => {
    it('should return all skill categories ordered by id ASC', async () => {
      const mockRows = [
        { id: 1, ...createSkillCategoryData({ title: 'Backend' }) },
        { id: 2, ...createSkillCategoryData({ title: 'Frontend' }) },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await SkillRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM skill_categories ORDER BY id ASC');
      expect(result).toEqual(mockRows);
    });
  });

  describe('create()', () => {
    it('should create skill category', async () => {
      const input = createSkillCategoryData();
      const expected = { id: 1, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await SkillRepository.create(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO skill_categories'),
        [input.icon, input.title, input.skills, input.color_class, input.delay_class]
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update()', () => {
    it('should update skill category', async () => {
      const id = 1;
      const input = createSkillCategoryData({ title: 'DevOps' });
      const expected = { id, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await SkillRepository.update(id, input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE skill_categories'),
        [input.icon, input.title, input.skills, input.color_class, input.delay_class, id]
      );
      expect(result).toEqual(expected);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await SkillRepository.update(1, {} as any);
      expect(result).toBeNull();
    });
  });

  describe('delete()', () => {
    it('should delete skill category', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await SkillRepository.delete(1);

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM skill_categories WHERE id = $1', [1]);
      expect(result).toBe(true);
    });

    it('should return false if rowCount is 0 or null', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      let result = await SkillRepository.delete(1);
      expect(result).toBe(false);

      mockQuery.mockResolvedValueOnce({ rowCount: null });
      result = await SkillRepository.delete(1);
      expect(result).toBe(false);
    });
  });
});
