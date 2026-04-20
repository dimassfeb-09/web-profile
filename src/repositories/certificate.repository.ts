import pool from '@/src/lib/db';

export interface CertificateData {
  id?: string;
  title: string;
  issuer: string;
  issue_date: string | Date | null;
  credential_url: string | null;
  image_url: string | null;
  image_hash?: string | null;
  created_at?: Date;
  updated_at?: Date;
  description?: string;
}

export class CertificateRepository {
  static async findAll(sort: 'newest' | 'oldest' = 'newest'): Promise<CertificateData[]> {
    const order = sort === 'oldest' ? 'ASC' : 'DESC';
    const query = `SELECT * FROM certificates ORDER BY created_at ${order}`;
    const { rows } = await pool.query(query);
    return rows;
  }

  static async findById(id: string): Promise<CertificateData | null> {
    const query = 'SELECT * FROM certificates WHERE id = $1';
    const { rows } = await pool.query(query, [id]);
    return rows[0] || null;
  }

  static async create(data: CertificateData): Promise<CertificateData> {
    const query = `
      INSERT INTO certificates (title, issuer, issue_date, credential_url, image_url, description, image_hash)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      data.title,
      data.issuer,
      data.issue_date,
      data.credential_url,
      data.image_url,
      data.description,
      data.image_hash || null,
    ];
    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async update(id: string, data: Partial<CertificateData>): Promise<CertificateData | null> {
    const query = `
      UPDATE certificates 
      SET title = $1, issuer = $2, issue_date = $3, credential_url = $4, image_url = $5, description = $6, image_hash = $7, updated_at = CURRENT_TIMESTAMP
      WHERE id = $8
      RETURNING *
    `;
    const values = [
      data.title,
      data.issuer,
      data.issue_date,
      data.credential_url,
      data.image_url,
      data.description,
      data.image_hash || null,
      id
    ];
    const { rows } = await pool.query(query, values);
    return rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const query = 'DELETE FROM certificates WHERE id = $1';
    const { rowCount } = await pool.query(query, [id]);
    return (rowCount ?? 0) > 0;
  }
}
