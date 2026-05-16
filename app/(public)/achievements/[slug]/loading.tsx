import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function Loading() {
  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-5xl mx-auto pb-24 animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-6">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-40" />
      </div>

      {/* Hero Image - Aspect 16/7 */}
      <Skeleton className="relative w-full aspect-[16/7] rounded-3xl mb-10" />

      {/* Header */}
      <header className="mb-10 space-y-4">
        <div className="flex gap-3">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-32 rounded-full" />
        </div>
        <Skeleton className="h-12 md:h-16 w-3/4 rounded-xl" />
        <Skeleton className="h-6 w-full rounded-lg" />
        <Skeleton className="h-5 w-48 rounded-lg" />
      </header>

      {/* Sections Grid */}
      <div className="grid gap-6">
        <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10 space-y-4">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </section>

        <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10 space-y-4">
          <Skeleton className="h-7 w-48 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-1/2 rounded-md" />
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-6">
          <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10 space-y-6">
            <Skeleton className="h-7 w-32 rounded-lg" />
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </section>

          <section className="bg-surface-container-low rounded-3xl p-7 border border-outline-variant/10 space-y-6">
            <Skeleton className="h-7 w-40 rounded-lg" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="w-1.5 h-1.5 rounded-full shrink-0" />
                  <Skeleton className="h-4 w-32 rounded-md" />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
