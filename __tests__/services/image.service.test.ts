import { ImageService } from '@/src/services/image.service';
import { BlogImageRepository } from '@/src/repositories/blog_image.repository';
import { StorageService } from '@/src/services/storage.service';
import { createBlogImageData } from '../helpers/factories';

jest.mock('@/src/repositories/blog_image.repository');
jest.mock('@/src/services/storage.service');

describe('ImageService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('markImagesActive()', () => {
    it('should set status to active for used URLs and unused for others', async () => {
      const blogId = '123';
      const mockImages = [
        createBlogImageData({ id: 'img1', storage_url: 'url1', status: 'unused' }),
        createBlogImageData({ id: 'img2', storage_url: 'url2', status: 'active' }),
      ];
      (BlogImageRepository.findByBlogId as jest.Mock).mockResolvedValue(mockImages);

      await ImageService.markImagesActive(blogId, ['url1']);

      // img1: unused -> active (update)
      expect(BlogImageRepository.updateStatus).toHaveBeenCalledWith('img1', 'active');
      // img2: active -> unused (update)
      expect(BlogImageRepository.updateStatus).toHaveBeenCalledWith('img2', 'unused');
    });

    it('should not update status if it is already correct', async () => {
      const mockImages = [
        createBlogImageData({ id: 'img1', storage_url: 'url1', status: 'active' }),
      ];
      (BlogImageRepository.findByBlogId as jest.Mock).mockResolvedValue(mockImages);

      await ImageService.markImagesActive('123', ['url1']);

      expect(BlogImageRepository.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe('cleanupOrphanImages()', () => {
    it('should delete unused expired images from storage and db', async () => {
      const mockOrphans = [
        createBlogImageData({ id: 'img1', file_path: 'path1' })
      ];
      (BlogImageRepository.findUnusedExpired as jest.Mock).mockResolvedValue(mockOrphans);
      (StorageService.deleteFile as jest.Mock).mockResolvedValue(true);

      const result = await ImageService.cleanupOrphanImages();

      expect(StorageService.deleteFile).toHaveBeenCalledWith('path1');
      expect(BlogImageRepository.delete).toHaveBeenCalledWith('img1');
      expect(result.deletedCount).toBe(1);
    });

    it('should not delete from db if storage deletion fails', async () => {
      const mockOrphans = [createBlogImageData({ id: 'img1', file_path: 'path1' })];
      (BlogImageRepository.findUnusedExpired as jest.Mock).mockResolvedValue(mockOrphans);
      (StorageService.deleteFile as jest.Mock).mockResolvedValue(false);

      const result = await ImageService.cleanupOrphanImages();

      expect(BlogImageRepository.delete).not.toHaveBeenCalled();
      expect(result.deletedCount).toBe(0);
    });

    it('should catch and log errors during cleanup', async () => {
      const mockOrphans = [createBlogImageData({ id: 'img1', file_path: 'path1' })];
      (BlogImageRepository.findUnusedExpired as jest.Mock).mockResolvedValue(mockOrphans);
      (StorageService.deleteFile as jest.Mock).mockRejectedValue(new Error('Network error'));
      
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = await ImageService.cleanupOrphanImages();
      
      expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Failed to cleanup orphan image img1'), expect.any(Error));
      expect(result.deletedCount).toBe(0);
      
      consoleSpy.mockRestore();
    });
  });

  describe('deleteAllBlogImages()', () => {
    it('should delete the blog storage folder', async () => {
      await ImageService.deleteAllBlogImages('blog-123');
      expect(StorageService.deleteFolder).toHaveBeenCalledWith('blogs/blog-123');
    });
  });
});
