'use client';

import React from 'react';
import { JSONContent } from '@tiptap/react';
import { Calendar, Clock, X, ArrowLeft } from 'lucide-react';
import TiptapRenderer from '@/src/components/shared/TiptapRenderer';

interface BlogPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  excerpt: string;
  content: JSONContent;
}

const BlogPreviewModal: React.FC<BlogPreviewModalProps> = ({
  isOpen,
  onClose,
  title,
  excerpt,
  content
}) => {
  if (!isOpen) return null;

  const wordCount = JSON.stringify(content).length;
  const readTime = Math.ceil(wordCount / 1000);

  return (
    <div className="fixed inset-0 z-[100] bg-surface flex flex-col animate-fade-in overflow-hidden">
      {/* Admin Bar */}
      <div className="h-14 bg-surface-container-high border-b border-outline-variant/10 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 p-5">
          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest border border-primary/20">
            Preview Mode
          </div>
          <span className="text-xs text-on-surface-variant font-body hidden sm:inline">
            This is exactly how your post will look to readers.
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label text-sm font-bold bg-surface rounded-full px-4 py-1.5 border border-outline-variant/20 hover:border-primary"
        >
          <X className="w-4 h-4" />
          Close Preview
        </button>
      </div>

      {/* Preview Content Area */}
      <div className="flex-grow overflow-y-auto custom-scrollbar">
        <article className="min-h-screen pt-32 pb-32 px-6 sm:px-10 bg-surface">
          <div className="max-w-3xl mx-auto space-y-16">
            {/* Mock Navigation */}
            <div className="inline-flex items-center gap-2 text-on-surface-variant transition-colors font-body text-sm font-bold group opacity-50 cursor-not-allowed">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </div>

            {/* Header */}
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  {readTime} min read
                </div>
              </div>

              <h1 className="font-headline text-4xl sm:text-6xl font-bold text-on-surface leading-tight">
                {title || 'Untitled Blog Post'}
              </h1>

              {excerpt && (
                <p className="font-body text-xl text-on-surface-variant italic border-l-4 border-primary/20 pl-6 py-2">
                  {excerpt}
                </p>
              )}
            </header>

            {/* Content */}
            <TiptapRenderer 
              content={content}
              className="tiptap-content w-full max-w-none focus:outline-none"
            />

            {/* Footer */}
            <footer className="pt-12 border-t border-outline-variant/10">
              <div className="bg-surface-container-low rounded-[2rem] p-8 text-center space-y-4">
                <h3 className="font-headline text-xl font-bold text-on-surface">Liked this article?</h3>
                <p className="font-body text-on-surface-variant text-sm">
                  Feel free to share it with your network or reach out if you have any questions!
                </p>
                <div className="flex justify-center gap-4 pt-4">
                    <button className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all cursor-not-allowed opacity-50">
                      Get in Touch
                    </button>
                </div>
              </div>
            </footer>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogPreviewModal;
