import React from 'react';
import Link from 'next/link';
import { BlogService } from '@/src/services/blog.service';
import { Calendar, ChevronRight } from 'lucide-react';

export const revalidate = 3600; // Revalidate every hour

export default async function BlogListPage() {
  const blogs = await BlogService.getAllBlogs(true); // Only published

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
      </div>

      {blogs.length === 0 && (
        <div className="text-center py-40 bg-surface-container-low rounded-[3rem] border border-dashed border-outline-variant/20">
          <p className="font-body text-on-surface-variant italic">No stories published yet. Stay tuned!</p>
        </div>
      )}
    </div>
  );
}
