import { EducationRepository, EducationData } from '../repositories/education.repository';
import { unstable_cache, revalidateTag } from 'next/cache';
import { EducationInput } from '../lib/schemas/education.schema';

export class EducationService {
  private static getCachedAllEducations = (sort: 'newest' | 'oldest') => unstable_cache(
    async () => EducationRepository.findAll(sort),
    [`educations_all_${sort}`],
    { revalidate: 3600, tags: ['educations'] }
  )();

  private static getCachedEducationById = (id: string) => unstable_cache(
    async () => EducationRepository.findById(id),
    [`education_${id}`],
    { revalidate: 3600, tags: ['educations', `education_${id}`] }
  )();

  private static getCachedEducationBySlug = (slug: string) => unstable_cache(
    async () => EducationRepository.findBySlug(slug),
    [`education_slug_${slug}`],
    { revalidate: 3600, tags: ['educations', `education_slug_${slug}`] }
  )();

  static async getAllEducations(bypassCache = false, sort: 'newest' | 'oldest' = 'newest') {
    try {
      const educations = bypassCache
        ? await EducationRepository.findAll(sort)
        : await this.getCachedAllEducations(sort);

      return {
        status: 200,
        message: 'Educations retrieved successfully',
        data: educations
      };
    } catch (error) {
      console.error('Error in EducationService.getAllEducations:', error);
      throw new Error('Failed to fetch educations');
    }
  }

  static async getEducationById(id: string, bypassCache = false) {
    try {
      const education = bypassCache
        ? await EducationRepository.findById(id)
        : await this.getCachedEducationById(id);

      if (!education) {
        return { status: 404, message: 'Education not found', data: null };
      }
      return { status: 200, message: 'Education retrieved successfully', data: education };
    } catch (error) {
      console.error('Error in EducationService.getEducationById:', error);
      throw new Error('Failed to fetch education');
    }
  }

  static async getEducationBySlug(slug: string, bypassCache = false) {
    try {
      const education = bypassCache
        ? await EducationRepository.findBySlug(slug)
        : await this.getCachedEducationBySlug(slug);

      if (!education) {
        return { status: 404, message: 'Education not found', data: null };
      }
      return { status: 200, message: 'Education retrieved successfully', data: education };
    } catch (error) {
      console.error('Error in EducationService.getEducationBySlug:', error);
      throw new Error('Failed to fetch education');
    }
  }

  static async createEducation(data: EducationInput) {
    try {
      const education = await EducationRepository.create(data);
      revalidateTag('educations', { expire: 0 });
      return {
        status: 201,
        message: 'Education created successfully',
        data: education
      };
    } catch (error) {
      console.error('Error in EducationService.createEducation:', error);
      throw error;
    }
  }

  static async updateEducation(id: string, data: Partial<EducationInput>) {
    try {
      const education = await EducationRepository.update(id, data);
      if (!education) throw new Error('Education not found');

      revalidateTag('educations',{ expire: 0 });
      revalidateTag(`education_${id}`, { expire: 0 });
      if (data.slug) revalidateTag(`education_slug_${data.slug}`, { expire: 0 });

      return {
        status: 200,
        message: 'Education updated successfully',
        data: education
      };
    } catch (error) {
      console.error('Error in EducationService.updateEducation:', error);
      throw error;
    }
  }

  static async deleteEducation(id: string) {
    try {
      const success = await EducationRepository.delete(id);
      if (!success) throw new Error('Education not found');

      revalidateTag('educations', { expire: 0 });
      revalidateTag(`education_${id}`, { expire: 0 });

      return {
        status: 200,
        message: 'Education deleted successfully'
      };
    } catch (error) {
      console.error('Error in EducationService.deleteEducation:', error);
      throw error;
    }
  }
}
