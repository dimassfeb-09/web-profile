import type { MetadataRoute } from "next";
import { BlogService } from "@/src/services/blog.service";
import { ProjectService } from "@/src/services/project.service";

const BASE_URL = "https://www.dimassfeb.com";

export const revalidate = 3600; // Rebuild sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let latestPostDate = new Date(0);

  // 1. Fetch all blogs first (needed for homepage lastModified too)
  const allBlogs: MetadataRoute.Sitemap = [];
  let cursor: string | null = null;
  let hasMore = true;

  while (hasMore) {
    const result = await BlogService.getAllBlogs({
      onlyPublished: true,
      cursor,
      limit: 100,
      bypassCache: true,
    });

    for (const blog of result.blogs) {
      if (!blog.slug) continue;
      const updatedAt = blog.updated_at ? new Date(blog.updated_at) : new Date();
      if (updatedAt > latestPostDate) latestPostDate = updatedAt;

      const daysSinceUpdate =
        (Date.now() - updatedAt.getTime()) / (1000 * 60 * 60 * 24);

      allBlogs.push({
        url: `${BASE_URL}/blog/${blog.slug}`,
        lastModified: updatedAt,
        changeFrequency: daysSinceUpdate < 30 ? "daily" : "weekly",
        priority: daysSinceUpdate < 30 ? 0.8 : 0.6,
      });
    }

    hasMore = result.hasMore;
    cursor = result.nextCursor;
  }

  // 2. Fetch all projects
  const projectsRes = await ProjectService.getAllProjects(true);
  const allProjects: MetadataRoute.Sitemap = (projectsRes.data || [])
    .filter((p) => p.slug)
    .map((project) => {
      const updatedAt = project.created_at ? new Date(project.created_at) : new Date();
      if (updatedAt > latestPostDate) latestPostDate = updatedAt;
      
      return {
        url: `${BASE_URL}/projects/${project.slug}`,
        lastModified: updatedAt,
        changeFrequency: "monthly",
        priority: 0.7,
      };
    });

  // 3. Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: latestPostDate > new Date(0) ? latestPostDate : new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: latestPostDate > new Date(0) ? latestPostDate : new Date(),
      changeFrequency: "daily",
      priority: 0.85,
    },
    {
      url: `${BASE_URL}/projects`,
      lastModified: latestPostDate > new Date(0) ? latestPostDate : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  return [...staticRoutes, ...allProjects, ...allBlogs];
}
