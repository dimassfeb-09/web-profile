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

  static async getAllBlogs(options: {
    onlyPublished?: boolean;
    cursor?: string | null;
    limit?: number;
    bypassCache?: boolean
  } = {}): Promise<{ blogs: BlogData[]; nextCursor: string | null; hasMore: boolean }> {
    const { onlyPublished = false, cursor = null, limit = 9, bypassCache = false } = options;

    const fetchBlogs = async () => BlogRepository.findAll({ onlyPublished, cursor, limit });

    let blogs: BlogData[];
    if (bypassCache) {
      blogs = await fetchBlogs();
    } else {
      const cacheKey = `blogs_all_${onlyPublished}_${cursor ?? 'none'}_${limit}`;
      blogs = await unstable_cache(
        fetchBlogs,
        [cacheKey],
        { revalidate: 3600, tags: ['blog'] }
      )();
    }

    const hasMore = blogs.length === limit;
    let nextCursor: string | null = null;

    if (hasMore && blogs.length > 0) {
      const lastBlog = blogs[blogs.length - 1];
      const timestamp = onlyPublished ? lastBlog.published_at : lastBlog.created_at;
      if (timestamp) {
        nextCursor = new Date(timestamp).toISOString();
      }
    }

    return {
      blogs,
      nextCursor,
      hasMore
    };
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
    revalidateTag('blog', { expire: 0 });

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
      revalidateTag('blog', { expire: 0 });
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
      revalidateTag('blog', { expire: 0 });
      revalidateTag(`blog_${id}`, 'max');
      if (blog?.slug) revalidateTag(`blog_slug_${blog.slug}`, 'max');
    }

    return success;
  }
}
