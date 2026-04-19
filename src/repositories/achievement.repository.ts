import pool from '@/src/lib/db';

export interface AchievementData {
  id?: string;
  title: string;
  description: string;
  image_url: string | null;
  date: string | Date | null;
  event_organizer?: string | null;
  category?: string | null;
  team_members?: string[] | null;
  tech_stack?: string[] | null;
  problem_statement?: string | null;
  solution_overview?: string | null;
  credential_url?: string | null;
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
      INSERT INTO achievements (
        title, description, image_url, date,
        event_organizer, category, team_members,
        tech_stack, problem_statement, solution_overview, credential_url
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.date,
      data.event_organizer ?? null,
      data.category ?? null,
      data.team_members ?? null,
      data.tech_stack ?? null,
      data.problem_statement ?? null,
      data.solution_overview ?? null,
      data.credential_url ?? null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<AchievementData>): Promise<AchievementData | null> {
    const query = `
      UPDATE achievements 
      SET 
        title = $1, description = $2, image_url = $3, date = $4,
        event_organizer = $5, category = $6, team_members = $7,
        tech_stack = $8, problem_statement = $9, solution_overview = $10,
        credential_url = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;
    const values = [
      data.title,
      data.description,
      data.image_url,
      data.date,
      data.event_organizer ?? null,
      data.category ?? null,
      data.team_members ?? null,
      data.tech_stack ?? null,
      data.problem_statement ?? null,
      data.solution_overview ?? null,
      data.credential_url ?? null,
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
