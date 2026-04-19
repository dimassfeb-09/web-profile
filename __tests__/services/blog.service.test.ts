import { BlogService } from '@/src/services/blog.service';
import { BlogRepository } from '@/src/repositories/blog.repository';
import { ImageService } from '@/src/services/image.service';
import { createBlogData } from '../helpers/factories';
import { revalidateTag } from 'next/cache';

jest.mock('@/src/repositories/blog.repository');
jest.mock('@/src/services/image.service');
jest.mock('next/cache', () => ({
  revalidateTag: jest.fn(),
  unstable_cache: jest.fn((fn) => fn),
}));

describe('BlogService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('accessors', () => {
    it('should call BlogRepository.findAll with default parameter', async () => {
      (BlogRepository.findAll as jest.Mock).mockResolvedValue([]);
      const result = await BlogService.getAllBlogs();
      expect(BlogRepository.findAll).toHaveBeenCalledWith({ onlyPublished: false, cursor: null, limit: 9 });
      expect(result).toEqual({ blogs: [], nextCursor: null, hasMore: false });
    });

    it('should call BlogRepository.findAll with specific options', async () => {
      (BlogRepository.findAll as jest.Mock).mockResolvedValue([]);
      const result = await BlogService.getAllBlogs({ onlyPublished: true, limit: 12 });
      expect(BlogRepository.findAll).toHaveBeenCalledWith({ onlyPublished: true, cursor: null, limit: 12 });
      expect(result).toEqual({ blogs: [], nextCursor: null, hasMore: false });
    });

    it('should return nextCursor and hasMore true when blogs length equals limit', async () => {
      const limit = 2;
      const mockResult = [
        createBlogData({ id: '1', created_at: new Date('2026-01-02') }),
        createBlogData({ id: '2', created_at: new Date('2026-01-01') })
      ];
      (BlogRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await BlogService.getAllBlogs({ limit });

      expect(result.hasMore).toBe(true);
      expect(result.nextCursor).toBe(new Date('2026-01-01').toISOString());
      expect(result.blogs).toHaveLength(2);
    });

    it('should use published_at for nextCursor when onlyPublished is true', async () => {
      const limit = 1;
      const publishedAt = new Date('2026-02-01');
      const mockResult = [
        createBlogData({ id: '1', is_published: true, published_at: publishedAt })
      ];
      (BlogRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await BlogService.getAllBlogs({ onlyPublished: true, limit });

      expect(result.nextCursor).toBe(publishedAt.toISOString());
    });

    it('should not set nextCursor if last blog has no timestamp', async () => {
      const limit = 1;
      const mockResult = [
        createBlogData({ id: '1', created_at: undefined as any })
      ];
      (BlogRepository.findAll as jest.Mock).mockResolvedValue(mockResult);

      const result = await BlogService.getAllBlogs({ limit });

      expect(result.nextCursor).toBeNull();
    });

    it('should call BlogRepository.findAll with cursor', async () => {
      const cursor = '2026-01-01T00:00:00.000Z';
      (BlogRepository.findAll as jest.Mock).mockResolvedValue([]);
      await BlogService.getAllBlogs({ cursor });
      expect(BlogRepository.findAll).toHaveBeenCalledWith({ onlyPublished: false, cursor, limit: 9 });
    });

    it('should call BlogRepository.findById', async () => {
      await BlogService.getBlogById('123');
      expect(BlogRepository.findById).toHaveBeenCalledWith('123');
    });

    it('should call BlogRepository.findBySlug', async () => {
      await BlogService.getBlogBySlug('test-slug');
      expect(BlogRepository.findBySlug).toHaveBeenCalledWith('test-slug');
    });

    it('should bypass cache in all accessor methods', async () => {
      (BlogRepository.findAll as jest.Mock).mockResolvedValue([]);
      await BlogService.getAllBlogs({ bypassCache: true });
      expect(BlogRepository.findAll).toHaveBeenCalledWith({ onlyPublished: false, cursor: null, limit: 9 });

      await BlogService.getBlogById('123', true);
      expect(BlogRepository.findById).toHaveBeenCalledWith('123');

      await BlogService.getBlogBySlug('slug', true);
      expect(BlogRepository.findBySlug).toHaveBeenCalledWith('slug');
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
      expect(revalidateTag).toHaveBeenCalledWith('blog', { expire: 0 });
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
      expect(revalidateTag).toHaveBeenCalledWith('blog', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`blog_${id}`, { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`blog_slug_${updatedBlog.slug}`, { expire: 0 });
    });

    it('should not revalidate slug tag if slug is missing during update', async () => {
      const id = '123';
      const updatedBlog = createBlogData({ id, slug: '' }); // Missing slug
      (BlogRepository.update as jest.Mock).mockResolvedValue(updatedBlog);

      await BlogService.updateBlog(id, { title: 'No Slug' });

      expect(revalidateTag).not.toHaveBeenCalledWith(expect.stringContaining('blog_slug_'), 'max');
    });

    it('should handle blog not found', async () => {
      (BlogRepository.update as jest.Mock).mockResolvedValue(null);
      const result = await BlogService.updateBlog('123', {});
      expect(result).toBeNull();
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
      expect(revalidateTag).toHaveBeenCalledWith('blog', { expire: 0 });
      expect(revalidateTag).toHaveBeenCalledWith(`blog_${id}`, { expire: 0 });
      expect(result).toBe(true);
    });

    it('should handle slug revalidation on delete', async () => {
      const id = '123';
      const blog = createBlogData({ id, slug: 'deleted-slug' });
      (BlogRepository.findById as jest.Mock).mockResolvedValue(blog);
      (BlogRepository.delete as jest.Mock).mockResolvedValue(true);

      await BlogService.deleteBlog(id);

      expect(revalidateTag).toHaveBeenCalledWith('blog_slug_deleted-slug', { expire: 0 });
    });

    it('should not revalidate slug tag if slug is missing during delete', async () => {
      const id = '123';
      const blog = createBlogData({ id, slug: '' }); // Missing slug
      (BlogRepository.findById as jest.Mock).mockResolvedValue(blog);
      (BlogRepository.delete as jest.Mock).mockResolvedValue(true);

      await BlogService.deleteBlog(id);

      expect(revalidateTag).not.toHaveBeenCalledWith(expect.stringContaining('blog_slug_'), 'max');
    });

    it('should handle delete failure', async () => {
      const id = '123';
      (BlogRepository.delete as jest.Mock).mockResolvedValue(false);
      const result = await BlogService.deleteBlog(id);
      expect(result).toBe(false);
      expect(revalidateTag).not.toHaveBeenCalledWith('blog', { expire: 0 });
    });
  });
});
