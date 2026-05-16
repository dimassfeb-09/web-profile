import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function Loading() {
  return (
    <article className="min-h-screen pt-32 pb-20 px-6 sm:px-10 bg-surface relative animate-fade-in">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Back Button Skeleton */}
        <div className="mb-4">
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Breadcrumb Skeleton */}
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-40" />
        </div>

        {/* Header Skeleton */}
        <header className="space-y-6">
          <div className="flex gap-6">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <Skeleton className="h-12 sm:h-20 w-full rounded-2xl" />
          <div className="pl-6 py-2 border-l-4 border-outline-variant/20 space-y-2">
            <Skeleton className="h-6 w-full rounded-md" />
            <Skeleton className="h-6 w-3/4 rounded-md" />
          </div>
        </header>

        {/* Content Body Skeleton */}
        <div className="space-y-8 py-8">
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-11/12 rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-4/5 rounded-md" />
          <Skeleton className="h-64 w-full rounded-3xl" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>

        {/* Author Bio Skeleton */}
        <div className="bg-surface-container-low rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start border border-outline-variant/10">
          <Skeleton className="w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0" />
          <div className="flex-grow space-y-3 w-full">
            <Skeleton className="h-7 w-48 rounded-lg mx-auto sm:mx-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md mx-auto sm:mx-0" />
            </div>
            <Skeleton className="h-5 w-32 rounded-md mx-auto sm:mx-0" />
          </div>
        </div>
      </div>
    </article>
  );
}
