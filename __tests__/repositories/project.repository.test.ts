import { ProjectRepository } from '@/src/repositories/project.repository';
import { mockQuery } from '../__mocks__/db';
import { createProjectData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('ProjectRepository', () => {
  describe('findAll()', () => {
    it('should return all projects ordered by created_at DESC (default)', async () => {
      const mockRows = [
        createProjectData({ id: '1', title: 'Project 1' }),
        createProjectData({ id: '2', title: 'Project 2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await ProjectRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM projects ORDER BY created_at DESC, id DESC', []);
      expect(result).toEqual(mockRows);
    });

    it('should return all projects ordered by created_at ASC (oldest)', async () => {
      const mockRows = [
        createProjectData({ id: '2', title: 'Project 2' }),
        createProjectData({ id: '1', title: 'Project 1' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await ProjectRepository.findAll('oldest');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM projects ORDER BY created_at ASC, id ASC', []);
      expect(result).toEqual(mockRows);
    });

    it('should handle limit and offset', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await ProjectRepository.findAll('newest', 10, 5);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1 OFFSET $2'),
        [10, 5]
      );
    });
  });

  describe('findById()', () => {
    it('should return project by id', async () => {
      const mockData = createProjectData({ id: 'uuid-123' });
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await ProjectRepository.findById('uuid-123');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM projects WHERE id = $1', ['uuid-123']);
      expect(result).toEqual(mockData);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await ProjectRepository.findById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('findBySlug()', () => {
    it('should return project by slug', async () => {
      const mockData = createProjectData({ slug: 'test-project' });
      mockQuery.mockResolvedValueOnce({ rows: [mockData] });

      const result = await ProjectRepository.findBySlug('test-project');

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM projects WHERE slug = $1', ['test-project']);
      expect(result).toEqual(mockData);
    });

    it('should return null if slug not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await ProjectRepository.findBySlug('missing');
      expect(result).toBeNull();
    });
  });

  describe('create()', () => {
    it('should create project with features array', async () => {
      const input = createProjectData();
      const expected = { id: 'new-id', ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await ProjectRepository.create(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        [
          input.title,
          input.description,
          input.image_url,
          input.features,
          input.link_url,
          input.link_text,
          input.slug || null,
          input.long_description || null,
          input.tech_stack || [],
          input.screenshots || [],
          input.status || 'completed',
          input.date || null,
          input.external_links ? JSON.stringify(input.external_links) : null,
          input.image_hash || null,
        ]
      );
      expect(result).toEqual(expected);
    });

    it('should create with minimal data (fallback branches)', async () => {
      const input = { title: 'T', description: 'D', image_url: 'I', features: [], link_url: 'L', link_text: 'LT' };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'new', ...input }] });
      await ProjectRepository.create(input as any);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['completed', null, []])
      );
    });

    it('should create with external_links', async () => {
      const input = { ...createProjectData(), external_links: { demo: 'url' } };
      mockQuery.mockResolvedValueOnce({ rows: [{ id: 'new', ...input }] });
      await ProjectRepository.create(input);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([JSON.stringify({ demo: 'url' })])
      );
    });
  });

  describe('update()', () => {
    it('should update project', async () => {
      const id = 'uuid-123';
      const input = createProjectData({ title: 'Updated Project' });
      const expected = { id, ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await ProjectRepository.update(id, input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE projects'),
        [
          input.title,
          input.description,
          input.image_url,
          input.features,
          input.link_url,
          input.link_text,
          input.slug || null,
          input.long_description || null,
          input.tech_stack || [],
          input.screenshots || [],
          input.status || 'completed',
          input.date || null,
          input.external_links ? JSON.stringify(input.external_links) : null,
          input.image_hash || null,
          id,
        ]
      );
      expect(result).toEqual(expected);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await ProjectRepository.update('non-existent', {} as any);
      expect(result).toBeNull();
    });

    it('should update with minimal data (fallback branches)', async () => {
      const id = '123';
      const input = { title: 'T' };
      mockQuery.mockResolvedValueOnce({ rows: [{ id, ...input }] });
      await ProjectRepository.update(id, input as any);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining(['completed', null, []])
      );
    });

    it('should update with external_links', async () => {
      const id = '123';
      const input = { external_links: { source: 'git' } };
      mockQuery.mockResolvedValueOnce({ rows: [{ id, title: 'T' }] });
      await ProjectRepository.update(id, input as any);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([JSON.stringify({ source: 'git' }), id])
      );
    });
  });

  describe('delete()', () => {
    it('should return false when no row deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      let result = await ProjectRepository.delete('invalid-id');
      expect(result).toBe(false);

      mockQuery.mockResolvedValueOnce({ rowCount: null });
      result = await ProjectRepository.delete('invalid-id');
      expect(result).toBe(false);
    });

    it('should delete project', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });

      const result = await ProjectRepository.delete('uuid-123');

      expect(mockQuery).toHaveBeenCalledWith('DELETE FROM projects WHERE id = $1', ['uuid-123']);
      expect(result).toBe(true);
    });
  });
});
