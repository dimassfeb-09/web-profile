import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function ProjectCardSkeleton() {
  return (
    <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 overflow-hidden flex flex-col h-full animate-fade-in">
      {/* Image Aspect 1024/500 */}
      <Skeleton className="aspect-[1024/500] w-full" />
      
      <div className="p-6 flex flex-col flex-grow">
        {/* Tech Stack */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-12 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>

        {/* Title */}
        <Skeleton className="h-7 w-3/4 mb-2 rounded-lg" />
        
        {/* Description */}
        <div className="space-y-1.5 mb-4">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        {/* Features List */}
        <div className="mb-8 space-y-3 flex-grow">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-5 w-5 rounded-full shrink-0" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-4">
          <Skeleton className="h-3 w-20 rounded-sm" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </div>
  );
}
