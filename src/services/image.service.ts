import { BlogImageRepository } from '../repositories/blog_image.repository';
import { StorageService } from './storage.service';

export class ImageService {
  /**
   * Mark specific images as active for a blog
   */
  static async markImagesActive(blogId: string, usedUrls: string[]): Promise<void> {
    const currentImages = await BlogImageRepository.findByBlogId(blogId);
    
    for (const img of currentImages) {
      const isActive = usedUrls.includes(img.storage_url);
      const newStatus = isActive ? 'active' : 'unused';
      
      if (img.status !== newStatus) {
        await BlogImageRepository.updateStatus(img.id!, newStatus);
      }
    }
  }

  /**
   * Cleanup orphan images that are 'unused' and older than 24 hours
   */
  static async cleanupOrphanImages(): Promise<{ deletedCount: number }> {
    const orphans = await BlogImageRepository.findUnusedExpired(24);
    let count = 0;

    for (const orphan of orphans) {
      try {
        const success = await StorageService.deleteFile(orphan.file_path);
        if (success) {
          await BlogImageRepository.delete(orphan.id!);
          count++;
        }
      } catch (error) {
        console.error(`Failed to cleanup orphan image ${orphan.id}:`, error);
      }
    }

    return { deletedCount: count };
  }

  /**
   * Delete all images associated with a blog from storage and DB
   */
  static async deleteAllBlogImages(blogId: string): Promise<void> {
    // 1. Delete folder from Supabase Storage
    await StorageService.deleteFolder(`blogs/${blogId}`);
    
    // 2. Database records will be deleted via ON DELETE CASCADE in SQL
    // But we'll call repo just in case or if manual control is needed
    // await BlogImageRepository.deleteByBlogId(blogId); 
  }
}
