import { ProjectRepository, ProjectData } from '../repositories/project.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class ProjectService {
  private static getCachedAllProjects = (sort: 'newest' | 'oldest') => unstable_cache(
    async () => ProjectRepository.findAll(sort),
    [`projects_all_${sort}`],
    { revalidate: 3600, tags: ['projects'] }
  )();

  private static getCachedProjectById = (id: string) => unstable_cache(
    async () => ProjectRepository.findById(id),
    [`project_${id}`],
    { revalidate: 3600, tags: ['projects', `project_${id}`] }
  )();

  private static getCachedProjectBySlug = (slug: string) => unstable_cache(
    async () => ProjectRepository.findBySlug(slug),
    [`project_slug_${slug}`],
    { revalidate: 3600, tags: ['projects', `project_slug_${slug}`] }
  )();

  static async getAllProjects(bypassCache = false, sort: 'newest' | 'oldest' = 'newest') {
    try {
      const projects = bypassCache
        ? await ProjectRepository.findAll(sort)
        : await this.getCachedAllProjects(sort);

      return {
        status: 200,
        message: 'Projects retrieved successfully',
        data: projects
      };
    } catch (error) {
      console.error('Error in ProjectService.getAllProjects:', error);
      throw new Error('Failed to fetch projects');
    }
  }

  static async getProjectById(id: string, bypassCache = false) {
    try {
      const project = bypassCache
        ? await ProjectRepository.findById(id)
        : await this.getCachedProjectById(id);

      if (!project) {
        return { status: 404, message: 'Project not found', data: null };
      }
      return { status: 200, message: 'Project retrieved successfully', data: project };
    } catch (error) {
      console.error('Error in ProjectService.getProjectById:', error);
      throw new Error('Failed to fetch project');
    }
  }

  static async getProjectBySlug(slug: string, bypassCache = false) {
    try {
      const project = bypassCache
        ? await ProjectRepository.findBySlug(slug)
        : await this.getCachedProjectBySlug(slug);

      if (!project) {
        return { status: 404, message: 'Project not found', data: null };
      }
      return { status: 200, message: 'Project retrieved successfully', data: project };
    } catch (error) {
      console.error('Error in ProjectService.getProjectBySlug:', error);
      throw new Error('Failed to fetch project');
    }
  }

  static async createProject(data: ProjectData) {
    const project = await ProjectRepository.create(data);
    revalidateTag('projects', { expire: 0 });
    return {
      status: 201,
      message: 'Project created successfully',
      data: project
    };
  }

  static async updateProject(id: string, data: Partial<ProjectData>) {
    const project = await ProjectRepository.update(id, data);
    if (!project) throw new Error('Project not found');

    revalidateTag('projects', { expire: 0 });
    revalidateTag(`project_${id}`, { expire: 0 });
    if (data.slug) revalidateTag(`project_slug_${data.slug}`, { expire: 0 });

    return {
      status: 200,
      message: 'Project updated successfully',
      data: project
    };
  }

  static async deleteProject(id: string) {
    const success = await ProjectRepository.delete(id);
    if (!success) throw new Error('Project not found');

    revalidateTag('projects', { expire: 0 });
    revalidateTag(`project_${id}`, { expire: 0 });

    return {
      status: 200,
      message: 'Project deleted successfully'
    };
  }
}
