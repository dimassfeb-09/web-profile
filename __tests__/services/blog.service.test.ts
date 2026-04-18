import { BlogService } from '@/src/services/blog.service';
import { BlogRepository } from '@/src/repositories/blog.repository';
import { ImageService } from '@/src/services/image.service';
import { createBlogData } from '../helpers/factories';

jest.mock('@/src/repositories/blog.repository');
jest.mock('@/src/services/image.service');

describe('BlogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('accessors', () => {
    it('should call BlogRepository.findAll with default parameter', async () => {
      await BlogService.getAllBlogs();
      expect(BlogRepository.findAll).toHaveBeenCalledWith(false);
    });

    it('should call BlogRepository.findAll', async () => {
      await BlogService.getAllBlogs(true);
      expect(BlogRepository.findAll).toHaveBeenCalledWith(true);
    });

    it('should call BlogRepository.findById', async () => {
      await BlogService.getBlogById('123');
      expect(BlogRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should call BlogRepository.getBlogBySlug', async () => {
      await BlogService.getBlogBySlug('test-slug');
      expect(BlogRepository.findBySlug).toHaveBeenCalledWith('test-slug');
    });
  });

  describe('createBlog()', () => {
    it('should create a blog and mark images as active', async () => {
      const blogData = createBlogData({
        content: {
          type: 'doc',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Hey' }] },
            { type: 'image', attrs: { src: 'https://example.com/img1.png' } }
          ]
        }
      });
      (BlogRepository.create as jest.Mock).mockResolvedValue(blogData);

      const result = await BlogService.createBlog(blogData);

      expect(BlogRepository.create).toHaveBeenCalledWith(blogData);
      expect(ImageService.markImagesActive).toHaveBeenCalledWith(
        blogData.id,
        ['https://example.com/img1.png']
      );
      expect(result).toEqual(blogData);
    });

    it('should handle images without src or incorrect structure during extraction', async () => {
      const blogData = createBlogData({
        content: {
          type: 'doc',
          content: [
            { type: 'image', attrs: {} }, // missing src
            { type: 'image' }, // missing attrs
            { type: 'paragraph', content: [{ type: 'image', attrs: { src: 'nested.png' } }] }
          ]
        }
      });
      (BlogRepository.create as jest.Mock).mockResolvedValue(blogData);

      await BlogService.createBlog(blogData);

      expect(ImageService.markImagesActive).toHaveBeenCalledWith(
        expect.any(String),
        ['nested.png']
      );
    });
  });

  describe('updateBlog()', () => {
    it('should update a blog and sync images if content is provided', async () => {
      const id = '123';
      const updateData = {
        title: 'New Title',
        content: {
          type: 'doc',
          content: [{ type: 'image', attrs: { src: 'https://example.com/img2.png' } }]
        }
      };
      const updatedBlog = createBlogData({ ...updateData, id });
      (BlogRepository.update as jest.Mock).mockResolvedValue(updatedBlog);

      await BlogService.updateBlog(id, updateData);

      expect(BlogRepository.update).toHaveBeenCalledWith(id, updateData);
      expect(ImageService.markImagesActive).toHaveBeenCalledWith(
        id,
        ['https://example.com/img2.png']
      );
    });

    it('should not sync images if content is not updated', async () => {
      const id = '123';
      const updateData = { title: 'New Title' };
      (BlogRepository.update as jest.Mock).mockResolvedValue(createBlogData({ id }));

      await BlogService.updateBlog(id, updateData);

      expect(ImageService.markImagesActive).not.toHaveBeenCalled();
    });
  });

  describe('deleteBlog()', () => {
    it('should cleanup images before deleting blog', async () => {
      const id = '123';
      (BlogRepository.delete as jest.Mock).mockResolvedValue(true);

      const result = await BlogService.deleteBlog(id);

      expect(ImageService.deleteAllBlogImages).toHaveBeenCalledWith(id);
      expect(BlogRepository.delete).toHaveBeenCalledWith(id);
      expect(result).toBe(true);
    });
  });
});
