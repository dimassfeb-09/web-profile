'use server';

import { AboutService } from '@/src/services/about.service';
import { revalidateTag } from 'next/cache';

export async function updateAboutAction(data: {
  headline: string;
  paragraphs: string[];
}) {
  try {
    const result = await AboutService.updateAboutData(data);
    revalidateTag('about', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to update about section' };
  }
}
