import Skeleton from './Skeleton';

export default function ListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
            </div>
            <Skeleton className="w-8 h-8 rounded-full shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
}
