import { ProjectRepository } from '@/src/repositories/project.repository';
import { mockQuery } from '../__mocks__/db';
import { createProjectData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('ProjectRepository', () => {
  describe('findAll()', () => {
    it('should return all projects ordered by id DESC', async () => {
      const mockRows = [
        createProjectData({ id: '1', title: 'Project 1' }),
        createProjectData({ id: '2', title: 'Project 2' }),
      ];
      mockQuery.mockResolvedValueOnce({ rows: mockRows });

      const result = await ProjectRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith('SELECT * FROM projects ORDER BY id DESC');
      expect(result).toEqual(mockRows);
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
  });

  describe('create()', () => {
    it('should create project with features array', async () => {
      const input = createProjectData();
      const expected = { id: 'new-id', ...input };
      mockQuery.mockResolvedValueOnce({ rows: [expected] });

      const result = await ProjectRepository.create(input);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        [input.title, input.description, input.image_url, input.features, input.link_url, input.link_text]
      );
      expect(result).toEqual(expected);
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
        [input.title, input.description, input.image_url, input.features, input.link_url, input.link_text, id]
      );
      expect(result).toEqual(expected);
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
