import { error } from '@sveltejs/kit';
import { BlogService } from '../../../../services/blog.service';
import { renderBlogContent } from '$lib/tiptap';
import type { JSONContent } from '@tiptap/core';
import type { PageServerLoad } from './$types';

// ponytail: og:image per artikel = gambar pertama konten, fallback og-image.png (tanpa kolom DB baru)
function firstImageSrc(content: JSONContent): string | null {
	const stack: JSONContent[] = [content];
	while (stack.length) {
		const node = stack.pop()!;
		if (node.type === 'image' && typeof node.attrs?.src === 'string') return node.attrs.src;
		if (node.content) stack.push(...node.content);
	}
	return null;
}

export const load: PageServerLoad = async ({ params }) => {
	const blog = await BlogService.getBlogBySlug(params.slug);
	if (!blog || !blog.is_published) error(404, 'Article not found');

	const wordCount = JSON.stringify(blog.content).length;
	const readTime = Math.ceil(wordCount / 1000);
	const contentHtml = await renderBlogContent(blog.content);
	const related = await BlogService.getRelatedBlogs(blog.slug);

	return { blog, readTime, contentHtml, related, ogImage: firstImageSrc(blog.content) };
};