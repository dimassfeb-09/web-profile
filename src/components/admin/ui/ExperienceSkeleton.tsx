import Skeleton from "./Skeleton";

export default function ExperienceSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-48 sm:h-10" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>

      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-container-low border border-outline-variant/10 rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex-grow space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-6 w-32 rounded-full" />
              </div>
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-56" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-24 rounded-xl" />
              <Skeleton className="h-12 w-12 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
