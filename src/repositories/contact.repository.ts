import pool from '$lib/db';

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
  // ponytail: normalize http->https once here so all callers (Footer, ContactSection) stay clean even if DB has http
  private static https(url?: string | null): string | null {
    if (!url) return null;
    return url.replace(/^http:\/\//i, 'https://');
  }

  static async findFirst(): Promise<ContactData | null> {
    const query = 'SELECT headline, description, email, linkedin_url, github_url, instagram_url, twitter_url FROM contact_section LIMIT 1';
    const { rows } = await pool.query(query);
    const row = rows[0];
    if (!row) return null;
    return {
      ...row,
      linkedin_url: this.https(row.linkedin_url) ?? row.linkedin_url,
      github_url: this.https(row.github_url) ?? undefined,
      instagram_url: this.https(row.instagram_url) ?? undefined,
      twitter_url: this.https(row.twitter_url) ?? undefined
    };
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
