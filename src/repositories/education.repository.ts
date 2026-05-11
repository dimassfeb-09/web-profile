import pool from '@/src/lib/db';
import { 
  EducationInput, 
  EducationActivityInput, 
  EducationAchievementInput 
} from '@/src/lib/schemas/education.schema';

export interface EducationData extends EducationInput {
  id: string;
  created_at: Date;
  updated_at: Date;
  projects?: any[];
  certificates?: any[];
}

export class EducationRepository {
  static async findAll(sort: 'newest' | 'oldest' = 'newest'): Promise<EducationData[]> {
    const order = sort === 'oldest' ? 'ASC' : 'DESC';
    const query = `
      SELECT e.*, 
        COALESCE((
          SELECT json_agg(act) 
          FROM (
            SELECT * FROM education_activities 
            WHERE education_id = e.id 
            ORDER BY start_date DESC
          ) act
        ), '[]'::json) as activities,
        COALESCE((
          SELECT json_agg(ach) 
          FROM (
            SELECT a.id, a.title, a.slug, a.date 
            FROM achievements a
            JOIN education_achievements ea ON a.id = ea.achievement_id
            WHERE ea.education_id = e.id
            ORDER BY a.date DESC
          ) ach
        ), '[]'::json) as achievements,
        COALESCE((
          SELECT json_agg(p) 
          FROM (
            SELECT p.id, p.title, p.slug 
            FROM projects p
            JOIN education_projects ep ON p.id = ep.project_id
            WHERE ep.education_id = e.id
          ) p
        ), '[]'::json) as projects,
        COALESCE((
          SELECT json_agg(c) 
          FROM (
            SELECT c.id, c.title, c.credential_url 
            FROM certificates c
            JOIN education_certificates ec ON c.id = ec.certificate_id
            WHERE ec.education_id = e.id
          ) c
        ), '[]'::json) as certificates,
        COALESCE((
          SELECT array_agg(project_id::text) 
          FROM education_projects 
          WHERE education_id = e.id
        ), ARRAY[]::text[]) as project_ids,
        COALESCE((
          SELECT array_agg(certificate_id::text) 
          FROM education_certificates 
          WHERE education_id = e.id
        ), ARRAY[]::text[]) as certificate_ids,
        COALESCE((
          SELECT array_agg(achievement_id::text) 
          FROM education_achievements 
          WHERE education_id = e.id
        ), ARRAY[]::text[]) as achievement_ids
      FROM educations e
      ORDER BY (e.end_date IS NULL) DESC, e.end_date ${order}, e.start_date ${order}
    `;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id: string): Promise<any | null> {
    const client = await pool.connect();
    try {
      const educationQuery = 'SELECT * FROM educations WHERE id = $1';
      const educationResult = await client.query(educationQuery, [id]);
      const education = educationResult.rows[0];

      if (!education) return null;

      const activitiesQuery = 'SELECT * FROM education_activities WHERE education_id = $1';
      const activitiesResult = await client.query(activitiesQuery, [id]);

      const achievementsQuery = `
        SELECT a.* FROM achievements a
        JOIN education_achievements ea ON a.id = ea.achievement_id
        WHERE ea.education_id = $1
      `;
      const achievementsResult = await client.query(achievementsQuery, [id]);

      const projectsQuery = `
        SELECT p.* FROM projects p
        JOIN education_projects ep ON p.id = ep.project_id
        WHERE ep.education_id = $1
      `;
      const projectsResult = await client.query(projectsQuery, [id]);

      const certificatesQuery = `
        SELECT c.* FROM certificates c
        JOIN education_certificates ec ON c.id = ec.certificate_id
        WHERE ec.education_id = $1
      `;
      const certificatesResult = await client.query(certificatesQuery, [id]);

      return {
        ...education,
        activities: activitiesResult.rows,
        achievements: achievementsResult.rows,
        projects: projectsResult.rows,
        certificates: certificatesResult.rows,
        project_ids: projectsResult.rows.map((p: any) => p.id),
        certificate_ids: certificatesResult.rows.map((c: any) => c.id),
        achievement_ids: achievementsResult.rows.map((a: any) => a.id),
      };
    } finally {
      client.release();
    }
  }

  static async findBySlug(slug: string): Promise<any | null> {
    const client = await pool.connect();
    try {
      const educationQuery = 'SELECT * FROM educations WHERE slug = $1';
      const educationResult = await client.query(educationQuery, [slug]);
      const education = educationResult.rows[0];

      if (!education) return null;

      const id = education.id;

      const activitiesQuery = 'SELECT * FROM education_activities WHERE education_id = $1';
      const activitiesResult = await client.query(activitiesQuery, [id]);

      const achievementsQuery = `
        SELECT a.* FROM achievements a
        JOIN education_achievements ea ON a.id = ea.achievement_id
        WHERE ea.education_id = $1
      `;
      const achievementsResult = await client.query(achievementsQuery, [id]);

      const projectsQuery = `
        SELECT p.* FROM projects p
        JOIN education_projects ep ON p.id = ep.project_id
        WHERE ep.education_id = $1
      `;
      const projectsResult = await client.query(projectsQuery, [id]);

      const certificatesQuery = `
        SELECT c.* FROM certificates c
        JOIN education_certificates ec ON c.id = ec.certificate_id
        WHERE ec.education_id = $1
      `;
      const certificatesResult = await client.query(certificatesQuery, [id]);

      return {
        ...education,
        activities: activitiesResult.rows,
        achievements: achievementsResult.rows,
        projects: projectsResult.rows,
        certificates: certificatesResult.rows,
        project_ids: projectsResult.rows.map((p: any) => p.id),
        certificate_ids: certificatesResult.rows.map((c: any) => c.id),
      };
    } finally {
      client.release();
    }
  }

  static async create(data: EducationInput): Promise<EducationData> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const educationQuery = `
        INSERT INTO educations (
          slug, institution, degree, major, start_date, end_date, 
          is_current, description, logo_url, location, gpa, gallery
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `;
      const educationValues = [
        data.slug, data.institution, data.degree || null, data.major || null,
        data.start_date, data.end_date || null, data.is_current,
        data.description || null, data.logo_url || null, data.location || null,
        data.gpa || null, JSON.stringify(data.gallery || [])
      ];
      const { rows } = await client.query(educationQuery, educationValues);
      const education = rows[0];

      // Add activities
      if (data.activities && data.activities.length > 0) {
        for (const activity of data.activities) {
          const query = `
            INSERT INTO education_activities (education_id, title, role, start_date, end_date, description)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await client.query(query, [
            education.id, activity.title, activity.role, 
            activity.start_date || null, activity.end_date || null, 
            activity.description || null
          ]);
        }
      }

      // Link achievements
      if (data.achievement_ids && data.achievement_ids.length > 0) {
        for (const achId of data.achievement_ids) {
          await client.query(
            'INSERT INTO education_achievements (education_id, achievement_id) VALUES ($1, $2)',
            [education.id, achId]
          );
        }
      }

      // Link projects
      if (data.project_ids && data.project_ids.length > 0) {
        for (const projectId of data.project_ids) {
          await client.query(
            'INSERT INTO education_projects (education_id, project_id) VALUES ($1, $2)',
            [education.id, projectId]
          );
        }
      }

      // Link certificates
      if (data.certificate_ids && data.certificate_ids.length > 0) {
        for (const certId of data.certificate_ids) {
          await client.query(
            'INSERT INTO education_certificates (education_id, certificate_id) VALUES ($1, $2)',
            [education.id, certId]
          );
        }
      }

      await client.query('COMMIT');
      return education;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async update(id: string, data: Partial<EducationInput>): Promise<EducationData | null> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Update main table
      const educationQuery = `
        UPDATE educations 
        SET 
          slug = COALESCE($1, slug),
          institution = COALESCE($2, institution),
          degree = $3,
          major = $4,
          start_date = COALESCE($5, start_date),
          end_date = $6,
          is_current = COALESCE($7, is_current),
          description = $8,
          logo_url = $9,
          location = $10,
          gpa = $11,
          gallery = COALESCE($12, gallery),
          updated_at = NOW()
        WHERE id = $13
        RETURNING *
      `;
      const educationValues = [
        data.slug || null, data.institution || null, data.degree || null, data.major || null,
        data.start_date || null, data.end_date || null, 
        data.is_current !== undefined ? data.is_current : null,
        data.description || null, data.logo_url || null, data.location || null,
        data.gpa || null, data.gallery ? JSON.stringify(data.gallery) : null,
        id
      ];
      const { rows } = await client.query(educationQuery, educationValues);
      const education = rows[0];

      if (!education) {
        await client.query('ROLLBACK');
        return null;
      }

      // Handle Activities (Clear and Re-add)
      if (data.activities !== undefined) {
        await client.query('DELETE FROM education_activities WHERE education_id = $1', [id]);
        for (const activity of data.activities) {
          const query = `
            INSERT INTO education_activities (education_id, title, role, start_date, end_date, description)
            VALUES ($1, $2, $3, $4, $5, $6)
          `;
          await client.query(query, [
            id, activity.title, activity.role, 
            activity.start_date || null, activity.end_date || null, 
            activity.description || null
          ]);
        }
      }

      // Handle Achievement Links
      if (data.achievement_ids !== undefined) {
        await client.query('DELETE FROM education_achievements WHERE education_id = $1', [id]);
        for (const achId of data.achievement_ids) {
          await client.query(
            'INSERT INTO education_achievements (education_id, achievement_id) VALUES ($1, $2)',
            [id, achId]
          );
        }
      }

      // Handle Project Links
      if (data.project_ids !== undefined) {
        await client.query('DELETE FROM education_projects WHERE education_id = $1', [id]);
        for (const projectId of data.project_ids) {
          await client.query(
            'INSERT INTO education_projects (education_id, project_id) VALUES ($1, $2)',
            [id, projectId]
          );
        }
      }

      // Handle Certificate Links
      if (data.certificate_ids !== undefined) {
        await client.query('DELETE FROM education_certificates WHERE education_id = $1', [id]);
        for (const certId of data.certificate_ids) {
          await client.query(
            'INSERT INTO education_certificates (education_id, certificate_id) VALUES ($1, $2)',
            [id, certId]
          );
        }
      }

      await client.query('COMMIT');
      return education;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM educations WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
