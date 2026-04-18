import { ProjectService } from '@/src/services/project.service';
import { ProjectRepository } from '@/src/repositories/project.repository';
import { clearCache, getCachedData } from '@/src/lib/cache';
import { createProjectData } from '../helpers/factories';

jest.mock('../../src/repositories/project.repository');
jest.mock('../../src/lib/cache', () => ({
  getCachedData: jest.fn(async (key: string, fetcher: () => any) => await fetcher()),
  clearCache: jest.fn(),
}));

const MockedRepo = ProjectRepository as jest.Mocked<typeof ProjectRepository>;

describe('ProjectService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects()', () => {
    it('should return projects', async () => {
      const mockData = [createProjectData({ title: 'P1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await ProjectService.getAllProjects();

      expect(getCachedData).toHaveBeenCalledWith('projects_all', expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should throw error when repo fails', async () => {
      MockedRepo.findAll.mockRejectedValueOnce(new Error('Fail'));
      await expect(ProjectService.getAllProjects()).rejects.toThrow('Failed to fetch projects');
    });
  });

  describe('getProjectById()', () => {
    it('should return project', async () => {
      const id = '123';
      const mockData = createProjectData({ id });
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      const result = await ProjectService.getProjectById(id);

      expect(getCachedData).toHaveBeenCalledWith(`project_${id}`, expect.any(Function), expect.any(Object));
      expect(result.data).toEqual(mockData);
    });

    it('should return 404 when not found', async () => {
      MockedRepo.findById.mockResolvedValueOnce(null);
      const result = await ProjectService.getProjectById('missing');
      expect(result.status).toBe(404);
    });

    it('should throw error when repo fails', async () => {
      MockedRepo.findById.mockRejectedValueOnce(new Error('Fail'));
      await expect(ProjectService.getProjectById('123')).rejects.toThrow('Failed to fetch project');
    });
  });

  describe('createProject()', () => {
    it('should create and clear cache', async () => {
      const input = createProjectData();
      const created = { id: 'abc', ...input };
      MockedRepo.create.mockResolvedValueOnce(created);

      const result = await ProjectService.createProject(input);

      expect(MockedRepo.create).toHaveBeenCalledWith(input);
      expect(clearCache).toHaveBeenCalledWith('projects_all');
      expect(result.status).toBe(201);
    });
  });

  describe('updateProject()', () => {
    it('should update and clear cache', async () => {
      const id = 'uuid-123';
      const input = { title: 'New' };
      const updated = { id, ...createProjectData(input) };
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await ProjectService.updateProject(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(clearCache).toHaveBeenCalledWith('projects_all');
      expect(clearCache).toHaveBeenCalledWith(`project_${id}`);
      expect(result.status).toBe(200);
    });

    it('should throw when not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(ProjectService.updateProject('invalid', {})).rejects.toThrow('Project not found');
    });
  });

  describe('deleteProject()', () => {
    it('should delete and clear cache', async () => {
      const id = '123';
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await ProjectService.deleteProject(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(clearCache).toHaveBeenCalledWith('projects_all');
      expect(clearCache).toHaveBeenCalledWith(`project_${id}`);
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(ProjectService.deleteProject('invalid')).rejects.toThrow('Project not found');
    });
  });
});
