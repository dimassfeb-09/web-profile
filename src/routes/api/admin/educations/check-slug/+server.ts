import { json } from '@sveltejs/kit';
import pool from '../../../../../lib/db';

export async function GET({ url }) {
	try {
		const slug = url.searchParams.get('slug');
		const excludeId = url.searchParams.get('excludeId');

		if (!slug) {
			return json({ available: null });
		}

		let query = 'SELECT id FROM educations WHERE slug = $1';
		const params: string[] = [slug];

		if (excludeId) {
			query += ' AND id != $2';
			params.push(excludeId);
		}

		const { rows } = await pool.query(query, params);
		return json({ available: rows.length === 0 });
	} catch (error) {
		console.error('[Admin Education Check-Slug] Error:', error);
		return json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
	}
}
