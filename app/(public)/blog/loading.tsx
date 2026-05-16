import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen pt-32 pb-20 px-6 sm:px-10 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-10">
        <Skeleton className="h-10 w-24 rounded-xl" />
      </div>
      <div className="space-y-4 mb-16">
        <Skeleton className="h-14 sm:h-20 w-3/4 rounded-2xl" />
        <Skeleton className="h-6 w-1/2 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col bg-surface-container-low border border-outline-variant/10 rounded-[2.5rem] p-8 space-y-6"
          >
            {/* Date */}
            <Skeleton className="h-4 w-32 rounded-full" />
            
            {/* Title */}
            <Skeleton className="h-12 w-full rounded-xl" />
            
            {/* Excerpt */}
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
            
            {/* Link */}
            <Skeleton className="h-4 w-24 rounded-full" />
          </div>
        ))}
      </div>
    </main>
  );
}
