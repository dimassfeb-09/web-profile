import { json } from '@sveltejs/kit';
import { renderBlogContent } from '$lib/tiptap';

export async function POST({ request }) {
	try {
		const { content } = await request.json();
		if (!content) {
			return json({ error: 'Missing content' }, { status: 400 });
		}
		const html = await renderBlogContent(content);
		return json({ html });
	} catch (error) {
		console.error('Error rendering blog content:', error);
		return json({ error: 'Failed to render content' }, { status: 500 });
	}
}