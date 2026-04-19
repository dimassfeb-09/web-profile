import React from 'react';
import { BlogService } from '@/src/services/blog.service';
import BlogListClient from './BlogListClient';
import SortFilter from '@/src/components/common/SortFilter';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog Management | Admin',
};

export default async function BlogManagementPage(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const sort = (searchParams.sort === 'oldest' ? 'oldest' : 'newest') as 'newest' | 'oldest';
  const search = searchParams.search || '';

  const { blogs } = await BlogService.getAllBlogs({ 
    bypassCache: true,
    sort,
    search
  });
  
  // Map data to match Client Component expectations (serializable strings instead of Date objects)
  const mappedBlogs = blogs.map(blog => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    is_published: blog.is_published,
    published_at: blog.published_at ? blog.published_at.toISOString() : null,
    created_at: (blog.created_at || new Date()).toISOString()
  }));
  
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SortFilter />
      </div>
      <BlogListClient initialBlogs={mappedBlogs} />
    </div>
  );
}
