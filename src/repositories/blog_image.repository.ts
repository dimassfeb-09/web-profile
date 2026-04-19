import pool from '@/src/lib/db';

export type ImageStatus = 'active' | 'unused';

export interface BlogImageData {
  id?: string;
  blog_id: string;
  file_path: string;
  storage_url: string;
  status: ImageStatus;
  created_at?: Date;
  updated_at?: Date;
}

export class BlogImageRepository {
  static async findByBlogId(blogId: string): Promise<BlogImageData[]> {
    const query = 'SELECT * FROM blog_images WHERE blog_id = $1';
    const { rows } = await pool.query(query, [blogId]);
    return rows;
  }

  static async create(data: BlogImageData): Promise<BlogImageData> {
    const query = `
      INSERT INTO blog_images (blog_id, file_path, storage_url, status)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [data.blog_id, data.file_path, data.storage_url, data.status];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async updateStatus(id: string, status: ImageStatus): Promise<boolean> {
    const query = 'UPDATE blog_images SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2';
    const { rowCount } = await pool.query(query, [status, id]);
    return (rowCount ?? 0) > 0;
  }

  static async updateStatusByUrl(url: string, status: ImageStatus): Promise<boolean> {
    const query = 'UPDATE blog_images SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE storage_url = $2';
    const { rowCount } = await pool.query(query, [status, url]);
    return (rowCount ?? 0) > 0;
  }

  static async bulkUpdateStatusByBlogId(blogId: string, status: ImageStatus): Promise<number> {
    const query = 'UPDATE blog_images SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE blog_id = $2';
    const { rowCount } = await pool.query(query, [status, blogId]);
    return rowCount ?? 0;
  }

  static async findUnusedExpired(hours: number = 24): Promise<BlogImageData[]> {
    const safeHours = Math.max(1, Math.floor(Number(hours)));
    const query = `
      SELECT * FROM blog_images 
      WHERE status = 'unused' 
      AND updated_at < NOW() - ($1 * INTERVAL '1 hour')
    `;
    const { rows } = await pool.query(query, [safeHours]);
    return rows;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM blog_images WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }

  static async deleteByBlogId(blogId: string): Promise<number> {
    const query = 'DELETE FROM blog_images WHERE blog_id = $1';
    const { rowCount } = await pool.query(query, [blogId]);
    return rowCount ?? 0;
  }
}
