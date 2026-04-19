import pool from '../lib/db';

export interface SectionOrder {
  id: string;
  section_key: string;
  section_label: string;
  order_index: number;
  is_visible: boolean;
  created_at: Date;
  updated_at: Date;
}

export class SectionOrderRepository {
  static async findAll(): Promise<SectionOrder[]> {
    const query = 'SELECT * FROM section_orders ORDER BY order_index ASC';
    const { rows } = await pool.query(query);
    return rows;
  }

  static async updateBatch(orders: { section_key: string; order_index: number; is_visible: boolean }[]): Promise<void> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      for (const order of orders) {
        await client.query(
          'UPDATE section_orders SET order_index = $1, is_visible = $2, updated_at = CURRENT_TIMESTAMP WHERE section_key = $3',
          [order.order_index, order.is_visible, order.section_key]
        );
      }
      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  }

  static async toggleVisibility(sectionKey: string, isVisible: boolean): Promise<void> {
    const query = 'UPDATE section_orders SET is_visible = $1, updated_at = CURRENT_TIMESTAMP WHERE section_key = $2';
    await pool.query(query, [isVisible, sectionKey]);
  }
}
