import { json } from '@sveltejs/kit';
import { renderBlogContent } from '$lib/tiptap';
import { checkRateLimit } from '$lib/rateLimit';

export async function POST({ request, getClientAddress }) {
	try {
		// ponytail: getClientAddress throws on some adapters — fallback to x-forwarded-for like login route
		let ip = 'unknown';
		try { ip = getClientAddress(); } catch {}
		if (!ip || ip === 'unknown') ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
		if (!(await checkRateLimit(ip))) {
			return json({ error: 'Rate limit exceeded' }, { status: 429 });
		}
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