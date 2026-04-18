import pool from '@/src/lib/db';

export interface AboutData {
  headline: string;
  paragraphs: string[];
}

export class AboutRepository {
  static async findFirst(): Promise<AboutData | null> {
    const query = 'SELECT headline, paragraphs FROM about_section LIMIT 1';
    const { rows } = await pool.query(query);
    return rows[0] || null;
  }

  static async update(data: AboutData): Promise<AboutData | null> {
    const query = `
      UPDATE about_section 
      SET headline = $1, paragraphs = $2
      WHERE id = (SELECT id FROM about_section LIMIT 1)
      RETURNING *
    `;
    const values = [data.headline, data.paragraphs];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
}
