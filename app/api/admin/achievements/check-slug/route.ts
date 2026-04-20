import { NextRequest, NextResponse } from 'next/server';
import pool from '@/src/lib/db';
import { requireAuth } from '@/src/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId');

    if (!slug) {
      return NextResponse.json({ status: 400, message: 'Slug is required' }, { status: 400 });
    }

    const query = `
      SELECT id FROM achievements 
      WHERE slug = $1 AND id != $2
    `;
    const values = [
      slug, 
      excludeId || '00000000-0000-0000-0000-000000000000'
    ];
    
    const { rows } = await pool.query(query, values);

    return NextResponse.json({ available: rows.length === 0 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
    }
    console.error('[Admin Check Slug] Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' }, { status: 500 });
  }
}
