'use server';

import { ContactService } from '@/src/services/contact.service';
import { revalidateTag } from 'next/cache';

export async function updateContactAction(data: {
  headline: string;
  description: string;
  email: string;
  linkedin_url: string;
}) {
  try {
    const result = await ContactService.updateContactData(data);
    revalidateTag('contact', { expire: 0 });
    return result;
  } catch (error: any) {
    return { status: 500, message: error.message || 'Failed to update contact section' };
  }
}
