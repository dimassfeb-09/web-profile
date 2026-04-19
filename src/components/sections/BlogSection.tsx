'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, ArrowRight } from 'lucide-react';
import { BlogData } from '@/src/repositories/blog.repository';

interface BlogSectionProps {
  blogs: BlogData[];
}

const BlogSection: React.FC<BlogSectionProps> = ({ blogs }) => {
  // Hanya ambil maksimal 3
  const displayedBlogs = blogs.slice(0, 3);

  if (displayedBlogs.length === 0) return null;

  return (
    <section className="pt-16 xs:pt-24 lg:pt-32 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 xs:mb-16">
        <div>
          <h2 className="font-headline text-3xl xs:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface mb-4">
            Latest Stories.
          </h2>
          <p className="font-body text-on-surface-variant text-base xs:text-lg max-w-xl">
            Exploring technology, design, and my journey as a software developer.
          </p>
        </div>
        
        <Link 
          href="/blog"
          className="hidden md:flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-label text-sm font-bold hover:bg-primary hover:text-white transition-all duration-300 active:scale-95 group"
        >
          See All Articles
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xs:gap-8">
        {displayedBlogs.map((blog) => (
          <Link 
            key={blog.id} 
            href={`/blog/${blog.slug}`}
            className="group flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 hover:bg-surface-container-high transition-all duration-500 hover:-translate-y-2"
          >
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-4">
              <Calendar className="w-3.5 h-3.5" />
              {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Recent Post'}
            </div>
            
            <h3 className="font-headline text-2xl font-bold text-on-surface mb-4 group-hover:text-primary transition-colors line-clamp-2">
              {blog.title}
            </h3>
            
            <p className="font-body text-on-surface-variant text-sm line-clamp-3 mb-8 flex-grow">
              {blog.excerpt || 'Read more to explore the insights and details of this story...'}
            </p>
            
            <div className="flex items-center gap-2 text-primary font-bold text-sm tracking-wide">
              Read Article
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Mobile "See All" button */}
      <div className="mt-12 md:hidden">
        <Link 
          href="/blog"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary text-white font-label text-sm font-bold active:scale-[0.98] transition-all"
        >
          See All Articles
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
};

export default BlogSection;
