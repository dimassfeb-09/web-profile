import pool from '@/src/lib/db';

export interface AdminData {
  id: number;
  email: string;
  password?: string;
}

export class AdminRepository {
  static async findByEmail(email: string): Promise<AdminData | null> {
    const query = 'SELECT * FROM admins WHERE email = $1 LIMIT 1';
    const { rows } = await pool.query(query, [email]);
    return rows[0] || null;
  }
}
