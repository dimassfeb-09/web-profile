'use server';

import { SkillService } from '@/src/services/skill.service';
import { revalidateTag } from 'next/cache';

export async function createSkillAction(formData: {
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}) {
  try {
    const result = await SkillService.createSkill(formData);
    revalidateTag('skills', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to create skill' };
  }
}

export async function updateSkillAction(id: number, formData: {
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}) {
  try {
    const result = await SkillService.updateSkill(id, formData);
    revalidateTag('skills', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to update skill' };
  }
}

export async function deleteSkillAction(id: number) {
  try {
    const result = await SkillService.deleteSkill(id);
    revalidateTag('skills', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to delete skill' };
  }
}
