import Link from "next/link";
import JsonLd from "./JsonLd";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  baseUrl?: string;
}

export default function Breadcrumb({
  items,
  baseUrl = "https://www.dimassfeb.com",
}: BreadcrumbProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: `${baseUrl}${item.href}`,
    })),
  };

  return (
    <>
      <JsonLd schema={schema} />
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-on-surface-variant font-body mb-6">
        {items.map((item, index) => (
          <span key={item.href} className="flex items-center gap-2">
            {index > 0 && (
              <span className="text-on-surface-variant/40" aria-hidden>
                /
              </span>
            )}
            {index < items.length - 1 ? (
              <Link
                href={item.href}
                className="hover:text-primary transition-colors hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="text-on-surface font-medium truncate max-w-[200px]"
                aria-current="page"
              >
                {item.label}
              </span>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
