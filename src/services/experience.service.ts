import { ExperienceRepository, ExperienceData } from '../repositories/experience.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class ExperienceService {
  private static getCachedExperiences = (limit?: number, offset?: number) => unstable_cache(
    async () => ExperienceRepository.findAll(limit, offset),
    [`experience_v2_${limit}_${offset}`],
    { revalidate: 3600, tags: ['experience', 'experience_v2'] }
  )();

  static async getAllExperiences(bypassCache = false, limit?: number, offset?: number) {
    try {
      const experiences = bypassCache
        ? await ExperienceRepository.findAll(limit, offset)
        : await this.getCachedExperiences(limit, offset);

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
    revalidateTag('experience', { expire: 0 });
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
    revalidateTag('experience', { expire: 0 });
    return {
      status: 200,
      message: 'Experience updated successfully',
      data: experience
    };
  }

  static async deleteExperience(id: number) {
    const success = await ExperienceRepository.delete(id);
    if (!success) throw new Error('Experience not found');
    revalidateTag('experience', { expire: 0 });
    return {
      status: 200,
      message: 'Experience deleted successfully'
    };
  }
}
