import pool from '@/src/lib/db';

export interface ProjectData {
  id?: string;
  title: string;
  description: string;
  image_url: string;
  features: string[];
  link_url: string;
  link_text: string;
}

export class ProjectRepository {
  static async findAll(): Promise<ProjectData[]> {
    const query = 'SELECT * FROM projects ORDER BY id DESC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id: string): Promise<ProjectData | null> {
    const query = 'SELECT * FROM projects WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async create(data: ProjectData): Promise<ProjectData> {
    const query = `
      INSERT INTO projects (title, description, image_url, features, link_url, link_text)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.features,
      data.link_url,
      data.link_text
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<ProjectData>): Promise<ProjectData | null> {
    const query = `
      UPDATE projects 
      SET title = $1, description = $2, image_url = $3, features = $4, link_url = $5, link_text = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.features,
      data.link_url,
      data.link_text,
      id
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
