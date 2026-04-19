import type { MetadataRoute } from "next";

const BASE_URL = "https://www.dimassfeb.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/_next/static/", "/_next/image/"],
        disallow: ["/admin/", "/api/admin/", "/api/"],
      },
      {
        userAgent: "AhrefsBot",
        crawlDelay: 10,
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
