import Link from "next/link";
import { Calendar } from "lucide-react";
import { BlogService } from "@/src/services/blog.service";

interface RelatedPostsProps {
  currentSlug: string;
  limit?: number;
}

export default async function RelatedPosts({
  currentSlug,
  limit = 3,
}: RelatedPostsProps) {
  const related = await BlogService.getRelatedBlogs(currentSlug, limit);

  if (related.length === 0) return null;

  return (
    <aside className="border-t border-outline-variant/10 pt-12 space-y-6">
      <h2 className="font-headline text-2xl font-bold text-on-surface">
        Related Articles
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block p-5 rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors border border-outline-variant/10"
          >
            <p className="font-headline text-sm font-semibold text-on-surface group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </p>
            {post.excerpt && (
              <p className="mt-2 text-xs text-on-surface-variant line-clamp-2">
                {post.excerpt}
              </p>
            )}
            {post.published_at && (
              <div className="mt-3 flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                <Calendar className="w-3 h-3" />
                {new Date(post.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
            )}
          </Link>
        ))}
      </div>
    </aside>
  );
}
