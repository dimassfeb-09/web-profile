import { AchievementRepository, AchievementData } from '../repositories/achievement.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class AchievementService {
  static async getAllAchievements(bypassCache = false) {
    try {
      const achievements = await getCachedData('achievements_all', () => AchievementRepository.findAll(), { bypass: bypassCache });
      
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
      const achievement = await getCachedData(`achievement_${id}`, () => AchievementRepository.findById(id), { bypass: bypassCache });
      
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
    clearCache('achievements_all');
    return {
      status: 201,
      message: 'Achievement created successfully',
      data: achievement
    };
  }

  static async updateAchievement(id: string, data: Partial<AchievementData>) {
    const achievement = await AchievementRepository.update(id, data);
    if (!achievement) throw new Error('Achievement not found');
    
    clearCache('achievements_all');
    clearCache(`achievement_${id}`);
    
    return {
      status: 200,
      message: 'Achievement updated successfully',
      data: achievement
    };
  }

  static async deleteAchievement(id: string) {
    const success = await AchievementRepository.delete(id);
    if (!success) throw new Error('Achievement not found');
    
    clearCache('achievements_all');
    clearCache(`achievement_${id}`);
    
    return {
      status: 200,
      message: 'Achievement deleted successfully'
    };
  }
}
