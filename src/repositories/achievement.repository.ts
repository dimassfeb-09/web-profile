import pool from '@/src/lib/db';

export interface AchievementData {
  id?: string;
  title: string;
  description: string;
  image_url: string | null;
  date: string | Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export class AchievementRepository {
  static async findAll(sort: 'newest' | 'oldest' = 'newest'): Promise<AchievementData[]> {
    const order = sort === 'oldest' ? 'ASC' : 'DESC';
    const query = `SELECT * FROM achievements ORDER BY created_at ${order}`;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id: string): Promise<AchievementData | null> {
    const query = 'SELECT * FROM achievements WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async create(data: AchievementData): Promise<AchievementData> {
    const query = `
      INSERT INTO achievements (title, description, image_url, date)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.date
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<AchievementData>): Promise<AchievementData | null> {
    const query = `
      UPDATE achievements 
      SET title = $1, description = $2, image_url = $3, date = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.date,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM achievements WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
