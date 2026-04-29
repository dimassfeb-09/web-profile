import { ExperienceRepository } from '@/src/repositories/experience.repository';
import { mockQuery } from '../__mocks__/db';
import { createExperienceData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('ExperienceRepository', () => {
  describe('findAll()', () => {
    it('should return all experiences with specific order', async () => {
      const mockRows = [
        { id: 1, ...createExperienceData({ role: 'Current' }) },
        { id: 2, ...createExperienceData({ role: 'Past' }) },
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await ExperienceRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('ORDER BY (end_date IS NULL) DESC'), []);
      expect(result).toEqual(mockRows);
    });

    it('should handle limit and offset', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await ExperienceRepository.findAll(5, 10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1 OFFSET $2'),
        [5, 10]
      );
    });
  });

  describe('create()', () => {
    it('should create experience', async () => {
      const input = createExperienceData();
      const expected = { id: 1, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await ExperienceRepository.create(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO experiences'),
        [input.role, input.company, input.start_date, input.end_date, input.description]
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update()', () => {
    it('should update experience', async () => {
      const id = 1;
      const input = createExperienceData({ role: 'Updated Role' });
      const expected = { id, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await ExperienceRepository.update(id, input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE experiences'),
        [input.role, input.company, input.start_date, input.end_date, input.description, id]
      );
      expect(result).toEqual(expected);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await ExperienceRepository.update(999, {} as any);
      expect(result).toBeNull();
    });
  });

  describe('delete()', () => {
    it('should return false when no row deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      let result = await ExperienceRepository.delete('invalid-id' as any);
      expect(result).toBe(false);

      mockQuery.mockResolvedValueOnce({ rowCount: null });
      result = await ExperienceRepository.delete('invalid-id' as any);
      expect(result).toBe(false);
    });

    it('should delete experience', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await ExperienceRepository.delete(1);

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM experiences WHERE id = $1', [1]);
      expect(result).toBe(true);
    });
  });
});
