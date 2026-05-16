import Skeleton from './Skeleton';

export default function FormSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="max-w-4xl space-y-10 animate-fade-in">
      <div className="space-y-2">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>

      <div className="bg-surface-container-low p-8 lg:p-10 rounded-[2.5rem] border border-outline-variant/10 space-y-8">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-24 ml-1" />
            <Skeleton className="h-14 rounded-2xl w-full" />
          </div>
        ))}

        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-14 w-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
