'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import BlogEditor from '@/src/components/admin/BlogEditor';
import { ArrowLeft, Save, Globe, FileText, Eye } from 'lucide-react';
import Link from 'next/link';
import BlogPreviewModal from '@/src/components/admin/BlogPreviewModal';

type Params = Promise<{ id: string }>;

const EditBlog = ({ params }: { params: Params }) => {
  const { id: blogId } = use(params);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: {} as any,
    is_published: false
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`);
        const json = await res.json();
        if (json.status === 200) {
          setFormData({
            title: json.data.title,
            slug: json.data.slug,
            excerpt: json.data.excerpt || '',
            content: json.data.content,
            is_published: json.data.is_published
          });
        } else {
          alert('Blog not found');
          router.push('/admin/blog');
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId, router]);

  const handleSubmit = async (publishOverride?: boolean) => {
    setIsSaving(true);
    try {
      const finalIsPublished = publishOverride !== undefined ? publishOverride : formData.is_published;
      const res = await fetch(`/api/blog/${blogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          is_published: finalIsPublished
        })
      });

      if (res.ok) {
        router.push('/admin/blog');
      } else {
        const data = await res.json();
        alert(data.message || 'Error updating blog');
      }
    } catch (err) {
      alert('Failed to update blog');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/blog"
          className="p-2 rounded-xl bg-surface-container-high text-on-surface hover:bg-white/10 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-headline text-2xl font-bold">Edit Blog Post</h1>
          <p className="font-body text-sm text-on-surface-variant italic">ID: {blogId}</p>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="bg-surface-container-low border border-outline-variant/10 rounded-[2rem] p-6 sm:p-8 space-y-8">
          <div className="form-grid">
            <div className="space-y-2 lg:col-span-6">
              <label className="flex items-center gap-2">
                <FileText className="w-3 h-3 text-primary" /> Title
              </label>
              <input
                type="text"
                required
                placeholder="Post Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div className="space-y-2 lg:col-span-6">
              <label className="flex items-center gap-2">
                <Globe className="w-3 h-3 text-primary" /> Slug
              </label>
              <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/30 rounded-xl px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <span className="text-on-surface-variant text-xs font-bold font-label opacity-50 shrink-0">/blog/</span>
                <input
                  type="text"
                  required
                  placeholder="post-url-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="border-none px-0 focus:ring-0"
                />
              </div>
            </div>

            <div className="space-y-2 lg:col-span-12">
              <label>Excerpt (Short Summary)</label>
              <textarea
                rows={2}
                placeholder="A brief summary for list view..."
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="resize-none"
              />
            </div>

            <div className="space-y-2 lg:col-span-12">
              <label>Content Editor</label>
              <BlogEditor 
                blogId={blogId}
                content={formData.content}
                onChange={(json) => setFormData({ ...formData, content: json })}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-6 border-t border-outline-variant/10">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => setIsPreviewOpen(true)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-secondary/10 text-secondary font-bold hover:bg-secondary/20 transition-all border border-secondary/20 order-3 sm:order-1 sm:mr-auto"
            >
              <Eye className="w-5 h-5" />
              Preview
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit(false)}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-surface-container-highest text-on-surface font-bold hover:bg-surface-container-high transition-all disabled:opacity-50 order-2"
            >
              <FileText className="w-5 h-5" />
              Save Draft
            </button>

            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSubmit(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-50 order-1 sm:order-3"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              ) : (
                <Globe className="w-5 h-5" />
              )}
              {formData.is_published ? 'Update Post' : 'Publish'}
            </button>
          </div>
        </div>
      </form>

      <BlogPreviewModal 
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title={formData.title}
        excerpt={formData.excerpt}
        content={formData.content}
      />
    </div>
  );
};

export default EditBlog;
