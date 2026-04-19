import pool from '@/src/lib/db';
import { JSONContent } from '@tiptap/react';

export interface BlogData {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: JSONContent;
  is_published: boolean;
  published_at?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export class BlogRepository {
  static async findAll(options: { onlyPublished?: boolean; cursor?: Date | string | null; limit?: number } = {}): Promise<BlogData[]> {
    const { onlyPublished = false, cursor, limit = 9 } = options;
    
    const conditions: string[] = [];
    const values: any[] = [];
    let i = 1;

    const timestampColumn = onlyPublished ? 'published_at' : 'created_at';
    const orderBy = `ORDER BY ${timestampColumn} DESC`;

    if (onlyPublished) {
      conditions.push(`is_published = true`);
    }

    if (cursor) {
      conditions.push(`${timestampColumn} < $${i++}`);
      values.push(cursor);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    values.push(limit);
    const query = `
      SELECT * FROM blogs 
      ${whereClause}
      ${orderBy}
      LIMIT $${i}
    `;

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async findById(id: string): Promise<BlogData | null> {
    const query = 'SELECT * FROM blogs WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<BlogData | null> {
    const query = 'SELECT * FROM blogs WHERE slug = $1';
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  }

  static async create(data: BlogData): Promise<BlogData> {
    const query = `
      INSERT INTO blogs (id, title, slug, excerpt, content, is_published, published_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        slug = EXCLUDED.slug,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        is_published = EXCLUDED.is_published,
        published_at = EXCLUDED.published_at,
        updated_at = CURRENT_TIMESTAMP
      RETURNING *
    `;
    const values = [
      data.id,
      data.title,
      data.slug,
      data.excerpt || null,
      data.content,
      data.is_published,
      data.is_published ? new Date() : null
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<BlogData>): Promise<BlogData | null> {
    const { rows: currentRows } = await pool.query('SELECT is_published FROM blogs WHERE id = $1', [id]);
    const wasPublished = currentRows[0]?.is_published;

    // Build dynamic update query
    const fields: string[] = [];
    const values: any[] = [];
    let i = 1;

    if (data.title !== undefined) { fields.push(`title = $${i++}`); values.push(data.title); }
    if (data.slug !== undefined) { fields.push(`slug = $${i++}`); values.push(data.slug); }
    if (data.excerpt !== undefined) { fields.push(`excerpt = $${i++}`); values.push(data.excerpt); }
    if (data.content !== undefined) { fields.push(`content = $${i++}`); values.push(data.content); }
    if (data.is_published !== undefined) { 
      fields.push(`is_published = $${i++}`); 
      values.push(data.is_published);
      if (data.is_published && !wasPublished) {
        fields.push(`published_at = $${i++}`);
        values.push(new Date());
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const query = `
      UPDATE blogs 
      SET ${fields.join(', ')} 
      WHERE id = $${i} 
      RETURNING *
    `;
    
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM blogs WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
