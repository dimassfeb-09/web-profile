'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { deleteBlogAction } from '@/src/actions/blog.actions';
import AdminHeader from '@/src/components/admin/ui/AdminHeader';

interface Blog {
  id: string;
  title: string;
  slug: string;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
}

interface BlogListClientProps {
  initialBlogs: Blog[];
}

export default function BlogListClient({ initialBlogs }: BlogListClientProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog? This will also delete all images associated with it.')) return;
    setIsLoading(true);
    try {
      const result = await deleteBlogAction(id);
      if (result.status === 200) {
        router.refresh();
      } else {
        alert(result.message || 'Failed to delete blog');
      }
    } catch (err) {
      alert('Failed to delete blog');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminHeader 
        title="Manage Blog Posts" 
        description="Write, edit, and publish your thoughts."
        buttonLabel="Create Post"
        onButtonClick={() => router.push('/admin/blog/create')}
        icon="add"
      />

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
              {initialBlogs.map((blog) => (
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
                        disabled={isLoading}
                        onClick={() => handleDelete(blog.id)}
                        className="p-2.5 rounded-xl bg-surface-container-high text-error hover:bg-error/10 transition-all border border-outline-variant/10 disabled:opacity-50"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialBlogs.length === 0 && (
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
    </div>
  );
}
