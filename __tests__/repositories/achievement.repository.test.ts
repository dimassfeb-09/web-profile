import { AchievementRepository } from '@/src/repositories/achievement.repository';
import { mockQuery } from '../__mocks__/db';
import { createAchievementData } from '../helpers/factories';

// Mock the DB pool
jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('AchievementRepository', () => {
  describe('findAll()', () => {
    it('should return all achievements ordered by created_at DESC', async () => {
      const mockRows = [
        createAchievementData({ id: '1', title: 'Achievement 1' }),
        createAchievementData({ id: '2', title: 'Achievement 2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await AchievementRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM achievements ORDER BY created_at DESC');
      expect(result).toEqual(mockRows);
    });

    it('should throw error when database query fails', async () => {
      const error = new Error('Database connection failed');
      mockQuery.mockRejectedValueOnce(error);

      await expect(AchievementRepository.findAll()).rejects.toThrow('Database connection failed');
    });
  });

  describe('findById()', () => {
    it('should return achievement when valid id provided', async () => {
      const mockData = createAchievementData({ id: 'uuid-123' });
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await AchievementRepository.findById('uuid-123');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM achievements WHERE id = $1', ['uuid-123']);
      expect(result).toEqual(mockData);
    });

    it('should return null when achievement not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AchievementRepository.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create()', () => {
    it('should insert achievement and return the created row', async () => {
      const input = createAchievementData({ title: 'New Achievement' });
      const expected = { id: 'new-id', ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await AchievementRepository.create(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO achievements'),
        [input.title, input.description, input.image_url, input.date]
      );
      expect(result).toEqual(expected);
    });
  });

  describe('update()', () => {
    it('should update and return updated achievement', async () => {
      const id = 'uuid-123';
      const input = createAchievementData({ title: 'Updated Title' });
      const expected = { id, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await AchievementRepository.update(id, input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE achievements'),
        [input.title, input.description, input.image_url, input.date, id]
      );
      expect(result).toEqual(expected);
    });

    it('should return null when achievement not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await AchievementRepository.update('non-existent', {});

      expect(result).toBeNull();
    });
  });

  describe('delete()', () => {
    it('should return true when delete successful', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await AchievementRepository.delete('uuid-123');

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM achievements WHERE id = $1', ['uuid-123']);
      expect(result).toBe(true);
    });

    it('should return false when no row deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      let result = await AchievementRepository.delete('invalid-id');
      expect(result).toBe(false);

      mockQuery.mockResolvedValueOnce({ rowCount: null });
      result = await AchievementRepository.delete('invalid-id');
      expect(result).toBe(false);
    });
  });
});
