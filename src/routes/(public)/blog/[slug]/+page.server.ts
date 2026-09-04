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

export interface TocItem {
	level: 2 | 3;
	id: string;
	text: string;
}

function headingText(node: JSONContent): string {
	let text = '';
	const stack: JSONContent[] = [...(node.content ?? [])];
	while (stack.length) {
		const n = stack.shift()!;
		if (n.type === 'text' && typeof n.text === 'string') text += n.text;
		if (n.content) stack.unshift(...n.content);
	}
	return text.trim();
}

function slugify(text: string, used: Map<string, number>): string {
	const base =
		text
			.toLowerCase()
			.replace(/[^\p{L}\p{N}\s-]/gu, '')
			.trim()
			.replace(/\s+/g, '-')
			.slice(0, 60) || 'bagian';
	const n = used.get(base) ?? 0;
	used.set(base, n + 1);
	return n === 0 ? base : `${base}-${n + 1}`;
}

// ponytail: TOC dari heading yang AUTHOR tulis (DFS = urutan render). Tidak mengarang heading.
function buildToc(content: JSONContent): TocItem[] {
	const toc: TocItem[] = [];
	const used = new Map<string, number>();
	const stack: JSONContent[] = [content];
	while (stack.length) {
		const node = stack.pop()!;
		if (node.type === 'heading' && (node.attrs?.level === 2 || node.attrs?.level === 3)) {
			const text = headingText(node);
			if (text) toc.push({ level: node.attrs.level as 2 | 3, id: slugify(text, used), text: text.slice(0, 80) });
		}
		if (node.content) stack.push(...[...node.content].reverse());
	}
	return toc;
}

// pasang id ke <h2>/<h3> hasil render, urut sesuai TOC
function injectHeadingIds(html: string, toc: TocItem[]): string {
	let i = 0;
	return html.replace(/<(h[23])((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (m, tag, attrs) => {
		const item = toc[i++];
		if (!item || /\bid=/.test(attrs)) return m;
		return `<${tag}${attrs} id="${item.id}">`;
	});
}

export const load: PageServerLoad = async ({ params }) => {
	const blog = await BlogService.getBlogBySlug(params.slug);
	if (!blog || !blog.is_published) error(404, 'Article not found');

	const wordCount = JSON.stringify(blog.content).length;
	const readTime = Math.ceil(wordCount / 1000);
	const toc = buildToc(blog.content);
	const contentHtml = injectHeadingIds(await renderBlogContent(blog.content), toc);
	const related = await BlogService.getRelatedBlogs(blog.slug);

	return { blog, readTime, contentHtml, related, toc, ogImage: firstImageSrc(blog.content) };
};