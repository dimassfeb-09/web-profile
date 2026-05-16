import Skeleton from './Skeleton';

export default function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-10" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 flex flex-col space-y-4">
            <Skeleton className="aspect-video w-full rounded-2xl" />
            <div className="space-y-2 flex-grow">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-grow rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
