import { error } from '@sveltejs/kit';
import { BlogService } from '../../../../services/blog.service';
import { renderBlogContent } from '$lib/tiptap';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const blog = await BlogService.getBlogBySlug(params.slug);
	if (!blog || !blog.is_published) error(404, 'Article not found');

	const wordCount = JSON.stringify(blog.content).length;
	const readTime = Math.ceil(wordCount / 1000);
	const contentHtml = await renderBlogContent(blog.content);
	const related = await BlogService.getRelatedBlogs(blog.slug);

	return { blog, readTime, contentHtml, related };
};