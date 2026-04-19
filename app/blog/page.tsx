import React from 'react';
import { BlogService } from '@/src/services/blog.service';
import BlogScrollArea from '@/src/components/blog/BlogScrollArea';
import type { Metadata } from "next";
import { headers } from 'next/headers';
import JsonLd from '@/src/components/common/JsonLd';

const BASE_URL = "https://www.dimassfeb.com";

export const metadata: Metadata = {
  title: "Blog & Insights",
  description:
    "Articles about Flutter, Golang, mobile development, and backend engineering by Dimas Febriyanto — Software Engineer from Bekasi, Indonesia.",
  alternates: {
    canonical: `${BASE_URL}/blog`,
  },
  openGraph: {
    type: "website",
    url: `${BASE_URL}/blog`,
    title: "Blog & Insights | Dimas Febriyanto",
    description:
      "Articles about Flutter, Golang, mobile development, and backend engineering.",
    siteName: "Dimas Febriyanto",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Blog & Insights" }],
  },
};

export const revalidate = 3600; // Revalidate every hour

export default async function BlogListPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const limit = isMobile ? 6 : 9;

  const { blogs, nextCursor, hasMore } = await BlogService.getAllBlogs({ onlyPublished: true, limit });

  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://www.dimassfeb.com/blog#blog",
    name: "Blog & Insights — Dimas Febriyanto",
    url: "https://www.dimassfeb.com/blog",
    description:
      "Articles about Flutter, Golang, mobile development, and backend engineering.",
    author: {
      "@type": "Person",
      "@id": "https://www.dimassfeb.com/#person",
      name: "Dimas Febriyanto",
    },
    inLanguage: "id-ID",
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto">
      <JsonLd schema={blogSchema} />
      <div className="space-y-4 mb-16">
        <h1 className="font-headline text-5xl sm:text-7xl font-bold text-on-surface">
          Blog & <span className="text-primary">Insights</span>
        </h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl">
          Exploring web technology, design patterns, and life as a developer.
        </p>
      </div>

      {blogs.length > 0 ? (
        <BlogScrollArea 
          initialBlogs={blogs} 
          initialNextCursor={nextCursor} 
          initialHasMore={hasMore} 
          batchSize={limit}
        />
      ) : (
        <div className="text-center py-40 bg-surface-container-low rounded-[3rem] border border-dashed border-outline-variant/20">
          <p className="font-body text-on-surface-variant italic">No stories published yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
