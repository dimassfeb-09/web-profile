import { SkillRepository, SkillCategoryData } from '../repositories/skill.repository';
import { getCachedData, clearCache } from '../lib/cache';

export class SkillService {
  static async getAllSkills(bypassCache = false) {
    try {
      const skills = await getCachedData('skills_data', () => SkillRepository.findAll(), { bypass: bypassCache });
      
      return {
        status: 200,
        message: 'Skills retrieved successfully',
        data: skills
      };
    } catch (error) {
      console.error('Error in SkillService.getAllSkills:', error);
      throw new Error('Failed to fetch skills');
    }
  }

  static async createSkill(data: SkillCategoryData) {
    const skill = await SkillRepository.create(data);
    clearCache('skills_data');
    return {
      status: 201,
      message: 'Skill category created successfully',
      data: skill
    };
  }

  static async updateSkill(id: number, data: Partial<SkillCategoryData>) {
    const skill = await SkillRepository.update(id, data);
    if (!skill) throw new Error('Skill category not found');
    clearCache('skills_data');
    return {
      status: 200,
      message: 'Skill category updated successfully',
      data: skill
    };
  }

  static async deleteSkill(id: number) {
    const success = await SkillRepository.delete(id);
    if (!success) throw new Error('Skill category not found');
    clearCache('skills_data');
    return {
      status: 200,
      message: 'Skill category deleted successfully'
    };
  }
}
