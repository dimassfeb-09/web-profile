import { BlogImageRepository } from '@/src/repositories/blog_image.repository';
import { mockQuery } from '../__mocks__/db';
import { createBlogImageData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('BlogImageRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findByBlogId()', () => {
    it('should return images for a specific blog', async () => {
      const mockImages = [createBlogImageData({ blog_id: '123' })];
      mockQuery.mockResolvedValueOnce({ rows: mockImages });

      const result = await BlogImageRepository.findByBlogId('123');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE blog_id = $1'), ['123']);
      expect(result).toEqual(mockImages);
    });
  });

  describe('create()', () => {
    it('should create an image record', async () => {
      const imageData = createBlogImageData();
      mockQuery.mockResolvedValueOnce({ rows: [imageData] });

      const result = await BlogImageRepository.create(imageData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO blog_images'),
        [imageData.blog_id, imageData.file_path, imageData.storage_url, imageData.status]
      );
      expect(result).toEqual(imageData);
    });

    it('should return undefined if no row returned', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await BlogImageRepository.create({} as any);
      expect(result).toBeUndefined();
    });
  });

  describe('updateStatus()', () => {
    it('should update image status', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const result = await BlogImageRepository.updateStatus('img-1', 'active');
      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SET status = $1'), ['active', 'img-1']);
    });

    it('should return false if no image was updated', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      const result = await BlogImageRepository.updateStatus('img-1', 'active');
      expect(result).toBe(false);
    });

    it('should return false if rowCount is null', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: null });
      const result = await BlogImageRepository.updateStatus('img-1', 'active');
      expect(result).toBe(false);
    });
  });

  describe('updateStatusByUrl()', () => {
    it('should update image status by URL', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const result = await BlogImageRepository.updateStatusByUrl('url-1', 'active');
      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE storage_url = $2'), ['active', 'url-1']);
    });

    it('should return false if no image was updated by URL', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      const result = await BlogImageRepository.updateStatusByUrl('url-1', 'active');
      expect(result).toBe(false);
    });

    it('should return false if rowCount is null', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: null });
      const result = await BlogImageRepository.updateStatusByUrl('url-1', 'active');
      expect(result).toBe(false);
    });
  });

  describe('bulkUpdateStatusByBlogId()', () => {
    it('should update multiple image statuses by blog_id', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 3 });
      const result = await BlogImageRepository.bulkUpdateStatusByBlogId('blog-1', 'unused');
      expect(result).toBe(3);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE blog_id = $2'), ['unused', 'blog-1']);
    });

    it('should return 0 if rowCount is null', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: null });
      const result = await BlogImageRepository.bulkUpdateStatusByBlogId('blog-1', 'unused');
      expect(result).toBe(0);
    });
  });

  describe('findUnusedExpired()', () => {
    it('should find unused images older than X hours', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await BlogImageRepository.findUnusedExpired(48);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("status = 'unused'"),
        [48]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("AND updated_at < NOW() - ($1 * INTERVAL '1 hour')"),
        [48]
      );
    });

    it('should use default 24 hours if no argument provided', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await BlogImageRepository.findUnusedExpired();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("AND updated_at < NOW() - ($1 * INTERVAL '1 hour')"),
        [24]
      );
    });
  });

  describe('delete()', () => {
    it('should delete a single image by ID', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const result = await BlogImageRepository.delete('img-1');
      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM blog_images WHERE id = $1'), ['img-1']);
    });

    it('should return false if no image was deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 0 });
      const result = await BlogImageRepository.delete('img-1');
      expect(result).toBe(false);
    });

    it('should return false if rowCount is null', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: null });
      const result = await BlogImageRepository.delete('img-1');
      expect(result).toBe(false);
    });
  });

  describe('deleteByBlogId()', () => {
    it('should delete images by blog_id', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 5 });
      const result = await BlogImageRepository.deleteByBlogId('123');
      expect(result).toBe(5);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM blog_images WHERE blog_id = $1'), ['123']);
    });

    it('should return 0 if no images were deleted', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: null });
      const result = await BlogImageRepository.deleteByBlogId('123');
      expect(result).toBe(0);
    });
  });
});
