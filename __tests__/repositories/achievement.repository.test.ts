import { AchievementRepository } from '@/src/repositories/achievement.repository';
import { mockQuery } from '../__mocks__/db';
import { createAchievementData } from '../helpers/factories';

// Mock the DB pool
jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('AchievementRepository', () => {
  describe('findAll()', () => {
    it('should return all achievements ordered by created_at DESC (default)', async () => {
      const mockRows = [
        createAchievementData({ id: '1', title: 'Achievement 1' }),
        createAchievementData({ id: '2', title: 'Achievement 2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await AchievementRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM achievements ORDER BY created_at DESC');
      expect(result).toEqual(mockRows);
    });

    it('should return all achievements ordered by created_at ASC (oldest)', async () => {
      const mockRows = [
        createAchievementData({ id: '2', title: 'Achievement 2' }),
        createAchievementData({ id: '1', title: 'Achievement 1' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await AchievementRepository.findAll('oldest');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM achievements ORDER BY created_at ASC');
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

  describe('findBySlug()', () => {
    it('should return achievement by slug', async () => {
      const mockData = createAchievementData({ slug: 'test-slug' });
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await AchievementRepository.findBySlug('test-slug');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM achievements WHERE slug = $1', ['test-slug']);
      expect(result).toEqual(mockData);
    });

    it('should return null if slug not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await AchievementRepository.findBySlug('missing');
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
        [
          input.title,
          input.slug,
          input.description,
          input.image_url,
          input.date,
          input.event_organizer ?? null,
          input.category ?? null,
          input.team_members ?? null,
          input.tech_stack ?? null,
          input.problem_statement ?? null,
          input.solution_overview ?? null,
          input.credential_url ?? null,
          input.image_hash ?? null,
        ]
      );
      expect(result).toEqual(expected);
    });

    it('should create achievement with minimal data (null branches)', async () => {
      const input = { title: 'Min', slug: 'min', description: 'desc', image_url: null, date: null };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'new', ...input }] });
      await AchievementRepository.create(input as any);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([null])
      );
    });

    it('should create achievement with all fields (non-null branches)', async () => {
      const input: any = {
        title: 'Full', slug: 'full', description: 'desc', image_url: 'img', date: '2025',
        event_organizer: 'EO', category: 'Cat', team_members: ['T1'],
        tech_stack: ['TS1'], problem_statement: 'P', solution_overview: 'S',
        credential_url: 'C', image_hash: 'H'
      };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'new', ...input }] });
      await AchievementRepository.create(input);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['EO', 'Cat', ['T1']])
      );
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
        [
          input.title,
          input.slug,
          input.description,
          input.image_url,
          input.date,
          input.event_organizer ?? null,
          input.category ?? null,
          input.team_members ?? null,
          input.tech_stack ?? null,
          input.problem_statement ?? null,
          input.solution_overview ?? null,
          input.credential_url ?? null,
          input.image_hash ?? null,
          id
        ]
      );
      expect(result).toEqual(expected);
    });

    it('should return null when achievement not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await AchievementRepository.update('non-existent', {});
      expect(result).toBeNull();
    });

    it('should update with minimal data (null branches)', async () => {
      const id = '123';
      const input = { title: 'T' };
      mockQuery.mockResolvedValueOnce({ rows: [{ id, title: 'T' }] });
      await AchievementRepository.update(id, input as any);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([null])
      );
    });

    it('should update with all fields (non-null branches)', async () => {
      const id = '123';
      const input: any = {
        title: 'Full', slug: 'full', description: 'desc', image_url: 'img', date: '2025',
        event_organizer: 'EO', category: 'Cat', team_members: ['T1'],
        tech_stack: ['TS1'], problem_statement: 'P', solution_overview: 'S',
        credential_url: 'C', image_hash: 'H'
      };
      mockQuery.mockResolvedValueOnce({ rows: [{ id, ...input }] });
      await AchievementRepository.update(id, input);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['EO', 'Cat', ['T1'], id])
      );
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

  describe('slug history', () => {
    it('should add slug history', async () => {
      mockQuery.mockResolvedValueOnce({});
      await AchievementRepository.addSlugHistory('id1', 'old-slug');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO achievement_slug_history'),
        ['id1', 'old-slug']
      );
    });

    it('should find slug by history', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [{ slug: 'new-slug' }] });
      const result = await AchievementRepository.findSlugByHistory('old-slug');
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT a.slug'),
        ['old-slug']
      );
      expect(result).toBe('new-slug');
    });

    it('should return null if history not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await AchievementRepository.findSlugByHistory('missing');
      expect(result).toBeNull();
    });
  });
});
