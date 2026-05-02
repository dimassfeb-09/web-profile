'use server';

import { ExperienceService } from '@/src/services/experience.service';
import { revalidateTag } from 'next/cache';

export async function createExperienceAction(data: {
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string[];
  tags?: string[];
}) {
  try {
    const result = await ExperienceService.createExperience(data);
    revalidateTag('experience', { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create experience';
    return { status: 500, message };
  }
}

export async function updateExperienceAction(id: number, data: Partial<{
  role: string;
  company: string;
  start_date: string;
  end_date: string | null;
  description: string[];
  tags: string[];
}>) {
  try {
    const result = await ExperienceService.updateExperience(id, data);
    revalidateTag('experience', { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update experience';
    return { status: 500, message };
  }
}

export async function deleteExperienceAction(id: number) {
  try {
    const result = await ExperienceService.deleteExperience(id);
    revalidateTag('experience', { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete experience';
    return { status: 500, message };
  }
}
