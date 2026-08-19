import { BlogService } from '../../../services/blog.service';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ request }) => {
	const userAgent = request.headers.get('user-agent') || '';
	const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
	const limit = isMobile ? 6 : 9;

	const { blogs, nextCursor, hasMore } = await BlogService.getAllBlogs({ onlyPublished: true, limit });
	return { blogs, nextCursor, hasMore, limit };
};