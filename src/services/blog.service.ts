import { BlogRepository, BlogData } from '../repositories/blog.repository';
import { ImageService } from './image.service';
import { JSONContent } from '@tiptap/react';

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

  static async getAllBlogs(onlyPublished = false): Promise<BlogData[]> {
    return BlogRepository.findAll(onlyPublished);
  }

  static async getBlogById(id: string): Promise<BlogData | null> {
    return BlogRepository.findById(id);
  }

  static async getBlogBySlug(slug: string): Promise<BlogData | null> {
    return BlogRepository.findBySlug(slug);
  }

  static async createBlog(data: BlogData): Promise<BlogData> {
    // 1. Save Blog to DB
    const blog = await BlogRepository.create(data);
    
    // 2. Extract used images from content
    const usedUrls = this.extractImageUrls(data.content);
    
    // 3. Mark extracted images as active
    await ImageService.markImagesActive(blog.id, usedUrls);
    
    return blog;
  }

  static async updateBlog(id: string, data: Partial<BlogData>): Promise<BlogData | null> {
    // 1. Update Blog in DB
    const blog = await BlogRepository.update(id, data);
    
    if (blog && data.content) {
      // 2. If content was updated, sync image statuses
      const usedUrls = this.extractImageUrls(data.content);
      await ImageService.markImagesActive(id, usedUrls);
    }
    
    return blog;
  }

  static async deleteBlog(id: string): Promise<boolean> {
    // 1. Cleanup images from storage first
    await ImageService.deleteAllBlogImages(id);
    
    // 2. Delete blog from DB (cascades to blog_images records)
    return BlogRepository.delete(id);
  }
}
