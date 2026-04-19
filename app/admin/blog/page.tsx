import React from 'react';
import { BlogService } from '@/src/services/blog.service';
import BlogListClient from './BlogListClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog Management | Admin',
};

export default async function BlogManagementPage() {
  const { blogs } = await BlogService.getAllBlogs({ bypassCache: true });
  
  // Map data to match Client Component expectations (serializable strings instead of Date objects)
  const mappedBlogs = blogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    is_published: blog.is_published,
    published_at: blog.published_at ? blog.published_at.toISOString() : null,
    created_at: (blog.created_at || new Date()).toISOString()
  }));
  
  return <BlogListClient initialBlogs={mappedBlogs} />;
}
