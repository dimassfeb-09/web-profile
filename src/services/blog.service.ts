import { BlogRepository, BlogData } from '../repositories/blog.repository';
import { ImageService } from './image.service';
import { JSONContent } from '@tiptap/react';
import { unstable_cache, revalidateTag } from 'next/cache';

export class BlogService {
  /**
   * Recursive helper to extract all image URLs from Tiptap JSONContent
   */
  private static extractImageUrls(content: JSONContent): string[] {
    const urls: string[] = [];

    const traverse = (node: JSONContent) => {
      if (node.type === 'image' && node.attrs?.src) {
        urls.push(node.attrs.src);
      }

      if (node.content) {
        node.content.forEach(traverse);
      }
    };

    traverse(content);
    return urls;
  }

  static async getAllBlogs(onlyPublished = false, bypassCache = false): Promise<BlogData[]> {
    if (bypassCache) return BlogRepository.findAll(onlyPublished);

    return unstable_cache(
      async () => BlogRepository.findAll(onlyPublished),
      [`blogs_all_${onlyPublished}`],
      { revalidate: 3600, tags: ['blog'] }
    )();
  }

  static async getBlogById(id: string, bypassCache = false): Promise<BlogData | null> {
    if (bypassCache) return BlogRepository.findById(id);

    return unstable_cache(
      async () => BlogRepository.findById(id),
      [`blog_${id}`],
      { revalidate: 3600, tags: ['blog', `blog_${id}`] }
    )();
  }

  static async getBlogBySlug(slug: string, bypassCache = false): Promise<BlogData | null> {
    if (bypassCache) return BlogRepository.findBySlug(slug);

    return unstable_cache(
      async () => BlogRepository.findBySlug(slug),
      [`blog_slug_${slug}`],
      { revalidate: 3600, tags: ['blog', `blog_slug_${slug}`] }
    )();
  }

  static async createBlog(data: BlogData): Promise<BlogData> {
    // 1. Save Blog to DB
    const blog = await BlogRepository.create(data);

    // 2. Extract used images from content
    const usedUrls = this.extractImageUrls(data.content);

    // 3. Mark extracted images as active
    await ImageService.markImagesActive(blog.id, usedUrls);

    // 4. Invalidate Cache
    revalidateTag('blog', 'max');

    return blog;
  }

  static async updateBlog(id: string, data: Partial<BlogData>): Promise<BlogData | null> {
    // 1. Update Blog in DB
    const blog = await BlogRepository.update(id, data);

    if (blog) {
      if (data.content) {
        // 2. If content was updated, sync image statuses
        const usedUrls = this.extractImageUrls(data.content);
        await ImageService.markImagesActive(id, usedUrls);
      }

      // 3. Invalidate Cache
      revalidateTag('blog', 'max');
      revalidateTag(`blog_${id}`, 'max');
      if (blog.slug) {
        revalidateTag(`blog_slug_${blog.slug}`, 'max');
      }
    }

    return blog;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    // 1. Get blog info for slug invalidation before delete if needed, 
    // but usually blog ID is enough.
    const blog = await BlogRepository.findById(id);

    // 2. Cleanup images from storage first
    await ImageService.deleteAllBlogImages(id);

    // 3. Delete blog from DB (cascades to blog_images records)
    const success = await BlogRepository.delete(id);

    if (success) {
      revalidateTag('blog', 'max');
      revalidateTag(`blog_${id}`, 'max');
      if (blog?.slug) revalidateTag(`blog_slug_${blog.slug}`, 'max');
    }

    return success;
  }
}
