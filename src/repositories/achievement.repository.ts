import pool from '@/src/lib/db';

export interface AchievementData {
  id?: string;
  slug?: string;
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
  image_hash?: string | null;
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

  static async findBySlug(slug: string): Promise<AchievementData | null> {
    const query = 'SELECT * FROM achievements WHERE slug = $1';
    const { rows } = await pool.query(query, [slug]);
    return rows[0] || null;
  }

  static async create(data: AchievementData): Promise<AchievementData> {
    const query = `
      INSERT INTO achievements (
        title, slug, description, image_url, date,
        event_organizer, category, team_members,
        tech_stack, problem_statement, solution_overview, credential_url, image_hash
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;
    const values = [
      data.title,
      data.slug,
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
      data.image_hash ?? null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<AchievementData>): Promise<AchievementData | null> {
    const query = `
      UPDATE achievements 
      SET 
        title = $1, slug = $2, description = $3, image_url = $4, date = $5,
        event_organizer = $6, category = $7, team_members = $8,
        tech_stack = $9, problem_statement = $10, solution_overview = $11,
        credential_url = $12, image_hash = $13, updated_at = CURRENT_TIMESTAMP
      WHERE id = $14
      RETURNING *
    `;
    const values = [
      data.title,
      data.slug,
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
      data.image_hash ?? null,
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

  static async addSlugHistory(achievementId: string, oldSlug: string): Promise<void> {
    const query = 'INSERT INTO achievement_slug_history (achievement_id, old_slug) VALUES ($1, $2)';
    await pool.query(query, [achievementId, oldSlug]);
  }

  static async findSlugByHistory(oldSlug: string): Promise<string | null> {
    const query = `
      SELECT a.slug 
      FROM achievements a
      JOIN achievement_slug_history ash ON a.id = ash.achievement_id
      WHERE ash.old_slug = $1
      ORDER BY ash.created_at DESC
      LIMIT 1
    `;
    const { rows } = await pool.query(query, [oldSlug]);
    return rows[0]?.slug || null;
  }
}
