import { AchievementRepository, AchievementData } from '../repositories/achievement.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class AchievementService {
  private static getCachedAllAchievements = (sort: 'newest' | 'oldest') => unstable_cache(
    async () => AchievementRepository.findAll(sort),
    [`achievements_all_${sort}`],
    { revalidate: 3600, tags: ['achievements'] }
  )();

  private static getCachedAchievementById = (id: string) => unstable_cache(
    async () => AchievementRepository.findById(id),
    [`achievement_id_${id}`],
    { revalidate: 3600, tags: ['achievements', `achievement_id_${id}`] }
  )();

  private static getCachedAchievementBySlug = (slug: string) => unstable_cache(
    async () => AchievementRepository.findBySlug(slug),
    [`achievement_slug_${slug}`],
    { revalidate: 3600, tags: ['achievements', `achievement_slug_${slug}`] }
  )();

  static async getAllAchievements(bypassCache = false, sort: 'newest' | 'oldest' = 'newest') {
    try {
      const achievements = bypassCache
        ? await AchievementRepository.findAll(sort)
        : await this.getCachedAllAchievements(sort);

      return {
        status: 200,
        message: 'Achievements retrieved successfully',
        data: achievements
      };
    } catch (error) {
      console.error('Error in AchievementService.getAllAchievements:', error);
      throw new Error('Failed to fetch achievements');
    }
  }

  static async getAchievementById(id: string, bypassCache = false) {
    try {
      const achievement = bypassCache
        ? await AchievementRepository.findById(id)
        : await this.getCachedAchievementById(id);

      if (!achievement) {
        return {
          status: 404,
          message: 'Achievement not found',
          data: null
        };
      }
      return {
        status: 200,
        message: 'Achievement retrieved successfully',
        data: achievement
      };
    } catch (error) {
      console.error('Error in AchievementService.getAchievementById:', error);
      throw new Error('Failed to fetch achievement');
    }
  }

  static async getAchievementBySlug(slug: string, bypassCache = false) {
    try {
      // 1. Try finding by current slug
      let achievement = bypassCache
        ? await AchievementRepository.findBySlug(slug)
        : await this.getCachedAchievementBySlug(slug);

      if (achievement) {
        return {
          status: 200,
          message: 'Achievement retrieved successfully',
          data: achievement
        };
      }

      // 2. Check if it's a UUID (redirect to current slug)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(slug)) {
        const byId = await AchievementRepository.findById(slug);
        if (byId && byId.slug) {
          return {
            status: 301,
            message: 'Redirecting to current slug',
            data: byId.slug
          };
        }
      }

      // 3. Check slug history (redirect to current slug)
      const currentSlug = await AchievementRepository.findSlugByHistory(slug);
      if (currentSlug) {
        return {
          status: 301,
          message: 'Redirecting to current slug',
          data: currentSlug
        };
      }

      return {
        status: 404,
        message: 'Achievement not found',
        data: null
      };
    } catch (error) {
      console.error('Error in AchievementService.getAchievementBySlug:', error);
      throw new Error('Failed to fetch achievement');
    }
  }

  static async createAchievement(data: AchievementData) {
    const achievement = await AchievementRepository.create(data);
    revalidateTag('achievements', { expire: 0 });
    return {
      status: 201,
      message: 'Achievement created successfully',
      data: achievement
    };
  }

  static async updateAchievement(id: string, data: Partial<AchievementData>) {
    const existing = await AchievementRepository.findById(id);
    if (!existing) throw new Error('Achievement not found');

    if (data.slug && existing.slug && data.slug !== existing.slug) {
      await AchievementRepository.addSlugHistory(id, existing.slug);
    }

    const achievement = await AchievementRepository.update(id, data);
    if (!achievement) throw new Error('Failed to update achievement');

    revalidateTag('achievements', { expire: 0 });
    revalidateTag(`achievement_id_${id}`, { expire: 0 });
    if (achievement.slug) {
      revalidateTag(`achievement_slug_${achievement.slug}`, { expire: 0 });
    }
    if (existing.slug && existing.slug !== achievement.slug) {
      revalidateTag(`achievement_slug_${existing.slug}`, { expire: 0 });
    }

    return {
      status: 200,
      message: 'Achievement updated successfully',
      data: achievement
    };
  }

  static async deleteAchievement(id: string) {
    const achievement = await AchievementRepository.findById(id);
    const success = await AchievementRepository.delete(id);
    if (!success) throw new Error('Achievement not found');

    revalidateTag('achievements', { expire: 0 });
    revalidateTag(`achievement_id_${id}`, { expire: 0 });
    if (achievement?.slug) {
      revalidateTag(`achievement_slug_${achievement.slug}`, { expire: 0 });
    }

    return {
      status: 200,
      message: 'Achievement deleted successfully'
    };
  }
}
