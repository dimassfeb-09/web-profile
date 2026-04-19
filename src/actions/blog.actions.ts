'use server';

import { BlogService } from '@/src/services/blog.service';
import { revalidateTag } from 'next/cache';

export async function deleteBlogAction(id: string) {
  try {
    const success = await BlogService.deleteBlog(id);
    if (!success) throw new Error('Blog not found or could not be deleted');
    
    revalidateTag('blog', { expire: 0 });
    revalidateTag(`blog_${id}`, { expire: 0 });
    return { status: 200, message: 'Article deleted successfully' };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete blog';
    return { status: 500, message };
  }
}
