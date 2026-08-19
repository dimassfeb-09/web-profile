import { generateHTML } from '@tiptap/html/server';
import type { JSONContent } from '@tiptap/core';
import { getTiptapExtensions } from './tiptap-extensions';

export async function renderBlogContent(content: JSONContent): Promise<string> {
	try {
		return generateHTML(content, getTiptapExtensions());
	} catch (error) {
		console.error('Error rendering Tiptap content:', error);
		return '';
	}
}