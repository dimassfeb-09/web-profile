'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Blog {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

const BlogManagement = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBlogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/blog');
      const json = await res.json();
      if (json.status === 200) {
        setBlogs(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch blogs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This will also delete all images associated with it.')) return;

    try {
      const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBlogs(blogs.filter(b => b.id !== id));
      }
    } catch (err) {
      alert('Failed to delete blog');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold text-on-surface">Manage Blog Posts</h1>
          <p className="font-body text-on-surface-variant">Write, edit, and publish your thoughts.</p>
        </div>
        <Link
          href="/admin/blog/create"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white font-label font-medium hover:opacity-90 transition-all font-body text-sm"
        >
          <span className="material-symbols-outlined">add</span>
          Create Post
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-surface-container-low rounded-3xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden">
          <div className="table-responsive">
            <table className="w-full text-left border-collapse min-w-[800px] sm:min-w-0">
              <thead>
                <tr className="border-b border-outline-variant/10 bg-surface-container-high/50">
                  <th className="p-6 font-headline text-sm font-bold text-on-surface">Title</th>
                  <th className="p-6 font-headline text-sm font-bold text-on-surface">Status</th>
                  <th className="p-6 font-headline text-sm font-bold text-on-surface">Created At</th>
                  <th className="p-6 font-headline text-sm font-bold text-on-surface text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog.id} className="border-b border-outline-variant/10 hover:bg-white/5 transition-colors group">
                    <td className="p-6 font-body text-on-surface">
                      <div className="font-bold line-clamp-1">{blog.title}</div>
                      <div className="text-xs text-on-surface-variant line-clamp-1">/{blog.slug}</div>
                    </td>
                    <td className="p-6 whitespace-nowrap">
                      {blog.is_published ? (
                        <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-[10px] font-bold border border-green-500/20 uppercase tracking-wider">
                          Published
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-bold border border-amber-500/20 uppercase tracking-wider">
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="p-6 font-body text-sm text-on-surface-variant whitespace-nowrap">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/blog/edit/${blog.id}`}
                          className="p-2.5 rounded-xl bg-surface-container-high text-on-surface hover:text-primary transition-all border border-outline-variant/10"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.id)}
                          className="p-2.5 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all border border-outline-variant/10"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {blogs.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-on-surface-variant font-body">
                      No blog posts found. Start by creating one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogManagement;
