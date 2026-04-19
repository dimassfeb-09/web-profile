import type { MetadataRoute } from "next";
import { BlogService } from "@/src/services/blog.service";

const BASE_URL = "https://www.dimassfeb.com";

export const revalidate = 3600; // Rebuild sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1. Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // 2. Dynamic blog routes — fetch all published posts using pagination
  const blogRoutes: MetadataRoute.Sitemap = [];
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
      if (blog.slug) {
        blogRoutes.push({
          url: `${BASE_URL}/blog/${blog.slug}`,
          lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }

    hasMore = result.hasMore;
    cursor = result.nextCursor;
  }

  return [...staticRoutes, ...blogRoutes];
}
