'use server';

import { HomeService } from '@/src/services/home.service';
import { revalidateTag } from 'next/cache';

export async function updateHomeAction(data: {
  badge_text: string;
  headline: string;
  subheadline: string;
  description: string;
  cv_url: string;
}) {
  try {
    const result = await HomeService.updateHomeData(data);
    revalidateTag('home', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to update home section' };
  }
}
