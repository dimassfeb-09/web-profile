import { ExperienceRepository, ExperienceData } from '../repositories/experience.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class ExperienceService {
  static async getAllExperiences(bypassCache = false) {
    try {
      const experiences = await getCachedData('experience_data', () => ExperienceRepository.findAll(), { bypass: bypassCache });
      
      return {
        status: 200,
        message: 'Experiences retrieved successfully',
        data: experiences
      };
    } catch (error) {
      console.error('Error in ExperienceService.getAllExperiences:', error);
      throw new Error('Failed to fetch experiences');
    }
  }

  static async createExperience(data: ExperienceData) {
    if (data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
      throw new Error('End date cannot be earlier than start date');
    }

    const experience = await ExperienceRepository.create(data);
    clearCache('experience_data');
    return {
      status: 201,
      message: 'Experience created successfully',
      data: experience
    };
  }

  static async updateExperience(id: number, data: Partial<ExperienceData>) {
    // If both dates are provided or one is provided and the other exists in current state 
    // (for simplicity in API, we assume full or enough data is sent for validation if needed)
    if (data.start_date && data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
      throw new Error('End date cannot be earlier than start date');
    }

    const experience = await ExperienceRepository.update(id, data);
    if (!experience) throw new Error('Experience not found');
    clearCache('experience_data');
    return {
      status: 200,
      message: 'Experience updated successfully',
      data: experience
    };
  }

  static async deleteExperience(id: number) {
    const success = await ExperienceRepository.delete(id);
    if (!success) throw new Error('Experience not found');
    clearCache('experience_data');
    return {
      status: 200,
      message: 'Experience deleted successfully'
    };
  }
}
