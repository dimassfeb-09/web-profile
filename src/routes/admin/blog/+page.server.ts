import { BlogService } from '../../../services/blog.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const sort = (url.searchParams.get('sort') === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';
	const search = url.searchParams.get('search') || '';

	const { blogs } = await BlogService.getAllBlogs({
		// ponytail: admin list shows up to 100 posts; Next capped at default 9 with no pagination UI
		bypassCache: true,
		sort,
		search,
		limit: 100
	});

	const mappedBlogs = blogs.map((blog) => ({
		id: blog.id,
		title: blog.title,
		slug: blog.slug,
		is_published: blog.is_published,
		published_at: blog.published_at ? blog.published_at.toISOString() : null,
		created_at: (blog.created_at || new Date()).toISOString()
	}));

	return {
		blogs: mappedBlogs
	};
};