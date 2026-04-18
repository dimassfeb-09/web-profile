import pool from '@/src/lib/db';

export interface ContactData {
  headline: string;
  description: string;
  email: string;
  linkedin_url: string;
}

export class ContactRepository {
  static async findFirst(): Promise<ContactData | null> {
    const query = 'SELECT headline, description, email, linkedin_url FROM contact_section LIMIT 1';
    const { rows } = await pool.query(query);
    return rows[0] || null;
  }

  static async update(data: ContactData): Promise<ContactData | null> {
    const query = `
      UPDATE contact_section 
      SET headline = $1, description = $2, email = $3, linkedin_url = $4
      WHERE id = (SELECT id FROM contact_section LIMIT 1)
      RETURNING *
    `;
    const values = [data.headline, data.description, data.email, data.linkedin_url];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
}
