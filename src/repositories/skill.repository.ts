import pool from '@/src/lib/db';

export interface SkillCategoryData {
  id?: number;
  icon: string;
  title: string;
  skills: string[];
  color_class: string;
  delay_class: string;
}

export class SkillRepository {
  static async findAll(): Promise<SkillCategoryData[]> {
    const query = 'SELECT * FROM skill_categories ORDER BY id ASC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async create(data: SkillCategoryData): Promise<SkillCategoryData> {
    const query = `
      INSERT INTO skill_categories (icon, title, skills, color_class, delay_class)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [data.icon, data.title, data.skills, data.color_class, data.delay_class];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: number, data: Partial<SkillCategoryData>): Promise<SkillCategoryData | null> {
    const query = `
      UPDATE skill_categories 
      SET icon = $1, title = $2, skills = $3, color_class = $4, delay_class = $5
      WHERE id = $6
      RETURNING *
    `;
    const values = [data.icon, data.title, data.skills, data.color_class, data.delay_class, id];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM skill_categories WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
