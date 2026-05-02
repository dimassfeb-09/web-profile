import pool from '@/src/lib/db';

export interface ExperienceData {
  id?: number;
  role: string;
  company: string;
  start_date: string | Date;
  end_date: string | Date | null;
  description: string[];
  tags?: string[];
}

export class ExperienceRepository {
  static async findAll(limit?: number, offset?: number): Promise<ExperienceData[]> {
    let query = `
      SELECT id, role, company, start_date, end_date, description, tags
      FROM experiences 
      ORDER BY (end_date IS NULL) DESC, end_date DESC, start_date DESC
    `;
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

  static async create(data: ExperienceData): Promise<ExperienceData> {
    const query = `
      INSERT INTO experiences (role, company, start_date, end_date, description, tags)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [data.role, data.company, data.start_date, data.end_date, data.description, data.tags || []];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: number, data: Partial<ExperienceData>): Promise<ExperienceData | null> {
    const query = `
      UPDATE experiences 
      SET role = $1, company = $2, start_date = $3, end_date = $4, description = $5, tags = $6
      WHERE id = $7
      RETURNING *
    `;
    const values = [data.role, data.company, data.start_date, data.end_date, data.description, data.tags || [], id];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM experiences WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
