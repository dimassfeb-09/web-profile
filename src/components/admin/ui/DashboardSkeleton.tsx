import Skeleton from './Skeleton';

export default function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-fade-in">
      <div>
        <Skeleton className="h-10 w-64 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-surface-container-low p-6 lg:p-8 rounded-[2rem] border border-outline-variant/10 flex items-center gap-6">
            <Skeleton className="w-14 h-14 rounded-2xl shrink-0" />
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 space-y-6">
          <Skeleton className="h-7 w-40" />
          <div className="grid grid-cols-2 gap-4">
             {Array.from({ length: 4 }).map((_, i) => (
               <Skeleton key={i} className="h-14 rounded-2xl w-full" />
             ))}
          </div>
        </div>

        <div className="bg-surface-container-low p-8 rounded-[2.5rem] border border-outline-variant/10 space-y-6">
          <Skeleton className="h-7 w-40" />
          <div className="space-y-4">
             {Array.from({ length: 3 }).map((_, i) => (
               <Skeleton key={i} className="h-14 rounded-2xl w-full" />
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}
