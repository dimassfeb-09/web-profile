import React from 'react';
import { BlogService } from '@/src/services/blog.service';
import BlogScrollArea from '@/src/components/blog/BlogScrollArea';

import { headers } from 'next/headers';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogListPage() {
  const headersList = await headers();
  const userAgent = headersList.get('user-agent') || '';
  const isMobile = /mobile|android|iphone|ipad/i.test(userAgent);
  const limit = isMobile ? 6 : 9;

  console.log(`[BlogPage] UA: ${userAgent.slice(0, 50)}... | isMobile: ${isMobile} | limit: ${limit}`);

  const { blogs, nextCursor, hasMore } = await BlogService.getAllBlogs({ onlyPublished: true, limit });

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto">
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
