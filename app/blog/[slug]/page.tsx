import type { Metadata } from 'next';
import { BlogService } from '@/src/services/blog.service';
import { notFound } from 'next/navigation';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import TiptapRenderer from '@/src/components/shared/TiptapRenderer';
import JsonLd from '@/src/components/common/JsonLd';
import RelatedPosts from '@/src/components/blog/RelatedPosts';

const BASE_URL = "https://www.dimassfeb.com";

type Params = Promise<{ slug: string }>;

// ─── generateMetadata ──────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { slug } = await params;
  const blog = await BlogService.getBlogBySlug(slug);

  if (!blog || !blog.is_published) {
    return {
      title: "Article Not Found",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${BASE_URL}/blog/${blog.slug}`;
  const publishedTime = blog.published_at
    ? new Date(blog.published_at).toISOString()
    : undefined;

  return {
    title: blog.title,
    description: blog.excerpt ?? `Read "${blog.title}" by Dimas Febriyanto`,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: blog.title,
      description: blog.excerpt ?? `Read "${blog.title}" by Dimas Febriyanto`,
      publishedTime,
      authors: ["Dimas Febriyanto"],
      siteName: "Dimas Febriyanto",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.excerpt ?? `Read "${blog.title}" by Dimas Febriyanto`,
      images: ["/og-image.jpg"],
    },
  };
}

// ─── Page Component ────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const blog = await BlogService.getBlogBySlug(slug);

  if (!blog || !blog.is_published) {
    notFound();
  }

  const wordCount = JSON.stringify(blog.content).length;
  const readTime = Math.ceil(wordCount / 1000);

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${blog.slug}#article`,
    headline: blog.title,
    description: blog.excerpt ?? "",
    url: `${BASE_URL}/blog/${blog.slug}`,
    datePublished: blog.published_at
      ? new Date(blog.published_at).toISOString()
      : undefined,
    dateModified: blog.updated_at
      ? new Date(blog.updated_at).toISOString()
      : blog.published_at
        ? new Date(blog.published_at).toISOString()
        : undefined,
    author: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Dimas Febriyanto",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Person",
      "@id": `${BASE_URL}/#person`,
      name: "Dimas Febriyanto",
      url: BASE_URL,
    },
    image: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-image.jpg`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${blog.slug}`,
    },
    isPartOf: {
      "@type": "Blog",
      "@id": `${BASE_URL}/blog#blog`,
    },
    inLanguage: "id-ID",
  };

  return (
    <article className="min-h-screen pt-32 pb-20 px-6 sm:px-10 bg-surface">
      <JsonLd schema={blogPostingSchema} />
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
            {blog.updated_at && blog.updated_at !== blog.published_at && (
              <div className="flex items-center gap-2 text-xs text-on-surface-variant/60">
                <span>Updated:</span>
                <time dateTime={new Date(blog.updated_at).toISOString()}>
                  {new Date(blog.updated_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </time>
              </div>
            )}
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

        <RelatedPosts currentSlug={blog.slug} />

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
