'use server';

import { ContactService } from '@/src/services/contact.service';
import { revalidateTag } from 'next/cache';

export async function updateContactAction(data: {
  headline: string;
  description: string;
  email: string;
  linkedin_url: string;
  github_url?: string;
  instagram_url?: string;
  twitter_url?: string;
}) {
  try {
    const result = await ContactService.updateContactData(data);
    revalidateTag('contact', { expire: 0 });
    return result;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update contact section';
    return { status: 500, message };
  }
}
