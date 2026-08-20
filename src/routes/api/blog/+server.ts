import { BlogService } from '../../../services/blog.service';
import { requireAuth, getSession } from '$lib/auth';
import { json } from '@sveltejs/kit';

export async function GET({ url, cookies }) {
	try {
		const session = await getSession(cookies);
		const onlyPublished = session ? url.searchParams.get('published') === 'true' : true;
		const cursor = url.searchParams.get('cursor');
		const limit = Number(url.searchParams.get('limit')) || 9;

		const result = await BlogService.getAllBlogs({ onlyPublished, cursor, limit });
		return json({ status: 200, message: 'Success', data: result });
	} catch (error) {
		console.error('Error in GET /api/blog:', error);
		return json({ status: 500, message: 'Internal Server Error', data: null }, { status: 500 });
	}
}

export async function POST({ request, cookies }) {
	try {
		await requireAuth(cookies);

		const body = await request.json();

		if (!body.id || !body.title || !body.slug || !body.content) {
			return json({ status: 400, message: 'Missing required fields' }, { status: 400 });
		}

		const blog = await BlogService.createBlog(body);
		return json({ status: 201, message: 'Blog created successfully', data: blog }, { status: 201 });
	} catch (error) {
		console.error('Create Blog Error:', error);
		return json(
			{ status: 500, message: error instanceof Error ? error.message : 'Internal Server Error', data: null },
			{ status: 500 }
		);
	}
}