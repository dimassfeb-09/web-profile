'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Loader2 } from 'lucide-react';
import { BlogData } from '@/src/repositories/blog.repository';

interface BlogScrollAreaProps {
  initialBlogs: BlogData[];
  initialNextCursor: string | null;
  initialHasMore: boolean;
  batchSize?: number;
}

export default function BlogScrollArea({
  initialBlogs,
  initialNextCursor,
  initialHasMore,
  batchSize = 9,
}: BlogScrollAreaProps) {
  const [blogs, setBlogs] = useState<BlogData[]>(initialBlogs);
  const [nextCursor, setNextCursor] = useState<string | null>(initialNextCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  const loadMoreBlogs = useCallback(async () => {
    if (isLoading || !hasMore || !nextCursor) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const response = await fetch(`/api/blog?published=true&cursor=${nextCursor}&limit=${batchSize}`);
      const result = await response.json();

      if (result.status === 200) {
        setBlogs((prev) => [...prev, ...result.data.blogs]);
        setNextCursor(result.data.nextCursor);
        setHasMore(result.data.hasMore);
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error('Failed to load more blogs:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, nextCursor]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreBlogs();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [hasMore, isLoading, loadMoreBlogs]);

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((blog) => (
          <Link
            key={blog.id}
            href={`/blog/${blog.slug}`}
            className="group flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 hover:bg-surface-container-high transition-all duration-500 hover:-translate-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold text-primary mb-4">
              <Calendar className="w-3 h-3" />
              {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Draft'}
            </div>

            <h2 className="font-headline text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors">
              {blog.title}
            </h2>

            <p className="font-body text-on-surface-variant text-sm line-clamp-3 mb-8 flex-grow">
              {blog.excerpt || 'Read the full story to learn more...'}
            </p>

            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
              Read Article
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
        
        {/* Skeleton Loading State */}
        {isLoading && (
          <>
            {[...Array(3)].map((_, i) => (
              <div 
                key={`skeleton-${i}`}
                className="flex flex-col bg-surface-container-low/50 border border-outline-variant/10 rounded-[2.5rem] p-8 animate-pulse"
              >
                <div className="h-4 w-24 bg-surface-container-high rounded-full mb-4" />
                <div className="h-8 w-full bg-surface-container-high rounded-lg mb-4" />
                <div className="h-4 w-full bg-surface-container-high rounded-lg mb-2" />
                <div className="h-4 w-2/3 bg-surface-container-high rounded-lg mb-8" />
                <div className="h-4 w-20 bg-surface-container-high rounded-full mt-auto" />
              </div>
            ))}
          </>
        )}
      </div>

      {/* Sentinel Element */}
      <div 
        ref={observerTarget} 
        className="h-10 flex items-center justify-center"
      >
        {isLoading && <Loader2 className="w-8 h-8 text-primary animate-spin" />}
        {!hasMore && blogs.length > 0 && (
          <p className="font-body text-on-surface-variant italic text-sm">
            🎉 You&apos;ve reached the end of the insights!
          </p>
        )}
        {isError && (
          <button 
            onClick={() => loadMoreBlogs()}
            className="text-primary font-bold hover:underline"
          >
            Error loading more. Tap to try again.
          </button>
        )}
      </div>
    </div>
  );
}
