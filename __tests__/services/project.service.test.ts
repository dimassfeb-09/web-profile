import { ProjectService } from '@/src/services/project.service';
import { ProjectRepository } from '@/src/repositories/project.repository';
import { revalidateTag } from 'next/cache';
import { createProjectData } from '../helpers/factories';

jest.mock('../../src/repositories/project.repository');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

const MockedRepo = ProjectRepository as jest.Mocked<typeof ProjectRepository>;

describe('ProjectService', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getAllProjects()', () => {
    it('should return projects with default sort', async () => {
      const mockData = [createProjectData({ title: 'P1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await ProjectService.getAllProjects();

      expect(MockedRepo.findAll).toHaveBeenCalledWith('newest', undefined, undefined);
      expect(result.data).toEqual(mockData);
    });

    it('should return projects with oldest sort', async () => {
      const mockData = [createProjectData({ title: 'P1' })];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      const result = await ProjectService.getAllProjects(false, 'oldest');

      expect(MockedRepo.findAll).toHaveBeenCalledWith('oldest', undefined, undefined);
      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache when requested', async () => {
      const mockData = [createProjectData()];
      MockedRepo.findAll.mockResolvedValueOnce(mockData);

      await ProjectService.getAllProjects(true);

      expect(MockedRepo.findAll).toHaveBeenCalledTimes(1);
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

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache for single project when requested', async () => {
      const id = '123';
      const mockData = createProjectData({ id });
      MockedRepo.findById.mockResolvedValueOnce(mockData);

      await ProjectService.getProjectById(id, true);

      expect(MockedRepo.findById).toHaveBeenCalledWith(id);
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

  describe('getProjectBySlug()', () => {
    it('should return project by slug', async () => {
      const slug = 'test-slug';
      const mockData = createProjectData({ slug });
      MockedRepo.findBySlug.mockResolvedValueOnce(mockData);

      const result = await ProjectService.getProjectBySlug(slug);

      expect(result.data).toEqual(mockData);
    });

    it('should bypass cache for slug when requested', async () => {
      const slug = 'test-slug';
      MockedRepo.findBySlug.mockResolvedValueOnce(createProjectData());

      await ProjectService.getProjectBySlug(slug, true);

      expect(MockedRepo.findBySlug).toHaveBeenCalledWith(slug);
    });

    it('should return 404 when slug not found', async () => {
      MockedRepo.findBySlug.mockResolvedValueOnce(null);
      const result = await ProjectService.getProjectBySlug('missing');
      expect(result.status).toBe(404);
    });

    it('should throw error when repo fails for slug', async () => {
      MockedRepo.findBySlug.mockRejectedValueOnce(new Error('Fail'));
      await expect(ProjectService.getProjectBySlug('test')).rejects.toThrow('Failed to fetch project');
    });
  });

  describe('createProject()', () => {
    it('should create and clear cache', async () => {
      const input = createProjectData();
      const created = { id: 'abc', ...input };
      MockedRepo.create.mockResolvedValueOnce(created);

      const result = await ProjectService.createProject(input);

      expect(MockedRepo.create).toHaveBeenCalledWith(input);
      expect(revalidateTag).toHaveBeenCalledWith('projects', { expire: 0 });
      expect(result.status).toBe(201);
    });
  });

  describe('updateProject()', () => {
    it('should update and clear cache', async () => {
      const id = 'uuid-123';
      const input = { title: 'New', slug: 'new-slug' };
      const updated = { id, ...createProjectData(input) };
      MockedRepo.update.mockResolvedValueOnce(updated);

      const result = await ProjectService.updateProject(id, input);

      expect(MockedRepo.update).toHaveBeenCalledWith(id, input);
      expect(revalidateTag).toHaveBeenCalledWith('projects', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`project_slug_${input.slug}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should not revalidate slug if missing in update', async () => {
      const id = '123';
      const input = { title: 'New' };
      MockedRepo.update.mockResolvedValueOnce({ id, ...input } as any);
      await ProjectService.updateProject(id, input);
      expect(revalidateTag).not.toHaveBeenCalledWith(expect.stringContaining('project_slug_'), { expire: 0 });
    });

    it('should throw error when project not found', async () => {
      MockedRepo.update.mockResolvedValueOnce(null);
      await expect(ProjectService.updateProject('123', {}))
        .rejects.toThrow('Project not found');
    });
  });

  describe('deleteProject()', () => {
    it('should delete and clear cache', async () => {
      const id = '123';
      MockedRepo.delete.mockResolvedValueOnce(true);

      const result = await ProjectService.deleteProject(id);

      expect(MockedRepo.delete).toHaveBeenCalledWith(id);
      expect(revalidateTag).toHaveBeenCalledWith('projects', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`project_${id}`, { expire: 0 });
      expect(result.status).toBe(200);
    });

    it('should throw when delete fails', async () => {
      MockedRepo.delete.mockResolvedValueOnce(false);
      await expect(ProjectService.deleteProject('invalid')).rejects.toThrow('Project not found');
    });
  });
});
