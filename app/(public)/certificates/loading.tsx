import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function Loading() {
  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20 animate-fade-in">
      <div className="mb-12 xs:mb-16">
        <Skeleton className="h-10 xs:h-12 lg:h-16 w-48 mb-4 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4 rounded-lg" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-surface-container-low border border-outline-variant/10 rounded-2xl gap-4"
          >
            <div className="flex items-center gap-5">
              <Skeleton className="w-12 h-12 rounded-full shrink-0" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-64 rounded-lg" />
                <Skeleton className="h-4 w-48 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
