import { BlogService } from '../services/blog.service';
import { ProjectService } from '../services/project.service';
import { AchievementService } from '../services/achievement.service';

const BASE_URL = 'https://www.dimassfeb.com';

const changeFreq = (updatedAt: Date, latestPostDate: Date): string => {
	const daysSinceUpdate = (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);
	return daysSinceUpdate < 30 ? 'daily' : 'weekly';
};

export async function GET() {
	const now = new Date();
	let latestPostDate = new Date(0);

	const urlset: string[] = [];

	try {
		let cursor: string | null = null;
		let hasMore = true;

		while (hasMore) {
			const result = await BlogService.getAllBlogs({
				onlyPublished: true,
				cursor,
				limit: 100,
				bypassCache: true
			});

			for (const blog of result.blogs) {
				if (!blog.slug) continue;
				const updatedAt = blog.updated_at ? new Date(blog.updated_at) : new Date();
				if (updatedAt > latestPostDate) latestPostDate = updatedAt;

				urlset.push(`
	<url>
		<loc>${BASE_URL}/blog/${blog.slug}</loc>
		<lastmod>${updatedAt.toISOString()}</lastmod>
		<changefreq>${changeFreq(updatedAt, latestPostDate)}</changefreq>
		<priority>${changeFreq(updatedAt, latestPostDate) === 'daily' ? 0.8 : 0.6}</priority>
	</url>`);
			}

			hasMore = result.hasMore;
			cursor = result.nextCursor;
		}
	} catch (error) {
		console.error('Error fetching blogs for sitemap:', error);
	}

	try {
		const projectsRes = await ProjectService.getAllProjects(true);
		(projectsRes.data || []).forEach((project) => {
			if (!project.slug) return;
			const updatedAt = project.created_at ? new Date(project.created_at) : new Date();
			if (updatedAt > latestPostDate) latestPostDate = updatedAt;

			urlset.push(`
	<url>
		<loc>${BASE_URL}/projects/${project.slug}</loc>
		<lastmod>${updatedAt.toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.7</priority>
	</url>`);
		});
	} catch (error) {
		console.error('Error fetching projects for sitemap:', error);
	}

	try {
		const achievementsRes = await AchievementService.getAllAchievements(true);
		(achievementsRes.data || []).forEach((achievement) => {
			if (!achievement.slug) return;
			const updatedAt = achievement.created_at ? new Date(achievement.created_at) : new Date();

			urlset.push(`
	<url>
		<loc>${BASE_URL}/achievements/${achievement.slug}</loc>
		<lastmod>${updatedAt.toISOString()}</lastmod>
		<changefreq>monthly</changefreq>
		<priority>0.6</priority>
	</url>`);
		});
	} catch (error) {
		console.error('Error fetching achievements for sitemap:', error);
	}

	const lastMod = latestPostDate > new Date(0) ? latestPostDate : now;

	const staticRoutes = [
		{ url: BASE_URL, changeFrequency: 'monthly', priority: 1.0 },
		{ url: `${BASE_URL}/blog`, changeFrequency: 'daily', priority: 0.85 },
		{ url: `${BASE_URL}/projects`, changeFrequency: 'weekly', priority: 0.8 },
		{ url: `${BASE_URL}/achievements`, changeFrequency: 'weekly', priority: 0.7 },
		{ url: `${BASE_URL}/certificates`, changeFrequency: 'weekly', priority: 0.7 }
	];

	for (const route of staticRoutes) {
		urlset.push(`
	<url>
		<loc>${route.url}</loc>
		<lastmod>${lastMod.toISOString()}</lastmod>
		<changefreq>${route.changeFrequency}</changefreq>
		<priority>${route.priority}</priority>
	</url>`);
	}

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlset.join('\n')}
</urlset>`;

	return new Response(xml, {
		headers: {
			'Content-Type': 'application/xml',
			'Cache-Control': 'max-age=3600, s-maxage=3600'
		}
	});
}