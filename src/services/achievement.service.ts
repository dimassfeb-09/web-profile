import { AchievementRepository, AchievementData } from '../repositories/achievement.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class AchievementService {
  private static getCachedAllAchievements = unstable_cache(
    async () => AchievementRepository.findAll(),
    ['achievements_all'],
    { revalidate: 3600, tags: ['achievements'] }
  );

  private static getCachedAchievementById = (id: string) => unstable_cache(
    async () => AchievementRepository.findById(id),
    [`achievement_${id}`],
    { revalidate: 3600, tags: ['achievements', `achievement_${id}`] }
  )();

  static async getAllAchievements(bypassCache = false) {
    try {
      const achievements = bypassCache
        ? await AchievementRepository.findAll()
        : await this.getCachedAllAchievements();

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

  static async createAchievement(data: AchievementData) {
    const achievement = await AchievementRepository.create(data);
    revalidateTag('achievements', 'max');
    return {
      status: 201,
      message: 'Achievement created successfully',
      data: achievement
    };
  }

  static async updateAchievement(id: string, data: Partial<AchievementData>) {
    const achievement = await AchievementRepository.update(id, data);
    if (!achievement) throw new Error('Achievement not found');

    revalidateTag('achievements', 'max');
    revalidateTag(`achievement_${id}`, 'max');

    return {
      status: 200,
      message: 'Achievement updated successfully',
      data: achievement
    };
  }

  static async deleteAchievement(id: string) {
    const success = await AchievementRepository.delete(id);
    if (!success) throw new Error('Achievement not found');

    revalidateTag('achievements', 'max');
    revalidateTag(`achievement_${id}`, 'max');

    return {
      status: 200,
      message: 'Achievement deleted successfully'
    };
  }
}
