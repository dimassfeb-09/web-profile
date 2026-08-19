import { json } from '@sveltejs/kit';
import { requireAuth } from '$lib/auth';
import { BlogService } from '../../../../services/blog.service';

export async function GET({ params }) {
	try {
		const blog = await BlogService.getBlogById(params.id, true);

		if (!blog) {
			return json({ status: 404, message: 'Blog not found', data: null }, { status: 404 });
		}

		return json({ status: 200, message: 'Success', data: blog });
	} catch (error) {
		console.error('[Blog GET] Error:', error);
		return json({ status: 500, message: 'Internal Server Error', data: null }, { status: 500 });
	}
}

export async function PUT({ params, request, cookies }) {
	try {
		await requireAuth(cookies);

		const body = await request.json();

		const blog = await BlogService.updateBlog(params.id, body);

		if (!blog) {
			return json({ status: 404, message: 'Blog not found', data: null }, { status: 404 });
		}

		return json({ status: 200, message: 'Blog updated successfully', data: blog });
	} catch (error) {
		console.error('[Blog PUT] Error:', error);
		return json(
			{ status: 500, message: error instanceof Error ? error.message : 'Internal Server Error', data: null },
			{ status: 500 }
		);
	}
}

export async function DELETE({ params, cookies }) {
	try {
		await requireAuth(cookies);

		const success = await BlogService.deleteBlog(params.id);

		if (!success) {
			return json({ status: 404, message: 'Blog not found', data: null }, { status: 404 });
		}

		return json({ status: 200, message: 'Blog deleted successfully', data: null });
	} catch (error) {
		console.error('[Blog DELETE] Error:', error);
		return json(
			{ status: 500, message: error instanceof Error ? error.message : 'Internal Server Error', data: null },
			{ status: 500 }
		);
	}
}