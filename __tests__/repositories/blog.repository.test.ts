import { BlogRepository } from '@/src/repositories/blog.repository';
import { mockQuery } from '../__mocks__/db';
import { createBlogData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('BlogRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('should return all blogs ordered by created_at DESC (default)', async () => {
      const mockBlogs = [createBlogData({ title: 'Blog 1' }), createBlogData({ title: 'Blog 2' })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      const result = await BlogRepository.findAll({});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at DESC'),
        [9]
      );
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockBlogs);
    });

    it('should return all blogs ordered by created_at ASC (oldest)', async () => {
      const mockBlogs = [createBlogData({ title: 'Blog 2' }), createBlogData({ title: 'Blog 1' })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      const result = await BlogRepository.findAll({ sort: 'oldest' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at ASC'),
        [9]
      );
      expect(result).toEqual(mockBlogs);
    });

    it('should filter blogs by title or slug when search is provided', async () => {
      const mockBlogs = [createBlogData({ title: 'Next.js Guide' })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      await BlogRepository.findAll({ search: 'Next' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('(title ILIKE $1 OR slug ILIKE $1)'),
        ['%Next%', 9]
      );
    });

    it('should work with default options when no arguments provided', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await BlogRepository.findAll();
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('LIMIT $1'), [9]);
    });

    it('should return only published blogs when onlyPublished is true', async () => {
      const mockBlogs = [createBlogData({ title: 'Published Blog', is_published: true })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      await BlogRepository.findAll({ onlyPublished: true });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('is_published = true'),
        [9]
      );
    });

    it('should apply cursor filter when provided', async () => {
      const cursor = new Date().toISOString();
      const mockBlogs = [createBlogData({ title: 'Old Blog' })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });
      
      await BlogRepository.findAll({ cursor });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('created_at < $1'),
        [cursor, 9]
      );
    });

    it('should apply cursor with ASC operator when sort is oldest', async () => {
      const cursor = new Date().toISOString();
      mockQuery.mockResolvedValueOnce({ rows: [] });
      
      await BlogRepository.findAll({ cursor, sort: 'oldest' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('created_at > $1'),
        [cursor, 9]
      );
    });
  });

  describe('findById()', () => {
    it('should return a blog by id', async () => {
      const mockBlog = createBlogData({ id: '123' });
      mockQuery.mockResolvedValueOnce({ rows: [mockBlog] });

      const result = await BlogRepository.findById('123');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE id = $1'), ['123']);
      expect(result).toEqual(mockBlog);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await BlogRepository.findById('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('findBySlug()', () => {
    it('should return a blog by slug', async () => {
      const mockBlog = createBlogData({ slug: 'test-slug' });
      mockQuery.mockResolvedValueOnce({ rows: [mockBlog] });

      const result = await BlogRepository.findBySlug('test-slug');

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('WHERE slug = $1'), ['test-slug']);
      expect(result).toEqual(mockBlog);
    });

    it('should return null if not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      const result = await BlogRepository.findBySlug('non-existent');
      expect(result).toBeNull();
    });
  });

  describe('create()', () => {
    it('should create a blog with UPSERT logic', async () => {
      const blogData = createBlogData({ id: 'new-id', title: 'New Blog' });
      mockQuery.mockResolvedValueOnce({ rows: [blogData] });

      const result = await BlogRepository.create(blogData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO blogs'),
        expect.arrayContaining([blogData.id, blogData.title, blogData.slug])
      );
      expect(result).toEqual(blogData);
    });

    it('should set published_at if is_published is true during creation', async () => {
      const blogData = createBlogData({ id: 'new-id', is_published: true });
      mockQuery.mockResolvedValueOnce({ rows: [blogData] });

      await BlogRepository.create(blogData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([true, expect.any(Date)])
      );
    });

    it('should set excerpt to null if missing', async () => {
      const blogData = createBlogData({ excerpt: undefined });
      mockQuery.mockResolvedValueOnce({ rows: [blogData] });
      await BlogRepository.create(blogData);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([null])
      );
    });
  });

  describe('update()', () => {
    it('should update specific fields', async () => {
      const id = '123';
      const updateData = { title: 'Updated Title' };
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: false }] });
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ ...updateData, id })] });

      const result = await BlogRepository.update(id, updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE blogs'),
        ['Updated Title', id]
      );
      expect(result?.title).toBe('Updated Title');
    });

    it('should handle is_published transition and set published_at', async () => {
      const id = '123';
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: false }] });
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ is_published: true, id })] });

      await BlogRepository.update(id, { is_published: true });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('published_at = $2'),
        expect.arrayContaining([true, expect.any(Date), id])
      );
    });

    it('should update all optional fields (slug, excerpt, content)', async () => {
      const id = '123';
      const updateData = {
        slug: 'new-slug',
        excerpt: 'new-excerpt',
        content: { type: 'doc' }
      };
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: true }] });
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ ...updateData, id })] });

      await BlogRepository.update(id, updateData);

      expect(mockQuery).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/UPDATE blogs\s+SET slug = \$1, excerpt = \$2, content = \$3/i),
        ['new-slug', 'new-excerpt', { type: 'doc' }, id]
      );
    });

    it('should not update published_at if is_published: true is sent but it was already published', async () => {
      const id = '123';
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: true }] });
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ id, is_published: true })] });

      await BlogRepository.update(id, { is_published: true });

      expect(mockQuery).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/UPDATE blogs\s+SET is_published = \$1/i),
        [true, id]
      );
    });

    it('should return null if blog to update not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      mockQuery.mockResolvedValueOnce({ rows: [] });

      const result = await BlogRepository.update('non-existent', { title: 'New' });
      expect(result).toBeNull();
    });

    it('should return current blog if no fields provided to update', async () => {
      const id = '123';
      const mockBlog = createBlogData({ id });
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: true }] });
      mockQuery.mockResolvedValueOnce({ rows: [mockBlog] });
      const result = await BlogRepository.update(id, {});
      expect(result).toEqual(mockBlog);
      expect(mockQuery).toHaveBeenNthCalledWith(2, expect.stringContaining('SELECT * FROM blogs WHERE id = $1'), [id]);
    });
  });

  describe('delete()', () => {
    it('should delete a blog', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: 1 });
      const result = await BlogRepository.delete('123');
      expect(result).toBe(true);
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM blogs WHERE id = $1'), ['123']);
    });

    it('should return false if rowCount is null', async () => {
      mockQuery.mockResolvedValueOnce({ rowCount: null });
      const result = await BlogRepository.delete('123');
      expect(result).toBe(false);
    });
  });

  describe('findRelated()', () => {
    it('should return related blogs', async () => {
      const mockBlogs = [createBlogData({ title: 'Related 1' })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      const result = await BlogRepository.findRelated('current-slug', 2);

      expect(result).toEqual(mockBlogs);
    });

    it('should use default limit', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] });
      await BlogRepository.findRelated('current');
      expect(mockQuery).toHaveBeenCalledWith(expect.any(String), ['current', 3]);
    });
  });
});
