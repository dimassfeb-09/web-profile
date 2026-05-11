'use server';

import { EducationService } from '@/src/services/education.service';
import { revalidateTag } from 'next/cache';
import { EducationInput } from '../lib/schemas/education.schema';

export async function createEducationAction(data: EducationInput) {
  try {
    const result = await EducationService.createEducation(data);
    revalidateTag('educations', {expire: 0});
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create education';
    return { status: 500, message };
  }
}

export async function updateEducationAction(id: string, data: Partial<EducationInput>) {
  try {
    const result = await EducationService.updateEducation(id, data);
    revalidateTag('educations', {expire: 0});
    revalidateTag(`education_${id}`, {expire: 0});
    if (data.slug) revalidateTag(`education_slug_${data.slug}`, {expire: 0});
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update education';
    return { status: 500, message };
  }
}

export async function deleteEducationAction(id: string) {
  try {
    const result = await EducationService.deleteEducation(id);
    revalidateTag('educations', {expire: 0});
    revalidateTag(`education_${id}`, {expire: 0});
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete education';
    return { status: 500, message };
  }
}
