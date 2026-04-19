import { BlogService } from '@/src/services/blog.service';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import TiptapRenderer from '@/src/components/shared/TiptapRenderer';

type Params = Promise<{ slug: string }>;

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const blog = await BlogService.getBlogBySlug(slug);

  if (!blog || !blog.is_published) {
    notFound();
  }

  const wordCount = JSON.stringify(blog.content).length;
  const readTime = Math.ceil(wordCount / 1000);

  return (
    <article className="min-h-screen pt-32 pb-20 px-6 sm:px-10 bg-surface">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Navigation */}
        <Link 
          href="/blog"
          className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors font-body text-sm font-bold group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header */}
        <header className="space-y-6">
          <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-on-surface-variant">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {new Date(blog.published_at!).toLocaleDateString('en-US', {
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
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="font-body text-xl text-on-surface-variant italic border-l-4 border-primary/20 pl-6 py-2">
              {blog.excerpt}
            </p>
          )}
        </header>

        {/* Content */}
        <TiptapRenderer 
          content={blog.content}
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
                <Link href="/#contact" className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:opacity-90 transition-all">
                  Get in Touch
                </Link>
            </div>
          </div>
        </footer>
      </div>
    </article>
  );
}
