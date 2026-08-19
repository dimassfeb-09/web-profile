const BASE_URL = 'https://www.dimassfeb.com';

export async function GET() {
	const body = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/admin/
Disallow: /api/

User-agent: AhrefsBot
Crawl-delay: 10
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${BASE_URL}/sitemap.xml
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'text/plain',
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
}