import { json } from '@sveltejs/kit';
import pool from '../../../../../lib/db';

export async function GET({ url }) {
	try {
		const slug = url.searchParams.get('slug');
		const excludeId = url.searchParams.get('excludeId');

		if (!slug) {
			return json({ status: 400, message: 'Slug is required' }, { status: 400 });
		}

		const query = `SELECT id FROM achievements WHERE slug = $1 AND id != $2`;
		const values = [slug, excludeId || '00000000-0000-0000-0000-000000000000'];

		const { rows } = await pool.query(query, values);
		return json({ available: rows.length === 0 });
	} catch (error) {
		console.error('[Admin Check Slug] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
