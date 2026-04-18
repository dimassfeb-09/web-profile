import pool from '@/src/lib/db';

export interface HomeData {
  badge_text: string;
  headline: string;
  subheadline: string;
  description: string;
  cv_url: string;
}

export class HomeRepository {
  static async findFirst(): Promise<HomeData | null> {
    const query = 'SELECT badge_text, headline, subheadline, description, cv_url FROM home_section LIMIT 1';
    const { rows } = await pool.query(query);
    return rows[0] || null;
  }

  static async update(data: HomeData): Promise<HomeData | null> {
    const query = `
      UPDATE home_section 
      SET badge_text = $1, headline = $2, subheadline = $3, description = $4, cv_url = $5
      WHERE id = (SELECT id FROM home_section LIMIT 1)
      RETURNING *
    `;
    const values = [data.badge_text, data.headline, data.subheadline, data.description, data.cv_url];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
}
