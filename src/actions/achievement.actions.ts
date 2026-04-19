'use server';

import { AchievementService } from '@/src/services/achievement.service';
import { revalidateTag } from 'next/cache';

export async function createAchievementAction(data: {
  title: string;
  description: string;
  image_url: string | null;
  date: string | null;
}) {
  try {
    const result = await AchievementService.createAchievement(data);
    revalidateTag('achievements', { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create achievement';
    return { status: 500, message };
  }
}

export async function updateAchievementAction(id: string, data: Partial<{
  title: string;
  description: string;
  image_url: string | null;
  date: string | null;
}>) {
  try {
    const result = await AchievementService.updateAchievement(id, data);
    revalidateTag('achievements', { expire: 0 });
    revalidateTag(`achievement_${id}`, { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update achievement';
    return { status: 500, message };
  }
}

export async function deleteAchievementAction(id: string) {
  try {
    const result = await AchievementService.deleteAchievement(id);
    revalidateTag('achievements', { expire: 0 });
    revalidateTag(`achievement_${id}`, { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete achievement';
    return { status: 500, message };
  }
}
