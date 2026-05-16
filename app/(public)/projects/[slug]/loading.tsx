import Skeleton from "@/src/components/admin/ui/Skeleton";

export default function Loading() {
  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-5xl mx-auto pb-24 relative">
      {/* Breadcrumb: Home / Projects / Title */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-12 rounded" />
        <Skeleton className="h-4 w-3 rounded" />
        <Skeleton className="h-4 w-20 rounded" />
        <Skeleton className="h-4 w-3 rounded" />
        <Skeleton className="h-4 w-36 rounded" />
      </div>

      {/* Hero image - aspect-[16/9] on mobile, aspect-[21/9] on md+ */}
      <Skeleton className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl mb-10" />

      {/* Header: status badge + date badge, then title, then description */}
      <header className="mb-12 space-y-6">
        <div className="flex gap-3">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <Skeleton className="h-12 md:h-16 w-3/4 rounded-xl" />
        <div className="space-y-2 max-w-3xl">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-5/6 rounded-lg" />
        </div>
      </header>

      {/* Content: Overview card (full width) */}
      <div className="grid gap-8">
        <section className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 border border-outline-variant/10 space-y-6">
          <Skeleton className="h-8 w-36 rounded-lg" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
          <div className="pt-4 border-t border-outline-variant/10 flex gap-3">
            <Skeleton className="h-12 w-40 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </section>

        {/* 2-column: Key Features | Technologies */}
        <div className="grid md:grid-cols-2 gap-8">
          <section className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 space-y-6">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))}
            </div>
          </section>

          <section className="bg-surface-container-low rounded-[2rem] p-8 border border-outline-variant/10 h-fit space-y-6">
            <Skeleton className="h-7 w-36 rounded-lg" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-20 rounded-xl" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
