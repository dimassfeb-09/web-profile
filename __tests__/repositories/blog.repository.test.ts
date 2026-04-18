import { BlogRepository } from '@/src/repositories/blog.repository';
import { mockQuery } from '../__mocks__/db';
import { createBlogData } from '../helpers/factories';

jest.mock('@/src/lib/db', () => require('../__mocks__/db').default);

describe('BlogRepository', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll()', () => {
    it('should return all blogs ordered by created_at', async () => {
      const mockBlogs = [createBlogData({ title: 'Blog 1' }), createBlogData({ title: 'Blog 2' })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      const result = await BlogRepository.findAll();

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM blogs ORDER BY created_at DESC'));
      expect(result).toHaveLength(2);
      expect(result).toEqual(mockBlogs);
    });

    it('should return only published blogs when onlyPublished is true', async () => {
      const mockBlogs = [createBlogData({ title: 'Published Blog', is_published: true })];
      mockQuery.mockResolvedValueOnce({ rows: mockBlogs });

      await BlogRepository.findAll(true);

      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('is_published = true'));
      expect(mockQuery).toHaveBeenCalledWith(expect.stringContaining('ORDER BY published_at DESC'));
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
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT (id) DO UPDATE'),
        expect.any(Array)
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

    it('should handle optional excerpt and unpublished state', async () => {
      const blogData = createBlogData({ excerpt: undefined, is_published: false });
      mockQuery.mockResolvedValueOnce({ rows: [blogData] });

      await BlogRepository.create(blogData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.any(String),
        expect.arrayContaining([null, false, null])
      );
    });
  });

  describe('update()', () => {
    it('should update specific fields', async () => {
      const id = '123';
      const updateData = { title: 'Updated Title' };
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: false }] }); // current state
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ ...updateData, id })] }); // update result

      const result = await BlogRepository.update(id, updateData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE blogs'),
        ['Updated Title', id]
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SET title = $1'),
        ['Updated Title', id]
      );
      expect(result?.title).toBe('Updated Title');
    });

    it('should handle is_published transition', async () => {
      const id = '123';
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: false }] }); // current state (not published)
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ is_published: true, id })] }); // update result

      await BlogRepository.update(id, { is_published: true });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('is_published = $1'),
        expect.arrayContaining([true, expect.any(Date), id])
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('published_at = $2'),
        expect.arrayContaining([true, expect.any(Date), id])
      );
    });

    it('should return null if blog to update not found', async () => {
      mockQuery.mockResolvedValueOnce({ rows: [] }); // currentRows for wasPublished check
      mockQuery.mockResolvedValueOnce({ rows: [] }); // update result

      const result = await BlogRepository.update('non-existent', { title: 'New' });
      expect(result).toBeNull();
    });

    it('should update all possible optional fields', async () => {
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

    it('should handle is_published: true when wasPublished: true', async () => {
      const id = '123';
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: true }] });
      mockQuery.mockResolvedValueOnce({ rows: [createBlogData({ id, is_published: true })] });

      await BlogRepository.update(id, { is_published: true });

      // Should ONLY update is_published, NOT published_at
      expect(mockQuery).toHaveBeenNthCalledWith(2,
        expect.stringMatching(/UPDATE blogs\s+SET is_published = \$1/i),
        [true, id]
      );
    });

    it('should return findById result if no fields provided', async () => {
      const blog = createBlogData({ id: '123' });
      mockQuery.mockResolvedValueOnce({ rows: [{ is_published: false }] });
      mockQuery.mockResolvedValueOnce({ rows: [blog] }); // findById call

      const result = await BlogRepository.update('123', {});
      expect(result).toEqual(blog);
      expect(mockQuery).toHaveBeenLastCalledWith(expect.stringContaining('SELECT * FROM blogs WHERE id = $1'), ['123']);
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
});
