import Skeleton from '@/src/components/admin/ui/Skeleton';

export default function Loading() {
  return (
    <main className="pt-24 lg:pt-32 px-6 md:px-12 lg:px-16 2xl:px-24 max-w-[1920px] mx-auto pb-20 animate-fade-in">
      <div className="mb-12 space-y-4">
        <Skeleton className="h-14 w-64 rounded-2xl" />
        <Skeleton className="h-6 w-96 rounded-xl" />
      </div>
      <div className="mb-8 flex justify-between items-end">
        <Skeleton className="h-10 w-24 rounded-xl" />
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-low border border-outline-variant/10 rounded-3xl overflow-hidden flex flex-col"
          >
            {/* Image Aspect 1024/500 */}
            <Skeleton className="aspect-[1024/500] w-full" />
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <Skeleton className="h-6 w-3/4 rounded-lg" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              
              <div className="space-y-2">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-5/6 rounded-md" />
              </div>
              
              <Skeleton className="h-4 w-24 rounded-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
