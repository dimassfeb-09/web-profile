import { ProjectRepository, ProjectData } from '../repositories/project.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class ProjectService {
  private static getCachedAllProjects = unstable_cache(
    async () => ProjectRepository.findAll(),
    ['projects_all'],
    { revalidate: 3600, tags: ['projects'] }
  );

  private static getCachedProjectById = (id: string) => unstable_cache(
    async () => ProjectRepository.findById(id),
    [`project_${id}`],
    { revalidate: 3600, tags: ['projects', `project_${id}`] }
  )();

  static async getAllProjects(bypassCache = false) {
    try {
      const projects = bypassCache 
        ? await ProjectRepository.findAll() 
        : await this.getCachedAllProjects();
      
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
        return {
          status: 404,
          message: 'Project not found',
          data: null
        };
      }
      return {
        status: 200,
        message: 'Project retrieved successfully',
        data: project
      };
    } catch (error) {
      console.error('Error in ProjectService.getProjectById:', error);
      throw new Error('Failed to fetch project');
    }
  }

  static async createProject(data: ProjectData) {
    const project = await ProjectRepository.create(data);
    revalidateTag('projects', 'max');
    return {
      status: 201,
      message: 'Project created successfully',
      data: project
    };
  }

  static async updateProject(id: string, data: Partial<ProjectData>) {
    const project = await ProjectRepository.update(id, data);
    if (!project) throw new Error('Project not found');
    
    // Invalidate the projects list and the specific project
    revalidateTag('projects', 'max');
    revalidateTag(`project_${id}`, 'max');
    
    return {
      status: 200,
      message: 'Project updated successfully',
      data: project
    };
  }

  static async deleteProject(id: string) {
    const success = await ProjectRepository.delete(id);
    if (!success) throw new Error('Project not found');
    
    revalidateTag('projects', 'max');
    revalidateTag(`project_${id}`, 'max');
    
    return {
      status: 200,
      message: 'Project deleted successfully'
    };
  }
}
