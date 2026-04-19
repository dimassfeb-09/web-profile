import { SkillRepository, SkillCategoryData } from '../repositories/skill.repository';
import { unstable_cache, revalidateTag } from 'next/cache';

export class SkillService {
  private static getCachedSkills = unstable_cache(
    async () => SkillRepository.findAll(),
    ['skills_data'],
    { revalidate: 3600, tags: ['skills'] }
  );

  static async getAllSkills(bypassCache = false) {
    try {
      const skills = bypassCache
        ? await SkillRepository.findAll()
        : await this.getCachedSkills();
      
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
    revalidateTag('skills', { expire: 0 });
    return {
      status: 201,
      message: 'Skill category created successfully',
      data: skill
    };
  }

  static async updateSkill(id: number, data: Partial<SkillCategoryData>) {
    const skill = await SkillRepository.update(id, data);
    if (!skill) throw new Error('Skill category not found');
    revalidateTag('skills', { expire: 0 });
    return {
      status: 200,
      message: 'Skill category updated successfully',
      data: skill
    };
  }

  static async deleteSkill(id: number) {
    const success = await SkillRepository.delete(id);
    if (!success) throw new Error('Skill category not found');
    revalidateTag('skills', { expire: 0 });
    return {
      status: 200,
      message: 'Skill category deleted successfully'
    };
  }
}
