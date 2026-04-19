import { ExperienceRepository, ExperienceData } from '../repositories/experience.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class ExperienceService {
  private static getCachedExperiences = unstable_cache(
    async () => ExperienceRepository.findAll(),
    ['experience_data'],
    { revalidate: 3600, tags: ['experience'] }
  );

  static async getAllExperiences(bypassCache = false) {
    try {
      const experiences = bypassCache
        ? await ExperienceRepository.findAll()
        : await this.getCachedExperiences();

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
    revalidateTag('experience', 'max');
    return {
      status: 201,
      message: 'Experience created successfully',
      data: experience
    };
  }

  static async updateExperience(id: number, data: Partial<ExperienceData>) {
    if (data.start_date && data.end_date && new Date(data.end_date) < new Date(data.start_date)) {
      throw new Error('End date cannot be earlier than start date');
    }

    const experience = await ExperienceRepository.update(id, data);
    if (!experience) throw new Error('Experience not found');
    revalidateTag('experience', 'max');
    return {
      status: 200,
      message: 'Experience updated successfully',
      data: experience
    };
  }

  static async deleteExperience(id: number) {
    const success = await ExperienceRepository.delete(id);
    if (!success) throw new Error('Experience not found');
    revalidateTag('experience', 'max');
    return {
      status: 200,
      message: 'Experience deleted successfully'
    };
  }
}
