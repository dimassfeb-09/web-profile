import { ProjectRepository, ProjectData } from '../repositories/project.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class ProjectService {
  static async getAllProjects(bypassCache = false) {
    try {
      const projects = await getCachedData('projects_all', () => ProjectRepository.findAll(), { bypass: bypassCache });
      
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
      const project = await getCachedData(`project_${id}`, () => ProjectRepository.findById(id), { bypass: bypassCache });
      
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
    clearCache('projects_all');
    return {
      status: 201,
      message: 'Project created successfully',
      data: project
    };
  }

  static async updateProject(id: string, data: Partial<ProjectData>) {
    const project = await ProjectRepository.update(id, data);
    if (!project) throw new Error('Project not found');
    
    // Invalidate both the list and the specific project cache
    clearCache('projects_all');
    clearCache(`project_${id}`);
    
    return {
      status: 200,
      message: 'Project updated successfully',
      data: project
    };
  }

  static async deleteProject(id: string) {
    const success = await ProjectRepository.delete(id);
    if (!success) throw new Error('Project not found');
    
    clearCache('projects_all');
    clearCache(`project_${id}`);
    
    return {
      status: 200,
      message: 'Project deleted successfully'
    };
  }
}
