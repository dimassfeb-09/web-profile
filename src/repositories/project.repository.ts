import pool from '@/src/lib/db';

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
  // Detail fields
  slug?: string;
  long_description?: string | null;
  tech_stack?: string[];
  screenshots?: string[];
  status?: string;
  date?: string | Date | null;
  external_links?: Record<string, string> | null;
  image_hash?: string | null;
  created_at?: Date;
}

export class ProjectRepository {
  static async findAll(sort: 'newest' | 'oldest' = 'newest', limit?: number, offset?: number): Promise<ProjectData[]> {
    const order = sort === 'oldest' ? 'ASC' : 'DESC';
    let query = `SELECT * FROM projects ORDER BY created_at ${order}, id ${order}`;
    const values = [];

    if (limit !== undefined) {
      query += ` LIMIT $${values.length + 1}`;
      values.push(limit);
    }
    if (offset !== undefined) {
      query += ` OFFSET $${values.length + 1}`;
      values.push(offset);
    }

    const { rows } = await pool.query(query, values);
    return rows;
  }

  static async findById(id: string): Promise<ProjectData | null> {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async findBySlug(slug: string): Promise<ProjectData | null> {
    const query = 'SELECT * FROM projects WHERE slug = $1';
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  }

  static async create(data: ProjectData): Promise<ProjectData> {
    const query = `
      INSERT INTO projects (
        title, description, image_url, features, link_url, link_text,
        slug, long_description, tech_stack, screenshots, status, date, external_links, image_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.features,
      data.link_url,
      data.link_text,
      data.slug || null,
      data.long_description || null,
      data.tech_stack || [],
      data.screenshots || [],
      data.status || 'completed',
      data.date || null,
      data.external_links ? JSON.stringify(data.external_links) : null,
      data.image_hash || null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<ProjectData>): Promise<ProjectData | null> {
    const query = `
      UPDATE projects 
      SET 
        title = $1, description = $2, image_url = $3, features = $4,
        link_url = $5, link_text = $6, slug = $7, long_description = $8,
        tech_stack = $9, screenshots = $10, status = $11, date = $12,
        external_links = $13, image_hash = $14
      WHERE id = $15
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.features,
      data.link_url,
      data.link_text,
      data.slug || null,
      data.long_description || null,
      data.tech_stack || [],
      data.screenshots || [],
      data.status || 'completed',
      data.date || null,
      data.external_links ? JSON.stringify(data.external_links) : null,
      data.image_hash || null,
      id,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM projects WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
