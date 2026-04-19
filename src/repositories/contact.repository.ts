import pool from '@/src/lib/db';

export interface ContactData {
  headline: string;
  description: string;
  email: string;
  linkedin_url: string;
  github_url?: string;
  instagram_url?: string;
  twitter_url?: string;
}

export class ContactRepository {
  static async findFirst(): Promise<ContactData | null> {
    const query = 'SELECT headline, description, email, linkedin_url, github_url, instagram_url, twitter_url FROM contact_section LIMIT 1';
    const { rows } = await pool.query(query);
    return rows[0] || null;
  }

  static async update(data: ContactData): Promise<ContactData | null> {
    const query = `
      UPDATE contact_section 
      SET headline = $1, description = $2, email = $3, linkedin_url = $4,
          github_url = $5, instagram_url = $6, twitter_url = $7
      WHERE id = (SELECT id FROM contact_section LIMIT 1)
      RETURNING *
    `;
    const values = [
      data.headline, 
      data.description, 
      data.email, 
      data.linkedin_url,
      data.github_url || null,
      data.instagram_url || null,
      data.twitter_url || null
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }
}
